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
import { IServiceLine, IServicePackage } from '../../models';
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
import { ActivatedRoute } from '@angular/router';
import { MileageValidators } from '../service-line-form/mileage-validators';
import { MY_FORMATS } from '../service-line-form/service-line-form.component';
import { Observable } from 'rxjs';
import { debounceTime, delay, map, startWith } from 'rxjs/operators';
import {
  MatSlideToggle,
  MatSlideToggleChange,
} from '@angular/material/slide-toggle';

@Component({
  selector: 'neural-service-package-form',
  templateUrl: './service-package-form.component.html',
  styleUrls: ['./service-package-form.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class ServicePackageFormComponent implements OnInit {
  @Input() servicePackage: IServicePackage.IDocument;
  @Input() permissions;
  @Input() selectedCorporate: Auth.ICorporates;
  @Input() selectedBranch: Auth.IBranch;
  @Input() allBrands: IServiceLine.IBrand[];
  @Input() serviceLines$: Observable<IServiceLine.IDocument[]>;
  @Input() corporateInfo: ICorporates.IDocument;
  @Input() branchInfo: IBranches.IDocument;
  @Output() update = new EventEmitter<IServiceLine.IDocument>();
  @Output() create = new EventEmitter<IServiceLine.IDocument>();
  @Output() corporateChange = new EventEmitter<boolean>();
  serviceLines: IServiceLine.IDocument[] = [];
  selectedServiceLines: IServiceLine.IDocument[] = [];
  filteredOptions: Observable<IServiceLine.IDocument[]>;
  exists = false;
  minDate: Date;
  minEndDate: Date;
  choseBrand = IServiceLine.BrandEligibilityTypes.ALL;
  choseMileage = IServiceLine.MileageEligibilityTypes.ALL;
  choseYearMake = IServiceLine.YearMakeEligibilityTypes.ALL;
  yearList: string[] = [];
  myControl = new FormControl();

  @ViewChild('isManufactureRecommended', { static: false })
  isManufactureRecommended: MatSlideToggle;
  @ViewChild('isLimitedTimeSpecials', { static: false })
  isLimitedTimeSpecials: MatSlideToggle;

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
    this.serviceLines$.subscribe((res) => {
      if (res) {
        this.serviceLines = res;
        this.serviceLines$ = this.myControl.valueChanges.pipe(
          startWith(''),
          debounceTime(500),
          map((value) => (value ? this._filter(value) : this.serviceLines))
        );
        this.route.params.subscribe((param) => {
          if (param.uuid) {
            if (this.servicePackage.serviceLineUuids) {
              this.selectedServiceLines = [];
              for (const serviceLineUuid of this.servicePackage
                .serviceLineUuids) {
                const info = this.serviceLines.find(
                  (x) => x?.uuid == serviceLineUuid
                );
                if (info) {
                  this.selectedServiceLines.push(info);
                }
              }
            }
          }
        });
      }
    });
  }

  private _filter(value: string): IServiceLine.IDocument[] {
    const filterValue = value.toLowerCase();
    return this.serviceLines.filter(
      (option) =>
        option.service?.title?.toLowerCase().includes(filterValue) ||
        option.operationCode.toLowerCase().includes(filterValue)
    );
  }

  isManufactureRecommendedChanges(event: MatSlideToggleChange) {
    const blnIsLimitedTimeSpecials = this.isLimitedTimeSpecials.checked;
    if (blnIsLimitedTimeSpecials && event.checked) {
      this.isLimitedTimeSpecials.checked = false;
      this.isLimitedTimeSpecialsControl.setValue(false);
    }
  }

  isLimitedTimeSpecialsChanges(event: MatSlideToggleChange) {
    const blnIsManufactureRecommended = this.isManufactureRecommended.checked;
    if (blnIsManufactureRecommended && event.checked) {
      this.isManufactureRecommended.checked = false;
      this.isManufactureRecommendedControl.setValue(false);
    }
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
      this.registrationYearsForm.clearValidators();
      this.registrationYearsForm.updateValueAndValidity();
    } else {
      this.registrationYearsForm.setValidators([Validators.required]);
      this.registrationYearsForm.updateValueAndValidity();
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
  }

  initialize() {
    this.form = this.fb.group({
      uuid: [''],
      corporateUuid: ['', Validators.required],
      branchUuid: ['', Validators.required],
      active: [false],
      serviceLineUuids: [''],
      package: this.fb.group({
        title: ['', [Validators.required, Validators.maxLength(100)]],
        description: ['', [Validators.required, Validators.maxLength(300)]],
        isManufactureRecommended: [false],
        isLimitedTimeSpecials: [false],
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
        this.form.patchValue(this.servicePackage);
        if (
          this.servicePackage?.eligibility?.vehicles?.brands &&
          this.servicePackage?.eligibility?.vehicles?.brands.length
        ) {
          for (const brandItem of this.servicePackage?.eligibility?.vehicles
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
          this.servicePackage?.eligibility?.mileages &&
          this.servicePackage?.eligibility?.mileages.length
        ) {
          for (const item of this.servicePackage?.eligibility?.mileages) {
            this.mileagesForm.push(
              this.fb.group({
                from: [item.from,[Validators.required, Validators.min(1), Validators.max(999999)]],
                to: [item.to,[Validators.required, , Validators.min(1), Validators.max(999999)]],

              },
              { validator: MileageValidators.MatchValidator('from', 'to') }
              )
            );
          }
          this.choseMileage = IServiceLine.MileageEligibilityTypes.MILEAGE;
        }
        if (
          this.servicePackage?.eligibility?.registrationYears &&
          this.servicePackage?.eligibility?.registrationYears.length
        ) {
          this.choseYearMake = IServiceLine.YearMakeEligibilityTypes.YEARMAKE;
          this.eligibility.patchValue({
            registrationYears: this.servicePackage?.eligibility
              ?.registrationYears,
          });
        }
        this.form.disable();
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

  addBrand(): void {
    if (this.brandsForm.length >= 40) {
      return;
    }
    return this.brandsForm.push(this.createBrand());
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
    this.form.patchValue(this.servicePackage);
    this.exists = true;
    this.form.disable();
  }

  cancel() {
    this.location.back();
  }

  get createPermission() {
    if (
      this.permissions &&
      this.permissions[
        permissionTags.ServiceLinePackage.CREATE_SERVICE_LINE_PACKAGE
      ]
    ) {
      return true;
    }
    return false;
  }

  get updatePermission() {
    if (
      this.permissions &&
      this.permissions[
        permissionTags.ServiceLinePackage.UPDATE_SERVICE_LINE_PACKAGE
      ]
    ) {
      return true;
    }
    return false;
  }

  createServicePackage(form: FormGroup): void {
    const { valid, value } = form;
    if (valid && this.createPermission) {
      this.create.emit(value);
    }
  }

  updateServicePackage(form: FormGroup): void {
    const { valid, value } = form;
    delete value.active;
    if (valid && this.updatePermission && this.servicePackage?.uuid) {
      value.uuid = this.servicePackage.uuid;
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

  get eligibility(): FormGroup {
    return <FormGroup>this.form.get('eligibility');
  }

  get package(): FormGroup {
    return <FormGroup>this.form.get('package');
  }

  get isManufactureRecommendedControl(): FormControl {
    return <FormControl>this.package.get('isManufactureRecommended');
  }

  get isLimitedTimeSpecialsControl(): FormControl {
    return <FormControl>this.package.get('isLimitedTimeSpecials');
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
    return <FormGroup>this.package.get('date');
  }

  get start(): FormControl {
    return <FormControl>this.date.get('start');
  }

  get end(): FormControl {
    return <FormControl>this.date.get('end');
  }

  filterModelsByBrand(brand: string): IServiceLine.IModel[] {
    return this.allBrands.find((item) => item.brand === brand)?.models;
  }

  saveServicePackage(form: FormGroup): void {
    if (this.selectedServiceLines && this.selectedServiceLines.length) {
      const { value } = form;
      this.form.patchValue({
        serviceLineUuids: this.selectedServiceLines.map((x) => x.uuid),
      });
      if (value?.package?.date?.start && value?.package?.date?.end) {
        if (!this.isIsoDate(value?.package?.date?.start)) {
          const start = moment(value?.package?.date?.start).toISOString();
          value.package.date.start = start;
        }
        if (!this.isIsoDate(value?.package?.date?.end)) {
          const end = moment(value?.package?.date?.end).toISOString();
          value.package.date.end = end;
        }
      } else {
        delete value.package.date;
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
        this.createServicePackage(form);
      } else {
        this.updateServicePackage(form);
      }
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

  serviceSelected(service: any) {
    if (service) {
      const exists = this.selectedServiceLines.find(
        (x) => x?.service?.title == service.option.value
      );
      if (!exists) {
        const info = this.serviceLines.find(
          (x) => x?.service?.title == service.option.value
        );
        this.selectedServiceLines.push(info);
      }
    }
  }

  removeSelectedServiceLines(index: number): void {
    this.selectedServiceLines.splice(index, 1);
  }

  disableSelectedService(uuid: string): boolean {
    return this.selectedServiceLines.some((x) => x.uuid === uuid);
  }

  get isDableServiceLine(): boolean {
    return this.selectedServiceLines.some((x) => !x.active);
  }
}
