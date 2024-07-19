/* eslint-disable @nrwl/nx/enforce-module-boundaries */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';

import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';

// Moment
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment } from 'moment';

const moment = _rollupMoment || _moment;

// Material calendar
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatOption,
} from '@angular/material/core';

// Model
import { IPromotions } from '../../models';

// Account tags
import { IError, traverseAndRemove } from '@neural/shared/data';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Auth } from '@neural/auth';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

// RxJS
import { from, fromEvent, of, Subscription } from 'rxjs';
import { delay, distinct, filter, map, switchMap } from 'rxjs/operators';
import { MatRadioChange } from '@angular/material/radio';

// Format date picker
export const MY_FORMATS = {
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

import readXlsxFile from 'read-excel-file';

// Location
import { Location } from '@angular/common';

// permission tags
import { permissionTags } from '@neural/shared/data';
import { IVehicle } from '@neural/modules/customer/vehicles';
// Validation service
import { ValidationService } from '@neural/ui';
import {
  AlphaNumericalValidators,
  MileageValidators,
} from './custom-validation';

@Component({
  selector: 'neural-promotion-form',
  templateUrl: './promotion-form.component.html',
  styleUrls: ['./promotion-form.component.scss'],
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
export class PromotionFormComponent
  implements OnChanges, AfterViewInit, OnDestroy {
  @ViewChild('code', { static: true }) code: ElementRef;
  @ViewChild('myCustomerExcelInput') myCustomerExcelInput: ElementRef;
  @ViewChild('myVehicleExcelInput') myVehicleExcelInput: ElementRef;

  @Input() promotion: IPromotions.IDocument;

  @Input() permissions: any;

  @Input() selectedCorporate: Auth.ICorporates;

  @Input() codeValidity: IError;

  @Input() accountsList: Auth.IAccount[];

  @Input() vehiclesList: IVehicle.IDocument[];

  @Input() allBrands: IPromotions.IBrand[];

  @Output() loaded = new EventEmitter<IPromotions.IDocument>();

  @Output() create = new EventEmitter<IPromotions.ICreate>();

  @Output() update = new EventEmitter<IPromotions.IDocument>();

  @Output() checkCode = new EventEmitter<IPromotions.ICodeValidation>();

  @Output() searchByEmail = new EventEmitter<string>();

  @Output() searchByNumberPlate = new EventEmitter<string>();

  @Output() loadAllBrands = new EventEmitter();

  @Output() corporateChange = new EventEmitter<boolean>();

  removable = true;
  exists = false;

  private subscription: Subscription;

  @ViewChild('allAccountSelected') private allAccountSelected: MatOption;
  @ViewChild('allVehicleSelected') private allVehicleSelected: MatOption;
  @Output() searchChange = new EventEmitter<IPromotions.IFilter>();
  @Output() searchChangeVehicle = new EventEmitter<IPromotions.IFilter>();

  minDate: Date;
  minEndDate: Date;

  chosenCustomerEligibility = IPromotions.CustomerEligibilityTypes.ALL;
  chosenVehicleEligibility = IPromotions.VehicleEligibilityTypes.ALL;
  chosenType = IPromotions.Types.MOBILE_SERVICE_FEE;
  chosenMileage = IPromotions.MileageEligibilityTypes.ALL;
  searchAccount = new FormControl('');
  filename = '';
  filename2 = '';
  searchVin = new FormControl('');

  amountCtrl = new FormControl(
    '',
    Validators.compose([
      Validators.required,
      ValidationService.greaterThanZero,
      Validators.max(100),
    ])
  );

  form = this.fb.group(
    {
      title: ['', Validators.compose([Validators.required])],
      terms: this.fb.array([]),
      description: [''],
      shortDescription: [''],
      code: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_]*$'),
        ]),
      ],
      corporateUuid: ['', Validators.compose([Validators.required])],
      eligibility: this.fb.group({
        vehicles: this.fb.group({
          vins: [''],
          brands: this.fb.array([]),
        }),
        customers: this.fb.group({
          uuids: [''],
          emails: [''],
        }),
        mileages: this.fb.array([]),
      }),
      date: this.fb.group({
        start: [
          moment().toISOString(),
          Validators.compose([Validators.required]),
        ],
        end: ['', Validators.compose([Validators.required])],
      }),
      autoRedeem: [false, Validators.compose([Validators.required])],
      type: [
        IPromotions.Types.MOBILE_SERVICE_FEE,
        Validators.compose([Validators.required]),
      ],
      discount: this.fb.group({
        type: [
          this.discountType.PERCENTAGE,
          Validators.compose([Validators.required]),
        ],
        amount: [
          '',
          Validators.compose([
            Validators.required,
            Validators.max(1),
            Validators.min(0),
          ]),
        ],
      }),
      branches: ['', Validators.compose([Validators.required])],
    },
    { validator: AlphaNumericalValidators.MatchValidator('code') }
  );

  searchInput: Subscription;

  constructor(
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private location: Location
  ) {
    this.minDate = new Date();
    this.minEndDate = _moment(new Date()).add(1, 'd').toDate();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedCorporate && changes.selectedCorporate.currentValue) {
      this.corporateUuid.patchValue(this.selectedCorporate.uuid);
    }

    if (changes.selectedCorporate && !changes.selectedCorporate.firstChange) {
      this.corporateChange.emit(true);
    }

    if (changes.promotion && changes.promotion.currentValue) {
      this._initialData();
    }

    if (changes.accountsList && changes.accountsList.currentValue) {
      if (this.isAccountsFilled) {
        let uuids = [];
        this.customers.patchValue({ uuids });
        uuids = this.accountsList.map((item) => item.uuid);
        uuids.push('0');
        this.customers.patchValue({ uuids });
      }
    }

    if (changes.vehiclesList && changes.vehiclesList.currentValue) {
      if (this.isVehicleFilled) {
        let vins = [];
        this.vehicles.patchValue({ vins });
        vins = this.vehiclesList.map((item) => item.identificationNumber);
        vins.push('0');
        this.vehicles.patchValue({ vins });
      }
    }

    if (
      changes.allBrands &&
      changes.allBrands.currentValue &&
      !this.permissions
    ) {
      this.emptyBrands();
      this.addBrand();
    }
  }

  public _initialData() {
    this.form.patchValue(this.promotion);

    this.amountValidation(this.promotion?.discount?.type);

    if (this.promotion?.terms) {
      this.emptyTerm();
      for (const term of this.promotion?.terms) {
        this.addTerm(term);
      }
    }

    if (this.promotion?.eligibility?.vehicles?.brands) {
      this.loadAllBrands.emit();
      this.chosenVehicleEligibility =
        IPromotions.VehicleEligibilityTypes.BRANDS;
      this.emptyBrands();
    }

    if (this.promotion?.eligibility?.customers?.uuids?.length) {
      const uuids = this.promotion?.eligibility?.customers?.uuids.map(
        (x) => x.uuid
      );
      this.accountsList = this.promotion?.eligibility?.customers?.uuids;
      this.customers.patchValue({ uuids });
      this.chosenCustomerEligibility =
        IPromotions.CustomerEligibilityTypes.UUID;
    }

    if (this.promotion?.eligibility?.vehicles?.vins?.length) {
      const vins = this.promotion?.eligibility?.vehicles?.vins.map(
        (x) => x.identificationNumber
      );
      this.vehiclesList = this.promotion?.eligibility?.vehicles.vins;
      this.vehicles.patchValue({ vins });
      this.chosenVehicleEligibility = IPromotions.VehicleEligibilityTypes.VIN;
    }

    this.amount.patchValue(this.promotion?.discount?.amount);

    this.amountCtrl.patchValue(
      IPromotions.DiscountTypes[this.promotion?.discount?.type] ===
        IPromotions.DiscountTypes.PERCENTAGE
        ? this.promotion?.discount?.amount * 100
        : this.promotion?.discount?.amount
    );

    if (
      this.promotion?.eligibility?.mileages &&
      this.promotion?.eligibility?.mileages.length
    ) {
      for (const item of this.promotion?.eligibility?.mileages) {
        this.mileagesForm.push(
          this.fb.group({
            from: [item.from],
            to: [item.to],
          })
        );
      }
      this.chosenMileage = IPromotions.MileageEligibilityTypes.MILEAGE;
    }
    this.chosenType = this.promotion.type;
    this.exists = true;
    this.searchAccount.disable();
    this.searchVin.disable();
    this.form.disable();
    this.amountCtrl.disable();
    this.loaded.emit(this.promotion);
  }

  ngAfterViewInit(): void {
    this.searchInput = fromEvent(this.code.nativeElement, 'keyup')
      .pipe(
        map((event: any) => {
          const input = event.target as HTMLTextAreaElement;
          return input.value;
        }),
        filter((value) => value.length >= 3 && value.length <= 12),
        switchMap((search) => of(search).pipe(delay(500)))
      )
      .subscribe((value) => {
        if (this.promotion?.code !== value) {
          if (!this.form?.errors?.mismatch) {
            this.checkCode.emit({ code: value });
          }
        }
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    if (this.searchInput) {
      this.searchInput.unsubscribe();
    }
  }

  addTerm(term?: string | any): void {
    if (term) {
      const createTerm = new FormControl(term);
      this.terms.push(createTerm);
    } else {
      return this.terms.push(new FormControl());
    }
  }

  removeTerm(index: number): void {
    this.terms.removeAt(index);
  }

  emptyTerm(): void {
    while (this.terms.controls.length) {
      this.terms.removeAt(0);
    }
  }

  createBrand(): FormGroup {
    return this.fb.group({
      brand: ['', Validators.compose([Validators.required])],
      models: [''],
    });
  }

  addBrand(brandVehicle?: IPromotions.IEligibilityVehiclesBrand | any): void {
    if (brandVehicle) {
      const createbrand = this.fb.group({
        brand: [brandVehicle.brand, Validators.compose([Validators.required])],
        models: [brandVehicle.models ?? []],
      });
      this.brands.push(createbrand);
    } else {
      return this.brands.push(this.createBrand());
    }
  }

  removeBrand(index: number): void {
    this.brands.removeAt(index);
  }

  emptyBrands(): void {
    while (this.brands.controls.length) {
      this.brands.removeAt(0);
    }
  }

  filterModelsByBrand(brand: string): IPromotions.IModel[] {
    if (this.allBrands == null) {
      this.chosenVehicleEligibility = IPromotions.VehicleEligibilityTypes.ALL;
    }
    return this.allBrands?.find((item) => item.brand === brand)?.models;
  }

  discountTypeChange(event: MatRadioChange): void {
    const { value } = event;
    this.amountValidation(value);
  }

  private amountValidation(value: any) {
    if (value) {
      this.amount.patchValue('');
      this.amountCtrl.patchValue('');
      this.amount.clearValidators();
      this.amountCtrl.clearValidators();

      if (IPromotions.DiscountTypes[value] === IPromotions.DiscountTypes.FLAT) {
        this.amountCtrl.setValidators(
          Validators.compose([
            Validators.required,
            ValidationService.greaterThanZero,
          ])
        );
      }

      if (
        IPromotions.DiscountTypes[value] ===
        IPromotions.DiscountTypes.PERCENTAGE
      ) {
        this.amount.setValidators(
          Validators.compose([
            Validators.required,
            ValidationService.greaterThanZero,
            Validators.max(1),
          ])
        );
        this.amountCtrl.setValidators(
          Validators.compose([
            Validators.required,
            ValidationService.greaterThanZero,
            Validators.max(100),
          ])
        );
      }

      this.amount.updateValueAndValidity();
      this.amountCtrl.updateValueAndValidity();
    }
  }

  public changeStartDate(event: MatDatepickerInputEvent<Date>) {
    const start = moment(event?.value).toISOString();

    if (start) {
      this.start.patchValue(start);
      this.start.updateValueAndValidity();
    }
  }

  public changeEndDate(event: MatDatepickerInputEvent<Date>) {
    const end = moment(event?.value).endOf('day').toISOString();

    if (!!end) {
      this.end.patchValue(end);
      this.end.updateValueAndValidity();
    }
  }

  public getMinEndFromStart(startDate: Date): Date {
    return _moment(startDate).add(1, 'd').toDate();
  }

  cancel() {
    this.location.back();
  }

  edit() {
    if (!!this.promotion?.eligibility?.vehicles?.brands) {
      for (const brand of this.promotion?.eligibility?.vehicles?.brands) {
        this.addBrand(brand);
      }
      this.cd.detectChanges();
    }
    this.form.enable();

    this.searchAccount.enable();
    this.searchVin.enable();
    this.amountCtrl.enable();
    this.cd.detectChanges();
  }

  createPromo(form: FormGroup): void {
    const { valid } = form;
    if (valid && this.createPermission && this.validatePermission) {
      if (
        this.customers.value.uuids &&
        this.customers.value.uuids?.length > 0
      ) {
        const uuids = this.customers.value.uuids.filter((x) => x != '0');
        this.customers.patchValue({ uuids });
      }

      if (this.vehicles.value.vins && this.vehicles.value.vins?.length > 0) {
        const vins = this.vehicles.value.vins.filter((x) => x != '0');
        this.vehicles.patchValue({ vins });
      }

      const formData = { ...form.value };

      const startDate = moment(formData.date.start).toISOString();
      const endDate = moment(formData.date.end).toISOString();
      const dateObject = { start: startDate, end: endDate };

      formData.date = dateObject;

      traverseAndRemove(formData);

      this.create.emit(formData);
    }
  }

  updatePromo(form: FormGroup): void {
    if (this.customers.value.uuids && this.customers.value.uuids?.length > 0) {
      const uuids = this.customers.value.uuids.filter((x) => x != '0');
      this.customers.patchValue({ uuids });
    }

    if (this.vehicles.value.vins && this.vehicles.value.vins?.length > 0) {
      const vins = this.vehicles.value.vins.filter((x) => x != '0');
      this.vehicles.patchValue({ vins });
    }

    const { valid, value } = form;

    if (valid && this.updatePermission && this.validatePermission) {
      const start = moment(value?.date?.start).toISOString();
      const end = moment(value?.date?.end).toISOString();

      const updatedDocumnet: IPromotions.IDocument = {
        ...this.promotion,
        ...value,
        date: {
          ...value.date,
          start,
          end,
        },
      };

      traverseAndRemove(updatedDocumnet);

      this.update.emit(updatedDocumnet);
    }
  }

  get discountType() {
    return IPromotions.DiscountTypes;
  }

  get customerEligibility() {
    return IPromotions.CustomerEligibilityTypes;
  }

  get vehicleEligibility() {
    return IPromotions.VehicleEligibilityTypes;
  }

  get title(): FormControl {
    return <FormControl>this.form.get('title');
  }

  get codeControl(): FormControl {
    return <FormControl>this.form.get('code');
  }

  get eligibility(): FormGroup {
    return <FormGroup>this.form.get('eligibility');
  }

  get vehicles(): FormGroup {
    return <FormGroup>this.eligibility.get('vehicles');
  }

  get brands(): FormArray {
    return <FormArray>this.vehicles.get('brands');
  }

  get customers(): FormGroup {
    return <FormGroup>this.eligibility.get('customers');
  }

  get branches(): FormControl {
    return <FormControl>this.form.get('branches');
  }

  get terms(): FormArray {
    return <FormArray>this.form.get('terms');
  }

  get date(): FormGroup {
    return <FormGroup>this.form.get('date');
  }

  get start(): FormControl {
    return <FormControl>this.date.get('start');
  }

  get end(): FormControl {
    return <FormControl>this.date.get('end');
  }

  get corporateUuid(): FormControl {
    return <FormControl>this.form.get('corporateUuid');
  }

  get type(): FormControl {
    return <FormControl>this.discount.get('type');
  }

  get amount(): FormControl {
    return <FormControl>this.discount.get('amount');
  }

  get discount(): FormGroup {
    return <FormGroup>this.form.get('discount');
  }

  get mileagesForm(): FormArray {
    return <FormArray>this.eligibility.get('mileages');
  }

  get createPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Promo.CREATE_PROMO]
    ) {
      return true;
    }
    return false;
  }

  get updatePermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Promo.UPDATE_PROMO]
    ) {
      return true;
    }
    return false;
  }

  get validatePermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Promo.VALIDATE_PROMO_CODE]
    ) {
      return true;
    }
    return false;
  }

  get generalStepValidity(): boolean {
    return (
      this.title.valid &&
      this.codeControl.valid &&
      this.date.valid &&
      this.branches.valid
    );
  }

  onChangeMileage(event: IPromotions.Types): void {
    this.chosenType = event;
    this.chosenMileage = IPromotions.MileageEligibilityTypes.ALL;
  }

  onChangeMileageType(event: MatRadioChange): void {
    this.chosenMileage = event.value;
    if (event.value == IPromotions.MileageEligibilityTypes.MILEAGE) {
      if (this.mileagesForm.length < 1) {
        this.mileagesForm.push(this.createMileage());
      }
    } else {
      while (this.mileagesForm.length !== 0) {
        this.mileagesForm.removeAt(0);
      }
    }
  }

  createMileage(): FormGroup {
    return this.fb.group(
      {
        from: [
          '',
          [Validators.required, Validators.min(1), Validators.max(999999)],
        ],
        to: [
          '',
          [Validators.required, Validators.min(1), Validators.max(999999)],
        ],
      },
      { validator: MileageValidators.MatchValidator('from', 'to') }
    );
  }

  removeMileage(index: number): void {
    this.mileagesForm.removeAt(index);
  }

  addMileage(): void {
    if (
      this.mileagesForm.length >= 40 &&
      this.form.value?.type == IPromotions.Types.MOBILE_SERVICE_FEE
    ) {
      return;
    }
    return this.mileagesForm.push(this.createMileage());
  }

  get getPromotionType() {
    return IPromotions.Types;
  }

  get mileageEligibility() {
    return IPromotions.MileageEligibilityTypes;
  }

  toggleAccountSelection() {
    let uuids = [];
    if (this.allAccountSelected.selected) {
      uuids = this.accountsList.map((item) => item.uuid);
      uuids.push('0');
    }
    this.customers.patchValue({ uuids });
  }

  turnOffAccountSelectAll() {
    this.allAccountSelected.deselect();
  }

  toggleVehicleSelection() {
    let vins = [];
    if (this.allVehicleSelected.selected) {
      vins = this.vehiclesList.map((item) => item.identificationNumber);
      vins.push('0');
    }
    this.vehicles.patchValue({ vins });
  }

  turnOffVehicleSelectAll() {
    this.allVehicleSelected.deselect();
  }

  get isAccountsFilled(): boolean {
    if (this.accountsList && this.accountsList.length > 0) {
      return true;
    }
    return false;
  }

  get isVehicleFilled(): boolean {
    if (this.vehiclesList && this.vehiclesList.length > 0) {
      return true;
    }
    return false;
  }

  onSearch(value: IPromotions.IFilter) {
    this.searchChange.emit(value);
  }

  onSearchVehicle(value: IPromotions.IFilter) {
    this.searchChangeVehicle.emit(value);
  }

  showAccountPreview(event: any) {
    const emails = [];
    this.customers.patchValue({ emails });
    const accountFile = (event.target as HTMLInputElement).files[0];
    this.filename = accountFile?.name;

    const addAccountUuid = from(readXlsxFile(accountFile))
      .pipe(
        switchMap((data: any) => {
          data.shift();
          return data.map((x: any) => x.toString());
        }),
        distinct()
      )
      .subscribe((rest) => {
        this.addAccountUuid(rest);
        this.myCustomerExcelInput.nativeElement.value = '';
        this.cd.detectChanges();
      });
    this.subscription.add(addAccountUuid);
  }

  addAccountUuid(uuid?: string | any): void {
    const value = this.customers.value?.emails;
    const emails = [];
    if(value) {
      if (!value.includes(uuid)) {
        if (uuid) {
          value.push(uuid);
          emails.push(...value);
        }
      }
    } else {
      emails.push(uuid);
    }
    this.customers.patchValue({ emails });
  }

  showVehiclePreview(event: any) {
    const vehicleFile = (event.target as HTMLInputElement).files[0];
    this.filename2 = vehicleFile?.name;
    const vehicleUuid = from(readXlsxFile(vehicleFile))
      .pipe(
        switchMap((data: any[]) => {
          data.shift();
          return data.map((x: Array<any>) => x.toString());
        }),
        distinct()
      )
      .subscribe((rest) => {
        this.addVehicleUuid(rest);
        this.myVehicleExcelInput.nativeElement.value = '';
        this.cd.detectChanges();
      });

    this.subscription.add(vehicleUuid);
  }

  addVehicleUuid(uuid?: string | any): void {
    const value = this.vehicles.value?.vins;
    const vins = [];
    if (value) {
      if(!value.find(x => x == '0')) {
        value.push('0')
      }
      if (!value.includes(uuid)) {
        if (uuid) {
          value.push(uuid);
          vins.push(...value);
        }
      }
    } else {
      vins.push(uuid);
    }
    this.vehicles.patchValue({ vins });
  }

  onChangeAccount(_: MatRadioChange) {
    const uuids = [];
    const emails = [];
    this.customers.patchValue({ uuids, emails });
  }

  onChangeVehicle(event: MatRadioChange) {
    const vins = [];
    this.vehicles.patchValue({ vins });
  }
}
