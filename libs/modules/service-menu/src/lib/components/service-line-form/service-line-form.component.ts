import {
  Component,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Auth } from '@neural/auth';
import { permissionTags } from '@neural/shared/data';
import { IServiceLine } from '../../models';
import { Location } from '@angular/common';

import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
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
} from '@angular/material/core';
import { MatRadioChange } from '@angular/material/radio';
import { IBranches, ICorporates } from '@neural/modules/customer/corporate';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MileageValidators } from './mileage-validators';
import { ActivatedRoute } from '@angular/router';
import { MatStepper } from '@angular/material/stepper';

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
@Component({
  selector: 'neural-service-line-form',
  templateUrl: './service-line-form.component.html',
  styleUrls: ['./service-line-form.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class ServiceLineFormComponent implements OnInit, OnChanges {
  @Input() serviceLine: IServiceLine.IDocument;
  @Input() permissions;
  @Input() selectedCorporate: Auth.ICorporates;
  @Input() selectedBranch: Auth.IBranch;
  @Input() allBrands: IServiceLine.IBrand[];
  @Input() services: IServiceLine.IServiceType;
  @Input() corporateInfo: ICorporates.IDocument;
  @Input() branchInfo: IBranches.IDocument;
  @Input() fortellis: IServiceLine.IFortellis;
  @Output() update = new EventEmitter<IServiceLine.IDocument>();
  @Output() create = new EventEmitter<IServiceLine.IDocument>();
  @Output() corporateChange = new EventEmitter<boolean>();
  @Output() foretellisChange = new EventEmitter<IServiceLine.IParams>();
  
  exists = false;
  minDate: Date;
  minEndDate: Date;
  choseBrand = IServiceLine.BrandEligibilityTypes.ALL;
  choseMileage = IServiceLine.MileageEligibilityTypes.ALL;
  choseYearMake = IServiceLine.YearMakeEligibilityTypes.ALL;
  yearList: string[] = [];
  constructor(
    private fb: FormBuilder,
    private location: Location,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {
    this.minDate = new Date();
    this.minEndDate = _moment(new Date()).add(1, 'd').toDate();
  }

  form = this.fb.group({});

  ngOnInit(): void {
    this.initialize();
  }

  get isCdkActive(): boolean {
    return this.corporateInfo?.configuration?.cdk?.active;
  }

  generateCode(): void {
    if (!this.isCdkActive) {
      this.form.patchValue({ operationCode: this.randomCode() });
    } else {
      const value = this.form.value;
      if (value.operationCode) {
        const param: IServiceLine.IParams = {
          operationCode: value.operationCode,
          corporateUuid: this.selectedCorporate.uuid,
          branchUuid: this.selectedBranch.uuid
        }
        this.foretellisChange.emit(param);
      }
    }
  }

  randomCode(): string {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result.toString();
  }

  onChangeVehicle(event: MatRadioChange) {
    const { value } = event;

    if (value === IServiceLine.BrandEligibilityTypes.BRAND) {
      if (this.brandsForm.length < 1) {
        this.brandsForm.push(this.createBrand());
      }
    } else {
      while (this.brandsForm.length !== 0) {
        this.brandsForm.removeAt(0);
      }
    }
  }

  onChangeYearMake(event: MatRadioChange) {
    const { value } = event;

    if (value === IServiceLine.YearMakeEligibilityTypes.ALL) {
      this.eligibility.patchValue({ registrationYears: [] });
    }
  }

  onChangeMileage(event: MatRadioChange) {
    const { value } = event;

    if (value === IServiceLine.MileageEligibilityTypes.MILEAGE) {
      if (this.mileagesForm.length < 1) {
        this.mileagesForm.push(this.createMileage());
      }
    } else {
      while (this.mileagesForm.length !== 0) {
        this.mileagesForm.removeAt(0);
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedCorporate && !changes.selectedCorporate.firstChange) {
      this.corporateChange.emit(true);
    }

    if (changes.serviceLine && changes.serviceLine.currentValue) {
      this._initialData();
    }
    if(changes.fortellis && changes.fortellis.currentValue) {
      if (this.fortellis?.opCode) {
        this.form.patchValue({
          operationCode: this.fortellis?.opCode
        });
      }
      if (this.fortellis?.estimatedDuration) {
        this.service.patchValue({
          duration: this.fortellis?.estimatedDuration,
        });
        this.form.patchValue({
          isCdkSynched: true,
          dispatchCodeId: this.fortellis?.dispatchCodeId
        })
      }
      if (this.fortellis?.flatSellRate) {
        this.price.patchValue({
          value: this.fortellis?.flatSellRate,
        });
      }
      if (this.fortellis?.description) {
        this.service.patchValue({
          description: this.fortellis?.description,
        });
        this.form.patchValue({
          isCdkSynched: true,
          dispatchCodeId: this.fortellis?.dispatchCodeId
        })
      }
    }
  }

  get checkIsCDK(): boolean {
    const value = this.form.value;
    return value.isCdkSynched;
  }

  get eligibility(): FormGroup {
    return <FormGroup>this.form.get('eligibility');
  }

  get service(): FormGroup {
    return <FormGroup>this.form.get('service');
  }

  get vehicles(): FormGroup {
    return <FormGroup>this.eligibility.get('vehicles');
  }

  get brandsForm(): FormArray {
    return <FormArray>this.vehicles.get('brands');
  }

  get registrationYearsForm(): FormControl {
    return <FormControl>this.eligibility.get('registrationYears');
  }

  get mileagesForm(): FormArray {
    return <FormArray>this.eligibility.get('mileages');
  }

  get date(): FormGroup {
    return <FormGroup>this.service.get('date');
  }

  get price(): FormGroup {
    return <FormGroup>this.service.get('price');
  }

  get value(): FormGroup {
    return <FormGroup>this.price.get('value');
  }

  get start(): FormControl {
    return <FormControl>this.date.get('start');
  }

  get end(): FormControl {
    return <FormControl>this.date.get('end');
  }

  addBrand(): void {
    if (this.brandsForm.length >= 40) {
      return;
    }
    return this.brandsForm.push(this.createBrand());
  }

  initialize() {
    this.form = this.fb.group({
      uuid: [''],
      corporateUuid: ['', Validators.required],
      branchUuid: ['', Validators.required],
      isCdkSynched: [false],
      dispatchCode: [''],
      operationCode: ['', [Validators.required]],
      service: this.fb.group({
        title: ['', [Validators.required, Validators.maxLength(50)]],
        type: ['', Validators.required],
        description: ['', [Validators.required, Validators.maxLength(300)]],
        duration: ['', [Validators.required, Validators.max(10000)]],
        price: this.fb.group({
          value: ['', [Validators.required, Validators.max(99999)]],
          taxIncluded: [false],
        }),
        date: this.fb.group({
          start: [''],
          end: [''],
        }),
      }),
      eligibility: this.fb.group({
        vehicles: this.fb.group({
          brands: this.fb.array([]),
        }),
        registrationYears: [[]],
        mileages: this.fb.array([]),
      }),
    });
    this.route.params.subscribe((param) => {
      if (param.uuid) {
        this.exists = true;
        this.form.disable();
        this.form.patchValue(this.serviceLine);
        if (
          this.serviceLine?.eligibility?.vehicles?.brands &&
          this.serviceLine?.eligibility?.vehicles?.brands.length
        ) {
          for (const brandItem of this.serviceLine?.eligibility?.vehicles
            ?.brands) {
            this.brandsForm.push(
              this.fb.group({
                brand: [brandItem.brand],
                models: [brandItem.models],
              })
            );
          }
          this.choseBrand = IServiceLine.BrandEligibilityTypes.BRAND;
        }
        if (
          this.serviceLine?.eligibility?.mileages &&
          this.serviceLine?.eligibility?.mileages.length
        ) {
          for (const item of this.serviceLine?.eligibility?.mileages) {
            this.mileagesForm.push(
              this.fb.group({
                from: [item.from,[Validators.required, Validators.min(1), Validators.max(999999)]],
                to: [item.to,[ Validators.required, Validators.min(1), Validators.max(999999)]],
              },
              { validator: MileageValidators.MatchValidator('from', 'to') }
              )
            );
          }
          this.choseMileage = IServiceLine.MileageEligibilityTypes.MILEAGE;
        }
        if (
          this.serviceLine?.eligibility?.registrationYears &&
          this.serviceLine?.eligibility?.registrationYears.length
        ) {
          this.choseYearMake = IServiceLine.YearMakeEligibilityTypes.YEARMAKE;
          this.eligibility.patchValue({
            registrationYears: this.serviceLine?.eligibility?.registrationYears,
          });
        }
      } else {
        this.exists = false;
        this.form.enable();
      }
      this.form.patchValue({
        corporateUuid: this.selectedCorporate.uuid,
        branchUuid: this.selectedBranch.uuid,
      });
      const currentYear = new Date().getFullYear();
      for (let i = currentYear; i >= 1990; i--) {
        this.yearList.push(i.toString());
      }
    });
  }

  createBrand(): FormGroup {
    return this.fb.group({
      brand: ['', Validators.required],
      models: ['', Validators.required],
    });
  }

  addMileage(): void {
    if (this.mileagesForm.length >= 40) {
      return;
    }
    return this.mileagesForm.push(this.createMileage());
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

  changeStartDate(event: MatDatepickerInputEvent<Date>) {
    const start = moment(event?.value).toISOString();
    if (!!start) {
      this.start.patchValue(start);
      this.start.updateValueAndValidity();
    }
  }

  changeEndDate(event: MatDatepickerInputEvent<Date>) {
    const end = moment(event?.value).endOf('day').toISOString();

    if (!!end) {
      this.end.patchValue(end);
      this.end.updateValueAndValidity();
    }
  }

  getMinEndFromStart(startDate: Date): Date {
    return _moment(startDate).add(1, 'd').toDate();
  }

  public _initialData() {
    this.form.patchValue(this.serviceLine);
    this.exists = true;
    this.form.disable();
  }

  cancel() {
    this.location.back();
  }

  get createPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.ServiceLine.CREATE_SERVICE_LINE]
    ) {
      return true;
    }
    return false;
  }

  get updatePermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.ServiceLine.UPDATE_SERVICE_LINE]
    ) {
      return true;
    }
    return false;
  }

  createServiceLine(form: FormGroup): void {
    const { valid, value } = form;
    if (valid && this.createPermission) {
      this.create.emit(value);
    }
  }

  updateServiceLine(form: FormGroup): void {
    const { valid, value } = form;
    if (valid && this.updatePermission && this.serviceLine?.uuid) {
      value.uuid = this.serviceLine.uuid;
      this.update.emit(value);
    }
  }

  get brandEligibility() {
    return IServiceLine.BrandEligibilityTypes;
  }

  get yearMakeEligibility() {
    return IServiceLine.YearMakeEligibilityTypes;
  }

  get mileageEligibility() {
    return IServiceLine.MileageEligibilityTypes;
  }

  filterModelsByBrand(brand: string): IServiceLine.IModel[] {
    return this.allBrands.find((item) => item.brand === brand)?.models;
  }

  saveServiceLine(form: FormGroup): void {
    const { value } = form;
    if (value?.service?.duration) {
      if (!Number.isInteger(value?.service?.duration)) {
        this.toggleSnackbar('Oops! Estimated Duration should not contain decimal points.');
        return;
      }
    }
    if (value?.service?.date?.start && value?.service?.date?.end) {
      if (!this.isIsoDate(value?.service?.date?.start)) {
        const start = moment(value?.service?.date?.start).toISOString();
        value.service.date.start = start;
      }
      if (!this.isIsoDate(value?.service?.date?.end)) {
        const end = moment(value?.service?.date?.end).toISOString();
        value.service.date.end = end;
      }
    } else {
      delete value.service.date;
    }
    if (
      value?.eligibility?.vehicles?.brands &&
      value?.eligibility?.vehicles.brands.length
    ) {
      let findDuplicates = (arr) =>
        arr.filter((item, index) => arr.indexOf(item) != index);
      const selectedBrands = value?.eligibility?.vehicles?.brands.map(
        (x) => x.brand
      );
      const result = findDuplicates(selectedBrands);
      if (result && result.length) {
        this.toggleSnackbar('Oops! Duplicate brand found.');
        return;
      }
    }
    if (!this.exists) {
      this.createServiceLine(form);
    } else {
      this.updateServiceLine(form);
    }
  }

  edit() {
    this.form.enable();
  }

  removeBrand(index: number): void {
    this.brandsForm.removeAt(index);
  }

  removeMileage(index: number): void {
    this.mileagesForm.removeAt(index);
  }

  toggleSnackbar(message: string) {
    return this.snackBar.open(message, '', {
      duration: 5000,
      verticalPosition: 'top',
      panelClass: ['snackbar--custom'],
    });
  }

  isIsoDate(str): boolean {
    if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false;
    const d = new Date(str);
    return d instanceof Date && d.toISOString() === str;
  }

  goForward(stepper: MatStepper): void {
    if(this.exists) {
      stepper.next();
    } else {
      if(this.isCdkActive) {
        const value = this.form.value;
        if(value.operationCode) {
          if(value.operationCode != this.fortellis?.opCode) {
            this.toggleSnackbar('Please enter Operation Code & click Search to retrieve information.');
          } else {
            stepper.next();
          }
        } else {
          this.toggleSnackbar('Please enter Operation Code & click Search to retrieve information.');
        }
      } else {
        stepper.next();
      }
    }
  }
  get stepChange(): boolean {
    if(!this.exists) {
      if(this.isCdkActive) {
        const value = this.form.value;
        if(value.operationCode) {
          if(value.operationCode != this.fortellis?.opCode) {
            return false;
          } else {
            return true;
          }
        } else {
          return false;
        }
      } else {
        return true;
      }
    } else {
      return true;
    }
  }
}
