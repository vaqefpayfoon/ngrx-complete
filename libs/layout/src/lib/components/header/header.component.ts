import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  Inject,
  ChangeDetectorRef,
} from '@angular/core';

// Auth Interface
import { Auth } from '@neural/auth';

// Material Form
import { FormControl } from '@angular/forms';

// RxJs
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

// Material Event
import {
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
} from '@angular/material/autocomplete';
import { MatSelectChange } from '@angular/material/select';

// Environment
import { ENVIRONMENT, Environment } from '@neural/environment';

@Component({
  selector: 'neural-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnChanges {
  @Input() account: Auth.AccountClass;

  @Input() permissions: Auth.IPermissions;

  @Input() menus: any;

  @Input() corporates: Auth.ICorporates[];

  @Input() selectedCorporate: Auth.ICorporates | null;

  @Input() selectedBranch: Auth.IBranch | null;

  @Input() branches: { name: string; uuid: string }[];

  @Input() router: any;

  @Input() isPasswordExpired: boolean;

  @Output() corporateChange = new EventEmitter<Auth.ICorporates>();

  @Output() branchChange = new EventEmitter<{ name: string; uuid: string }>();

  @Output() resetSwitcher = new EventEmitter<string>();

  @Output() redirectToHome = new EventEmitter<boolean>();

  @Output() contactUs = new EventEmitter();

  corporateCtrl = new FormControl();
  filteredCorporate: Observable<Auth.ICorporates[]>;

  branchCtrl = new FormControl({ value: '', disabled: true });
  filteredBranch: Observable<Auth.IBranch[]>;

  constructor(
    @Inject(ENVIRONMENT) private readonly env: Environment,
    private cd: ChangeDetectorRef
  ) {
    this.filteredCorporate = this.corporateCtrl.valueChanges.pipe(
      startWith(''),
      map((corporate) => {
        return corporate
          ? this._filterCorporate(corporate)
          : this.corporates.slice();
      })
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedCorporate && changes.selectedCorporate.currentValue) {
      this.corporateCtrl.setValue(this.selectedCorporate);
    }

    if (changes.branches && changes.branches.currentValue) {
      this.filteredBranch = this.branchCtrl.valueChanges.pipe(
        startWith(''),
        map((branch) => {
          return branch ? this._filterBranch(branch) : this.branches.slice();
        })
      );
      this.branchCtrl.enable();
    }

    if (
      changes.selectedBranch &&
      changes.selectedBranch.currentValue &&
      !!this.selectedBranch
    ) {
      this.branchCtrl.setValue(this.selectedBranch);

      this.cd.detectChanges();
    }
  }

  get isOperation(): boolean {
    if (
      !!this.account &&
      !!this.account.permissions &&
      this.account.permissions.operationRole === Auth.OperationRole.CSO
    ) {
      return true;
    }
    return false;
  }

  get name() {
    return this.account.identity;
  }

  displayFn(corporate?: Auth.ICorporates): string | undefined {
    return corporate ? corporate.name : undefined;
  }

  displayBranchFn(branch?: Auth.ICorporates): string | undefined {
    return branch ? branch.name : undefined;
  }

  selectCorporate(event: MatAutocompleteSelectedEvent) {
    const { uuid, name, branches } = event.option.value;
    this.corporateChange.emit({
      uuid,
      name,
      branches,
    });
  }

  selectBranch(event: MatAutocompleteSelectedEvent) {
    const { uuid, name } = event.option.value;
    this.branchChange.emit({
      name,
      uuid,
    });
  }

  onChangeCorporate(event: MatSelectChange) {
    const { value } = event;
    this.corporateChange.emit(value);

    const [firstBranch] = value.branches;
    this.branchChange.emit(firstBranch);
  }

  onChangeBranch(event: MatSelectChange) {
    const { value } = event;
    this.branchChange.emit(value);
  }

  // If you are using mate select pls remove in  production

  corporateCompareFn(
    corporate1: Auth.ICorporates,
    corporate2: Auth.ICorporates
  ) {
    return corporate1 && corporate2
      ? corporate1.uuid === corporate2.uuid
      : corporate1 === corporate2;
  }

  branchCompareFn(branch1: Auth.IBranch, branch2: Auth.IBranch) {
    return branch1 && branch2
      ? branch1.uuid === branch2.uuid
      : branch1 === branch2;
  }

  get image() {
    return this.account ? this.account.image : null;
  }

  cancel(event: string) {
    switch (event) {
      case 'selectedCorporate':
        this.corporateCtrl.reset();
        this.branchCtrl.reset();
        this.branchCtrl.disable();
        this.resetSwitcher.emit('selectedCorporate');
        this.resetSwitcher.emit('selectedBranch');
        break;
      case 'selectedBranch':
        this.branchCtrl.reset();
        this.resetSwitcher.emit(event);
        break;
    }
  }

  openPanelCorporate(trigger: any) {
    const { products } = this.account;

    if (this.env.staging || this.env.development) {
      const { ProductGroups } = Auth;

      const hello = ProductGroups.Operation.staging.filter(
        (item) => products.indexOf(item) < 0
      );

      if (hello.length !== 0) {
        trigger.openPanel();
      }
    }
  }

  openPanel(trigger: any) {
    const { products } = this.account;

    if (this.env.staging || this.env.development) {
      const { ProductGroups } = Auth;

      const hello = ProductGroups.Operation.staging.filter(
        (item) => products.indexOf(item) < 0
      );

      if (hello.length !== 0) {
        trigger.openPanel();
      }
    }
  }

  goToDashboard() {
    this.redirectToHome.emit(true);
  }

  private _filterCorporate(value: string): Auth.ICorporates[] {
    const filterValue = value;

    return this.corporates.filter(
      (corporate) => corporate.name.toLowerCase().indexOf(filterValue) === 0
    );
  }

  private _filterBranch(value: string): Auth.IBranch[] {
    const filterValue = value;

    return this.branches.filter(
      (branches) => branches.name.toLowerCase().indexOf(filterValue) === 0
    );
  }

  OnContactUs() {
    this.contactUs.emit(true);
  }
}
