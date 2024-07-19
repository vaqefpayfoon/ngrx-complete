import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Auth, AuthFacade } from '@neural/auth';
import { ISalesAdvisor } from '@neural/modules/administration';
import { IBC, traverseAndRemove } from '@neural/shared/data';
import { Observable, of } from 'rxjs';
import { LeadFacade } from '../../+state';
import { ILead } from '../../models';

@Component({
  selector: 'neural-lead',
  templateUrl: './lead.component.html',
  styleUrls: ['./lead.component.scss'],
})
export class LeadComponent implements OnInit {
  filteredOptions: Observable<ISalesAdvisor.ISADocument[]>;
  form: FormGroup;
  error$: Observable<any>;
  selectedCorporate$: Observable<Auth.ICorporates>;
  selectedBranch$: Observable<Auth.IBranch>;
  salesAdvisors$: Observable<ISalesAdvisor.ISADocument[]>;
  corporates$: Observable<Auth.ICorporates[]>;
  selectedCorporate: Auth.ICorporates;
  selectedBranch: Auth.IBranch;
  authCorporates: Auth.ICorporates[] = [];
  brands$: Observable<string[]>;
  isSuperAdmin$: Observable<boolean>;
  account$: Observable<Auth.AccountClass>;
  account: Auth.AccountClass;
  bc: IBC[];
  errorMessage: string | null;
  title = 'Create';
  constructor(
    private fb: FormBuilder,
    private leadFacade: LeadFacade,
    private authFacade: AuthFacade
  ) {}
  ngOnInit(): void {
    this.initialData();
  }
  initialData() {
    this.bc = [
      {
        name: 'hub',
        path: null,
      },
      {
        name: 'lead',
        path: '/app/hub/lead/leadList',
      },
    ];
    this.brands$ = this.leadFacade.globalBrands$;
    this.error$ = this.leadFacade.error$;
    this.corporates$ = this.authFacade.corporates$;
    this.selectedCorporate$ = this.authFacade.selectedCorporate;
    this.selectedCorporate$.subscribe(res => {
      this.selectedCorporate = res;
    })
    this.selectedBranch$ = this.authFacade.selectedBranch;
    this.corporates$.subscribe((res) => {
      this.authCorporates = res;
    });
    this.isSuperAdmin$ = this.authFacade.isSuperAdmin$;
    this.account$ = this.authFacade.account$;
    this.account$.subscribe(res => {
      this.account = res;
      if(this.getRole) {
        this.form = this.fb.group({
          email: [
            '',
            Validators.compose([Validators.required, Validators.email]),
          ],
          fullName: [''],
          salesAdvisorUuid: ['', Validators.compose([Validators.required])],
          branchUuid: [''],
          corporateUuid: [''],
          brandUuid: [''],
        });
      } else {
        this.form = this.fb.group({
          email: [
            '',
            Validators.compose([Validators.required, Validators.email]),
          ],
          fullName: [''],
          corporateUuid: [''],
        });
      }
    });
  }
  get salesAdvisorUuid(): FormControl {
    return this.form.get('salesAdvisorUuid') as FormControl;
  }
  onCreate(form: FormGroup): void {
    const { value, valid } = form;

    if (valid) {
      traverseAndRemove(value);
      if (!value.corporateUuid) {
        value.corporateUuid = this.selectedCorporate.uuid;
      }
      const create: ILead.ICreate = {
        corporateUuid: value.corporateUuid,
        email: value.email,
        fullName: value.fullName,
        salesAdvisorUuid: value.salesAdvisorUuid,
      };
      this.leadFacade.create(create);
      // setTimeout(() => {
      //   this.leadFacade.onRedirect();
      // }, 2000);
    }
  }
  onReset() {
    this.salesAdvisorUuid.patchValue('');
    this.salesAdvisorUuid.updateValueAndValidity();
    this.errorMessage = null;
  }
  displayFn(account: ISalesAdvisor.ISADocument): string {
    return account && account?.identity?.fullName
      ? `${account?.identity?.salutation} ${account?.identity?.fullName}`
      : '';
  }
  onBranchChanged() {
    this.form.patchValue({ salesAdvisorUuid: '' });
    this.form.patchValue({ brandUuid: '' });
    this.errorMessage = null;
    this.leadFacade.onResetSalesAdvisor();
    if (!this.selectedCorporate || !this.form.value.branchUuid) {
      this.errorMessage = 'invalid branch';
      return;
    }
    this.filteredOptions = this.leadFacade.salesAdvisors$;
    const sa: ILead.SA = {
      corporate: this.selectedCorporate.uuid,
      branch: this.form.value.branchUuid,
    };
    this.leadFacade.onLoadSalesAdvisor(sa);
  }
  onSalesAdvisorChanged(brand) {
    this.form.patchValue({ salesAdvisorUuid: '' });
    this.errorMessage = null;
    this.leadFacade.onResetSalesAdvisor();
    if (!this.selectedCorporate || !this.form.value.branchUuid) {
      this.errorMessage = 'invalid branch';
      return;
    }
    this.filteredOptions = this.leadFacade.salesAdvisors$;
    const sa: ILead.SA = {
      corporate: this.selectedCorporate.uuid,
      branch: this.form.value.branchUuid,
      brand,
    };
    this.leadFacade.onLoadSalesAdvisor(sa);
  }
  branches(): Auth.IBranch[] {
    if (this.selectedCorporate) {
      return this.authCorporates.find(
        (corporate) => corporate?.uuid === this.selectedCorporate.uuid
      )?.branches;
    } else {
      const arr: Auth.IBranch[] = [];
      return arr;
    }
  }
  onBranchChange() {
    this.leadFacade.onRedirect();
  }
  get getRole() {
    if(this.account?.permissions?.operationRole) {
      return this.account?.permissions?.operationRole == 'SALES_ADVISOR' ? false : true
    }
    return true
  }
}
