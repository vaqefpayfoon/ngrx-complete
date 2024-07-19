import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  OnChanges,
  SimpleChanges
} from '@angular/core';

// Models
import { Auth } from '@neural/auth';

// Angular Form Builder
import {
  FormBuilder,
  FormControl,
  Validators,
  FormGroup
} from '@angular/forms';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  MatAutocompleteSelectedEvent,
  MatAutocomplete
} from '@angular/material/autocomplete';

import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';

@Component({
  selector: 'neural-account-branch',
  templateUrl: './account-branch.component.html',
  styleUrls: ['./account-branch.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountBranchComponent implements OnChanges {
  exists = false;

  @Input() allCorporate: Auth.ICorporates[];
  @Input() allBranches: Auth.IBranch[];
  @Input() error: any;
  @Input() loading: any;
  @Input() branch: Auth.IBranch[];
  @Input() selectedCorporate: Auth.ICorporates[];
  @Output() BranchChange = new EventEmitter<Auth.IBranch>();

  isSelect: boolean;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  branchCtrl = new FormControl();
  filteredBranch: Observable<Auth.IBranch[]>;
  branches: string[] = [];

  @ViewChild('branchInput') branchInput: ElementRef<
    HTMLInputElement
  >;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.initialForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.allBranches && changes.allBranches.currentValue) {
      if (this.allBranches.length === 0) {
        this.removeAll();
      }

      this.filteredBranch = this.branchCtrl.valueChanges.pipe(
        startWith(''),
        map((branch: Auth.IBranch | null) => {
          return branch ? this._filter(branch.name) : this.allBranches.slice();
        })
      );
    }

    if (changes.selectedCorporate && changes.selectedCorporate.currentValue) {
      const [{ uuid }] = this.selectedCorporate;
      const index = this.allCorporate.findIndex(x => x.uuid === uuid);
      if(index !== -1){

        this.allCorporate[index].branches.map(x=> this.BranchChange.emit(x));

        this.branches = this.allCorporate[index].branches.map(x=> x.name);
      }
    }

    if (this.branch && changes.branch && changes.branch.currentValue) {
      this.branches = this.branch.map(branch => branch.name);
      this.form.get('name').setValue(this.branches);
      // enable form
      this.exists = true;
      this.isSelect = true;
    }
    if (changes && changes.error && !changes.error.firstChange) {
      this.form.enable();
    }
  }

  initialForm() {
    this.form = this.fb.group({
      name: ['', Validators.required]
    });
  }

  add(event: MatChipInputEvent): void {
    // Add country only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our country
      if ((value || '').trim()) {
        this.branches.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.branchCtrl.setValue(null);
    }
  }

  remove(branch?: string) {
    const index = this.branches.indexOf(branch);

    if (index >= 0) {
      this.branches.splice(index, 1);
    }

    this.isSelect = false;

    this.branchInput.nativeElement.value = '';

    this.form.reset();
    this.initialForm();
  }

  removeAll() {
    this.branches = [];
    this.form.reset();
    this.branchInput.nativeElement.value = '';
    this.isSelect = false;
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.BranchChange.emit(event.option.value);
    this.branches.push(event.option.viewValue);

    this.allBranches = this.allBranches.filter(
      x => x.name !== event.option.viewValue
    );

    this.form.get('name').setValue(this.branches);
    this.branchInput.nativeElement.value = '';
    this.branchCtrl.setValue(null);
    this.isSelect = true;
  }

  private _filter(value: string): Auth.IBranch[] {
    const filterValue = value;
    return this.allBranches.filter(
      branch => branch.name.indexOf(filterValue) === 0
    );
  }

  displayFn(branch?: Auth.IBranch): string | undefined {
    return branch ? branch.name : undefined;
  }
}
