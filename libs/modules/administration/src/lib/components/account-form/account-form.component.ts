import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  Inject,
} from '@angular/core';

// Models
import { IGroup, IAccount } from '../../models';
// Auth
import { Auth, AuthFacade } from '@neural/auth';

// RxJs
import { Observable } from 'rxjs';

// Angular Form Builder
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl,
} from '@angular/forms';

// Environment
import { ENVIRONMENT, Environment } from '@neural/environment';

// Location for Back button
import { Location } from '@angular/common';

// Material Event
import { MatSelectChange } from '@angular/material/select';

// Permission Tags
import { permissionTags } from '@neural/shared/data';

// Validation
import { ValidationService } from '@neural/ui';

// Functions
import { traverseAndRemove } from '@neural/shared/data';

import { Buttons, ButtonTypes } from '@neural/shared/classes';

// Moment
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment } from 'moment';

import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';

const moment = _rollupMoment || _moment;

// Format date picker
const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'neural-account-form',
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class AccountFormComponent implements OnChanges {
  @Input() router: any;

  @Input() codes: Auth.IPhoneCode[];

  @Input() groups: IGroup.IDocument[];

  @Input() account: IAccount.IDocument;

  @Input() searchedAccount: IAccount.IDocument;

  @Input() error: any;

  @Input() permissions: any;

  @Input() isCDK: boolean;

  @Input() authCorporates: Auth.ICorporates[];

  @Input() selectCorporate: Auth.ICorporates;

  @Input() brands: string[];

  authBranches: Auth.IBranch[] | any = [];

  account$: Observable<Auth.AccountClass>;

  productLists: any;

  accountType = IAccount.AccountType;

  salutationList = IAccount.Salutation;

  documentTypeList = IAccount.DocumentType;

  operationRoles = IAccount.OperationRole;

  @Output()
  create: EventEmitter<IAccount.ICreate> = new EventEmitter<IAccount.ICreate>();

  @Output()
  update: EventEmitter<IAccount.IDocument> = new EventEmitter<
    IAccount.IDocument
  >();

  @Output()
  updateSearchedAccount: EventEmitter<IAccount.IDocument> = new EventEmitter<
    IAccount.IDocument
  >();

  @Output()
  passChanges: EventEmitter<IAccount.IUpdatePass> = new EventEmitter<
    IAccount.IUpdatePass
  >();

  @Output() loaded: EventEmitter<IAccount.IDocument> = new EventEmitter<
    IAccount.IDocument
  >();

  @Output() corporateChange = new EventEmitter<boolean>();

  @Output() deleted = new EventEmitter<IAccount.IDocument>();

  @Output() resynced = new EventEmitter<IAccount.IDocument>();

  exists = false;
  editable = false;

  buttons = new Buttons();

  form = this.fb.group({
    identity: this.fb.group({
      salutation: [''],
      fullName: ['', Validators.required],
    }),
    document: this.fb.group({
      id: [''],
      type: [''],
    }),
    email: ['', Validators.compose([Validators.required, Validators.email])],
    phone: this.fb.group({
      code: ['', Validators.compose([Validators.required])],
      number: ['', Validators.compose([Validators.required])],
    }),
    integrations: this.fb.group({
      cdk: this.fb.group({
        serviceAdvisorId: [''],
      }),
      fortellis: this.fb.group({
        customerId: [''],
      }),
    }),
    password: [
      '',
      Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(30),
        ValidationService.password,
      ]),
    ],
    permissions: this.fb.group({
      brands: [''],
      divisions: [''],
    }),
    products: [''],
    corporate: ['', Validators.required],
    dateOfBirth: [''],
    drivingLicenseExpiry: [''],
  });

  updatePassword = this.fb.group({
    password: [
      '',
      Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(30),
        ValidationService.password,
      ]),
    ],
  });

  hide = true;

  selectedCorporate = new FormControl(
    {
      value: '',
      disabled: this.formDisabled,
    },
    Validators.required
  );

  selectedBranches = new FormControl(
    {
      value: '',
      disabled: this.formDisabled,
    },
    Validators.required
  );

  constructor(
    private authFacade: AuthFacade,
    private fb: FormBuilder,
    private location: Location,
    private validationService: ValidationService,
    @Inject(ENVIRONMENT) private readonly environment: Environment
  ) {
    this.account$ = this.authFacade.account$;

    if (this.env.development || this.env.staging) {
      this.productLists = [
        ...Auth.ProductGroups.Admin.staging,
        ...Auth.ProductGroups.Nerv.staging,
        ...Auth.ProductGroups.Operation.staging,
        ...Auth.ProductGroups.SalesAdvisor.staging,
        ...Auth.ProductGroups.ServiceAdvisor.staging,
      ];
    }

    if (this.env.sandbox) {
      this.productLists = [
        ...Auth.ProductGroups.Admin.sandbox,
        ...Auth.ProductGroups.Nerv.sandbox,
        ...Auth.ProductGroups.Operation.sandbox,
        ...Auth.ProductGroups.SalesAdvisor.sandbox,
        ...Auth.ProductGroups.ServiceAdvisor.sandbox,
      ];
    }

    if (this.env.production) {
      this.productLists = [
        ...Auth.ProductGroups.Admin.production,
        ...Auth.ProductGroups.Nerv.production,
        ...Auth.ProductGroups.Operation.production,
        ...Auth.ProductGroups.SalesAdvisor.production,
        ...Auth.ProductGroups.ServiceAdvisor.production,
      ];
    }
  }

  get buttonTypes() {
    return ButtonTypes;
  }

  get env() {
    return this.environment;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.router && changes.router.currentValue) {
      const { type } = this.router.state.data;

      if (type === IAccount.AccountType.ADMIN) {
        this.permissionsGroup.addControl(
          'adminGroupUuid',
          this.fb.control('', Validators.compose([Validators.required]))
        );

        const nerv = this.productLists.filter((x: string) =>
          x.includes('.nerv')
        );

        this.products.patchValue(nerv);
      }

      if (type === IAccount.AccountType.OPERATION) {
        this.permissionsGroup.addControl(
          'operationRole',
          this.fb.control('', Validators.compose([Validators.required]))
        );

        this.permissionsGroup.addControl('adminGroupUuid', this.fb.control(''));

        const operation = this.productLists.filter(
          (x: string) => x.includes('.operation') || x.includes('.nerv')
        );

        this.products.patchValue(operation);
      }

      if (type === IAccount.AccountType.CUSTOMER) {
        this.selectedBranches.clearValidators();
        this.selectedBranches.updateValueAndValidity();

        this.form.disable();
      }

      if (type === IAccount.AccountType.ALL) {
        this.permissionsGroup.addControl('operationRole', this.fb.control(''));

        this.permissionsGroup.addControl('adminGroupUuid', this.fb.control(''));

        this.selectedBranches.clearValidators();
        this.selectedBranches.updateValueAndValidity();

        this.form.disable();
      }
    }

    if (this.authCorporates && this.account) {
      this._initialForm();
    }

    if (changes.searchedAccount && changes.searchedAccount.currentValue) {
      this._initialFormBySearch();
    }

    if (changes.selectCorporate && !changes.selectCorporate.firstChange) {
      this.corporateChange.emit(true);
    }
  }

  private _initialForm() {
    this.form.reset();
    this.selectedCorporate.reset();
    this.selectedBranches.reset();

    const {
      permissions,
      identity,
      document,
      phone,
      email,
      products,
      corporate,
      dateOfBirth,
      drivingLicenseExpiry,
      integrations,
    } = this.account;
    this.exists = true;

    const patchValue = {
      email,
      products,
      corporate,
      dateOfBirth,
      drivingLicenseExpiry,
    };

    this.form.patchValue(patchValue);
    if (phone) {
      this.phoneGroup.patchValue(phone);
    }

    if (integrations) {
      this.integrations.patchValue(integrations);
    }

    if (permissions) {
      this.permissionsGroup.patchValue(permissions);
    }

    if (identity) {
      this.identity.patchValue(identity);
    }

    if (document) {
      this.document.patchValue(document);
    }

    this.loaded.emit(this.account);

    // update corporate and branch selection

    if (!!corporate) {
      this.selectedCorporate.patchValue(corporate.uuid);

      const { branches } = this.authCorporates.find(
        (authCorporate) => authCorporate.uuid === corporate.uuid
      );

      if (!!branches && !!corporate?.branches) {
        const selected = branches.filter((allBranches) =>
          corporate.branches.includes(allBranches.uuid)
        );

        this.selectedBranches.patchValue(selected);
      }

      this.selectedCorporate.disable();
      this.selectedBranches.disable();
    }

    this.form.disable();
  }

  private _initialFormBySearch() {
    const {
      permissions,
      identity,
      document,
      phone,
      email,
      products,
      corporate,
      dateOfBirth,
      drivingLicenseExpiry,
      integrations,
    } = this.searchedAccount;

    this.exists = true;

    const patchValue = {
      email,
      products,
      corporate,
      dateOfBirth,
      drivingLicenseExpiry,
    };

    this.form.patchValue(patchValue);
    if (phone) {
      this.phoneGroup.patchValue(phone);
    }

    if (permissions) {
      this.permissionsGroup.patchValue(permissions);
    }

    if (identity) {
      this.identity.patchValue(identity);
    }

    if (integrations) {
      this.integrations.patchValue(integrations);
    }

    if (document) {
      this.document.patchValue(document);
    }

    this.loaded.emit(this.searchedAccount);

    if (!!corporate) {
      this.selectedCorporate.patchValue(corporate.uuid);

      const { branches } = this.authCorporates.find(
        (authCorporate) => authCorporate.uuid === corporate.uuid
      );

      if (!!branches && !!corporate?.branches) {
        const selected = branches.filter((allBranches) =>
          corporate.branches.includes(allBranches.uuid)
        );

        this.selectedBranches.patchValue(selected);
      }
    }
    this.form.enable();
    this.password.disable();
    this.editable = true;
  }

  get identity() {
    return this.form.get('identity') as FormGroup;
  }

  get corporate() {
    return this.form.get('corporate') as FormControl;
  }

  get group() {
    return this.account ? this.account.group : null;
  }

  get document() {
    return this.form.get('document') as FormGroup;
  }

  get password() {
    return this.form.get('password') as FormGroup;
  }

  get email() {
    return this.form.get('email').value;
  }

  get permissionsGroup() {
    return this.form.get('permissions') as FormGroup;
  }

  get adminGroupUuid() {
    return this.permissionsGroup.get('adminGroupUuid') as FormControl;
  }

  get operationRole() {
    return this.permissionsGroup.get('operationRole') as FormControl;
  }

  get image() {
    return this.account && this.account.image ? this.account.image : '';
  }

  get nameFormGroup() {
    return this.form.get('name') as FormGroup;
  }

  get phoneGroup() {
    return this.form.get('phone') as FormGroup;
  }
  get integrations() {
    return this.form.get('integrations') as FormGroup;
  }
  get cdk() {
    return this.integrations.get('cdk') as FormGroup;
  }
  get products() {
    return this.form.get('products') as FormControl;
  }

  createAccount(form: FormGroup) {
    const { value, valid } = form;
    this.validationService.validateAllFormFields(form);

    if (
      valid &&
      this.selectedCorporate.valid &&
      this.selectedBranches.valid &&
      this.createPermission
    ) {
      traverseAndRemove(value);
      this.create.emit(value);
      form.disable();
    }
  }

  updateAccount(form: FormGroup) {
    const { valid, value, pristine } = form;

    const { type } = this.router.state.data;

    this.validationService.validateAllFormFields(form);

    if (
      valid &&
      !pristine &&
      this.selectedCorporate.valid &&
      this.selectedBranches.valid &&
      this.updatePermission
    ) {
      if (IAccount.AccountType[type] === IAccount.AccountType.ALL) {

        const updateSearchedDocument = {
          ...this.searchedAccount,
          ...value,
        };

        this.updateSearchedAccount.emit(updateSearchedDocument);
      } else {
        const updateDocument = {
          ...this.account,
          ...value,
        };

        this.update.emit(updateDocument);
      }

      this.form.disable();
    }
  }

  updatePass(form: FormGroup) {
    const { valid, value, touched } = form;

    this.validationService.validateAllFormFields(form);

    if (valid && touched) {
      this.passChanges.emit({
        ...(this.account ?? this.searchedAccount),
        ...value,
      });
    }
  }

  back() {
    return this.location.back();
  }

  branches(uuid: string): Auth.IBranch[] {
    return this.authCorporates.find((corporate) => corporate?.uuid === uuid)
      ?.branches;
  }

  onChangeBranch(event: MatSelectChange) {
    const { value } = event;

    if (value) {
      const branches = value.map((x) => x.uuid);

      const uuid = this.selectedCorporate.value;

      this.corporate.patchValue({
        uuid,
        branches,
      });
    }

    this.form.markAllAsTouched();
    this.form.markAsDirty();
  }

  onChangeDivision(event: MatSelectChange) {
    const { value } = event;

    if (value) {
      this.divisions.patchValue(value);
    }

    this.form.markAllAsTouched();
    this.form.markAsDirty();
  }

  compareFn(branch1: Auth.IBranch, branch2: Auth.IBranch): boolean {
    return branch1 && branch2
      ? branch1.uuid === branch2.uuid
      : branch1 === branch2;
  }

  bahaviorForm(event: boolean) {
    const { type } = this.router.state.data;

    if (event) {
      this.form.enable();
      this.selectedCorporate.enable();
      this.selectedBranches.enable();
      if (this.account) {
        this.password.disable();
      }
    } else {
      if (!this.exists) {
        this.back();
      } else {
        if (type === IAccount.AccountType.ALL) {
          this._initialFormBySearch();
        } else {
          this._initialForm();
        }
      }
    }
  }

  onChangeRole(event: MatSelectChange) {
    const { value } = event;

    const search =
      IAccount.OperationRole.SALES_ADVISOR === value
        ? 'salesadvisor'
        : 'serviceadvisor';

    const filtered: string[] = (this.products.value as string[]).filter(
      (x: string) =>
        !x.includes('salesadvisor') || !x.includes('serviceadvisor')
    );

    const operation = this.productLists.filter((x: string) =>
      x.includes(search)
    );

    const patchValue = [...filtered, ...operation];

    this.products.patchValue(patchValue);
  }

  changeDateOfBirth({ value }: MatDatepickerInputEvent<Date>) {
    this.dateOfBirth.patchValue(moment(value).toISOString());
  }

  changedrivingLicenseExpiry({ value }: MatDatepickerInputEvent<Date>) {
    this.drivingLicenseExpiry.patchValue(moment(value).toISOString());
  }

  get formDisabled() {
    return this.form.disabled;
  }

  get createPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Account.CREATE_ACCOUNT]
    ) {
      return true;
    }
    return false;
  }

  get updatePermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Account.UPDATE_ACCOUNT_PROFILE]
    ) {
      return true;
    }
    return false;
  }

  get updatePassPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Account.UPDATE_ACCOUNT_PASSWORD]
    ) {
      return true;
    }
    return false;
  }

  get dateOfBirth(): FormControl {
    return this.form.get('dateOfBirth') as FormControl;
  }

  get drivingLicenseExpiry(): FormControl {
    return this.form.get('drivingLicenseExpiry') as FormControl;
  }

  get permissionDivisions() {
    return IAccount.IDivisions;
  }

  get divisions(): FormControl {
    return this.permissionsGroup.get('divisions') as FormControl;
  }

  toggleDelete() {
    this.deleted.emit(this.account ?? this.searchedAccount);
  }

  toggleResync() {
    this.resynced.emit(this.account ?? this.searchedAccount);
  }
}
