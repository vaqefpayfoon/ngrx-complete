import {
  Component,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  Input,
  OnInit,
} from '@angular/core';

// Angular forms
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl,
} from '@angular/forms';

import { DatePipe } from '@angular/common';

// permission tags
import { permissionTags, traverseAndRemove } from '@neural/shared/data';

// Auth
import { Auth } from '@neural/auth';

// Location
import { Location } from '@angular/common';

//Models
import { IManualReservations, IServiceLine } from '../../models';
import { ICorporates, IBranches } from '@neural/modules/customer/corporate';

// MatDialog
import { MatDialog } from '@angular/material/dialog';

import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment } from 'moment';
import { ReservationSummaryDialogComponent } from '../reservation-summary-dialog/reservation-summary-dialog.component';
import { ManualReservationFacade } from '../../+state';
import { SearchCdkDialogComponent } from '../search-cdk-dialog/search-cdk-dialog.component';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { ServiceDetailsDialogComponent } from '../service-details-dialog/service-details-dialog.component';
import { Observable } from 'rxjs';
import { CustomizedDescriptionDialogComponent } from '../customized-description-dialog/customized-description-dialog.component';
import { DecimalValidators } from './custom-validation';
import { IDMSFilter } from '../../models/manual-reservations.interface';

@Component({
  selector: 'neural-new-reservation-form',
  templateUrl: './new-reservation-form.component.html',
  styleUrls: ['./new-reservation-form.component.scss'],
})
export class NewReservationFormComponent implements OnChanges, OnInit {
  constructor(
    private fb: FormBuilder,
    private location: Location,
    private dialog: MatDialog,
    private manualReservationFacade: ManualReservationFacade
  ) {}

  @Input() iso: string;

  @Input() existingCustomer: string;

  @Input() serviceType: string;

  @Input() selectedBranch: Auth.IBranch;

  @Input() operations: Auth.IAccount[];

  @Input() permissions: any;

  @Input() timeZone: string;

  @Input() corporateInfo: ICorporates.IDocument;

  @Input() branchInfo: IBranches.IDocument;

  @Input() selectedServiceAdvisor: string | null;

  serviceLineControl = new FormControl();
  makeControl = new FormControl('', Validators.required);
  modelControl = new FormControl('', Validators.required);
  yearMakeControl = new FormControl('', Validators.required);

  selectedVehicle: any;
  selectedCustomer: any;

  @Input() serviceLines$: Observable<IServiceLine.IDocument[]>;
  @Input() loading: any;
  @Input() makes$: Observable<IManualReservations.IVehicleMakes[]>;
  @Input() models$: Observable<IManualReservations.IVehicleModels[]>;
  @Input() yearMakes$: Observable<IManualReservations.IVehicleYearMakes[]>;

  @Output() create = new EventEmitter<IManualReservations.ICreate>();
  @Output() branchChange = new EventEmitter();
  @Output() modelRecall = new EventEmitter<string>();
  @Output() makeYearRecall = new EventEmitter<{
    makeId: string;
    modelId: string;
  }>();

  serviceLines: IServiceLine.IDocument[] = [];
  makes: IManualReservations.IVehicleMakes[] = [];
  models: IManualReservations.IVehicleModels[] = [];
  yearMakes: IManualReservations.IVehicleYearMakes[] = [];
  selectedServiceLines: IServiceLine.IDocument[] = [];
  makeId: string;
  timer: number;
  searchName: any;

  datePipe = new DatePipe('en-US');

  previewForm = this.fb.group({
    serviceTypes: [
      {
        value: '',
        disabled: true,
      },
    ],
    slot: [
      {
        value: '',
        disabled: true,
      },
    ],
    date: [
      {
        value: '',
        disabled: true,
      },
    ],
  });

  form = this.fb.group({
    branchUuid: ['', Validators.compose([Validators.required])],
    operationUuid: [''],
    account: this.fb.group({
      firstName: [''],
      fullName: ['', Validators.compose([Validators.required])],
      phone: [null],
      email: [null, Validators.compose([Validators.email])],
    }),
    accountVehicle: this.fb.group({
      numberPlate: [''],
      mileage: [
        null,
        Validators.compose([Validators.required, Validators.min(0)]),
      ],
      brand: ['', Validators.compose([Validators.required])],
      year: ['', Validators.compose([Validators.required])],
      identificationNumber: [''],
      model: this.fb.group({
        id: [''],
        name: ['', Validators.compose([Validators.required])],
      }),
    },{ validator: DecimalValidators.MatchValidator('mileage') }),
    calendar: this.fb.group({
      serviceTypes: ['', Validators.compose([Validators.required])],
      slot: ['', Validators.compose([Validators.required])],
      logistic: ['', Validators.compose([Validators.required])],
    }),
    integration: this.fb.group({
      cdk: this.fb.group({
        customerId: [{ value: '', disabled: true }],
        vehicleId: [{ value: '', disabled: true }],
      }),
    }),
    remark: [''],
    serviceLines: [
      this.fb.group({
        uuid: [''],
        customizedDescription: [''],
      }),
    ],
    customerTag: [''],
  });

  ngOnChanges(changes: SimpleChanges) {
    const formatedDate = this.datePipe.transform(
      this.iso,
      'd MMM',
      this.timeZone
    );
    const formattedSlot = this.datePipe.transform(
      this.iso,
      'h:mm a',
      this.timeZone
    );

    (<FormControl>this.calendar.get('slot')).patchValue(this.iso);
    (<FormControl>this.previewForm.get('slot')).patchValue([formattedSlot]);
    (<FormControl>this.previewForm.get('date')).patchValue([formatedDate]);

    (<FormControl>this.calendar.get('serviceTypes')).patchValue([
      this.serviceType,
    ]);
    (<FormControl>this.previewForm.get('serviceTypes')).patchValue([
      this.serviceType,
    ]);

    if (this.selectedServiceAdvisor) {
      (<FormControl>this.form.get('operationUuid')).patchValue(
        this.selectedServiceAdvisor
      );
    }

    this.branchUuid.patchValue(this.selectedBranch?.uuid);

    if (changes.selectedBranch && changes.selectedBranch.currentValue) {
      this.branchUuid.patchValue(this.selectedBranch.uuid);
    }

    if (changes.selectedBranch && !changes.selectedBranch.firstChange) {
      this.branchChange.emit(true);
    }

    if (changes.models$ && !changes.models$.firstChange) {
      this.models$.subscribe((res) => {
        if (res) {
          this.models = res;
          this.models$ = this.modelControl.valueChanges.pipe(
            startWith(''),
            debounceTime(500),
            map((value) => (value ? this._filter(value, 3) : this.models))
          );
        }
      });
    }

    if (changes.yearMakes$ && !changes.yearMakes$.firstChange) {
      this.yearMakes$.subscribe((res) => {
        if (res) {
          this.yearMakes = res;
          this.yearMakes$ = this.yearMakeControl.valueChanges.pipe(
            startWith(''),
            debounceTime(500),
            map((value) => (value ? this._filter(value, 4) : this.yearMakes))
          );
        }
      });
    }

    this.checkCdkConfig();
    this.patchCDKValue();
  }

  patchCDKValue() {
    if (this.selectedCustomer) {
      this.customerId.patchValue(this.selectedCustomer?.id);
      this.phone.patchValue(this.selectedCustomer?.phone?.number);
      if(!this.selectedCustomer?.identity?.fullName) {
        this.firstName.patchValue('');
        this.name.patchValue('');
        return;
      }
      const fullName = this.selectedCustomer?.identity?.fullName;
      const names = fullName.split(" ");
      if (names && names.length) {
        this.firstName.patchValue(names[0]);
        let surName = '';
        for (let i = 1; i < names.length; i++) {
          surName+= names[i];
        }
        this.name.patchValue(surName);
      } else {
        if (fullName) {
          this.name.patchValue(fullName);
        }
      }
      
      this.email.patchValue(this.selectedCustomer?.email);
    }
    if (this.selectedVehicle) {
      this.vehicleId.patchValue(this.selectedVehicle?.id);
      this.mileage.patchValue(this.selectedVehicle?.mileage);
      this.model.patchValue(this.selectedVehicle?.unit?.model?.actual);
      this.numberPlate.patchValue(this.selectedVehicle?.numberPlate);
    }
  }

  checkCdkConfig() {
    if (
      this.isCdkCustomerExist &&
      this.corporateInfo?.configuration?.cdk?.active
    ) {
      this.customerId.setValidators(Validators.compose([Validators.required]));
      this.vehicleId.setValidators(Validators.compose([Validators.required]));
      // this.firstName.setValidators(Validators.compose([Validators.required]));
      this.modelName.clearValidators();
      this.year.clearValidators();
      this.brand.clearValidators();
      this.makeControl.clearValidators();
      this.modelControl.clearValidators();
      this.yearMakeControl.clearValidators();
      this.mileage.clearValidators();
      this.form.updateValueAndValidity();
    } else {
      this.customerId.clearValidators();
      this.vehicleId.clearValidators();
      this.form.updateValueAndValidity();
    }
    if (!this.corporateInfo?.configuration?.cdk?.active) {
      this.year.clearValidators();
      this.mileage.clearValidators();
    }
  }

  onCreate(form: FormGroup) {
    const value = form.getRawValue();
    // traverseAndRemove(value);

    let reservationSummary = { ...value };
    if (
      !reservationSummary?.integration?.cdk?.customerId &&
      !reservationSummary?.integration?.cdk?.vehicleId
    ) {
      delete reservationSummary.integration;
    }
    if (!reservationSummary?.accountVehicle?.year) {
      delete reservationSummary?.accountVehicle.year;
    }
    reservationSummary.branch = this.selectedBranch;
    reservationSummary.operation = this.findSalesAdvisorName();
    reservationSummary.timeZone = this.timeZone;
    reservationSummary.serviceLines = this.selectedServiceLines;
    const isCdkCustomerExist = {
      isCdkCustomerExist: this.isCdkCustomerExist,
    };
    reservationSummary = Object.assign(reservationSummary, isCdkCustomerExist);
    const dialogRef = this.dialog.open(ReservationSummaryDialogComponent, {
      data: reservationSummary,
      width: '800px',
      height: '400px',
      disableClose: true,
    });

    dialogRef.componentInstance.confirm.subscribe((res: boolean) => {
      if (res) {
        const uuidsArr = this.selectedServiceLines.map(
          ({ uuid, customizedDescription }) => ({ uuid, customizedDescription })
        );
        this.serviceLinesFrm.patchValue(uuidsArr);
        const modifiedValue = form.getRawValue();
        if (modifiedValue?.account?.firstName) {
          modifiedValue.account.fullName = modifiedValue?.account?.firstName + ' ' + modifiedValue?.account?.fullName;
        }
        if (
          !modifiedValue?.integration?.cdk?.customerId &&
          !modifiedValue?.integration?.cdk?.vehicleId
        ) {
          delete modifiedValue.integration;
        }
        if (!modifiedValue?.accountVehicle?.year) {
          delete modifiedValue?.accountVehicle.year;
        }
        this.create.emit(modifiedValue);
      }
    });
  }

  onSearchCustomer(name: string, key: IManualReservations.DmsSearchKey, firstName: string = '') {
    this.manualReservationFacade.resetDmsCustomers();
    this.manualReservationFacade.resetDmsVehicles();
    this.manualReservationFacade.resetDmsVehiclesLoaded();

    const dmsValue: IDMSFilter = {
      key,
      name,
      firstName
    }
    const dialogRef = this.dialog.open(SearchCdkDialogComponent, {
      data: dmsValue,
      width: '900px',
    });

    dialogRef.componentInstance.customerInfo.subscribe((customer: any) => {
      this.selectedCustomer = customer;
    });

    dialogRef.componentInstance.vehicleInfo.subscribe((vehicle: any) => {
      this.selectedVehicle = vehicle;
      this.patchCDKValue();
    });
  }

  findSalesAdvisorName() {
    return this.operations.find((sa) => sa.uuid === this.operationUuid.value);
  }

  onRemoveServiceLine(index: number) {
    this.selectedServiceLines.splice(index, 1);
  }

  onEditServiceLine(index: number, serviceLine: IServiceLine.IDocument) {
    this.dialog
      .open(CustomizedDescriptionDialogComponent, {
        data: {
          operationCode: serviceLine?.operationCode,
          description: serviceLine?.service?.description,
        },
        width: '700px',
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          const service = this.selectedServiceLines.find(
            (x) => x.uuid == serviceLine.uuid
          );
          if (service) {
            const mutable: IServiceLine.IDocument = {
              active: service.active,
              branchUuid: service.branchUuid,
              corporateUuid: service.corporateUuid,
              isInCustomerApp: service.isInCustomerApp,
              operationCode: service.operationCode,
              uuid: service.uuid,
              eligibility: service?.eligibility,
              customizedDescription: res,
              service: {
                description: res,
                duration: service?.service?.duration,
                title: service?.service?.title,
                type: service?.service?.type,
                date: service?.service?.date,
                price: service?.service?.price,
              },
            };
            this.selectedServiceLines[index] = mutable;
          }
          const uuidsArr = this.selectedServiceLines.map(
            ({ uuid, customizedDescription }) => ({
              uuid,
              customizedDescription,
            })
          );
          this.serviceLinesFrm.patchValue(uuidsArr);
        }
      });
  }

  onCancel() {
    this.location.back();
  }

  ngOnInit(): void {
    this.serviceLines$.subscribe((res) => {
      if (res) {
        this.serviceLines = res;
        this.serviceLines$ = this.serviceLineControl.valueChanges.pipe(
          startWith(''),
          debounceTime(500),
          map((value) => (value ? this._filter(value, 1) : this.serviceLines))
        );
      }
    });
    if (
      this.corporateInfo?.configuration?.cdk?.active &&
      !this.isCdkCustomerExist
    ) {
      this.makes$.subscribe((res) => {
        if (res) {
          this.makes = res;
          this.makes$ = this.makeControl.valueChanges.pipe(
            startWith(''),
            debounceTime(500),
            map((value) => (value ? this._filter(value, 2) : this.makes))
          );
        }
      });
    }
    if (this.isCdkCustomerExist) {
      this.form.patchValue({ customerTag: 'EXISTING_CUSTOMER' });
    } else {
      this.form.patchValue({ customerTag: 'NEW_CUSTOMER' });
    }
  }

  private _filter(value: string, key: number): any {
    switch (key) {
      case 1: {
        return this.serviceLines.filter(
          (option) =>
            option.service?.title
              ?.toLowerCase()
              .includes(value.toLowerCase()) ||
            option.operationCode.toLowerCase().includes(value.toLowerCase())
        );
      }
      case 2: {
        return this.makes.filter((option) =>
          option.makeId.toLowerCase().includes(value.toLowerCase())
        );
      }
      case 3: {
        return this.models.filter((option) =>
          option.modelId.toLowerCase().includes(value.toLowerCase())
        );
      }
      case 4: {
        return this.yearMakes.filter((option) =>
          option.name.toString().includes(value.toString())
        );
      }
    }
  }

  get formDisabled(): boolean {
    return this.form.disabled;
  }

  get operationUuid(): FormControl {
    return <FormControl>this.form.get('operationUuid');
  }

  get branchUuid(): FormControl {
    return <FormControl>this.form.get('branchUuid');
  }

  get account(): FormGroup {
    return <FormGroup>this.form.get('account');
  }

  get serviceLinesFrm(): FormGroup {
    return <FormGroup>this.form.get('serviceLines');
  }

  get name(): FormControl {
    return <FormControl>this.account.get('fullName');
  }

  get firstName(): FormControl {
    return <FormControl>this.account.get('firstName');
  }

  get email(): FormControl {
    return <FormControl>this.account.get('email');
  }

  get phone(): FormControl {
    return <FormControl>this.account.get('phone');
  }

  get logistic() {
    return IManualReservations.Logistic;
  }

  get accountVehicle(): FormGroup {
    return <FormGroup>this.form.get('accountVehicle');
  }

  get mileage(): FormControl {
    return <FormControl>this.accountVehicle.get('mileage');
  }

  get model(): FormControl {
    return <FormControl>this.accountVehicle.get('model');
  }

  get year(): FormControl {
    return <FormControl>this.accountVehicle.get('year');
  }

  get brand(): FormControl {
    return <FormControl>this.accountVehicle.get('brand');
  }

  get modelName(): FormControl {
    return <FormControl>this.model.get('name');
  }

  get numberPlate(): FormControl {
    return <FormControl>this.accountVehicle.get('numberPlate');
  }

  get integration(): FormGroup {
    return <FormGroup>this.form.get('integration');
  }

  get cdk(): FormGroup {
    return <FormGroup>this.integration.get('cdk');
  }

  get customerId() {
    return <FormControl>this.cdk.get('customerId');
  }

  get vehicleId() {
    return <FormControl>this.cdk.get('vehicleId');
  }

  get calendar(): FormGroup {
    return <FormGroup>this.form.get('calendar');
  }

  get createPermission() {
    if (
      this.permissions &&
      this.permissions[
        permissionTags.ManualReservation.CREATE_MANUAL_RESERVATION
      ]
    ) {
      return true;
    }
    return false;
  }

  get makePermission() {
    if (
      this.permissions &&
      this.permissions[
        permissionTags.ManualReservation.LIST_VEHICLE_MAKES
      ]
    ) {
      return true;
    }
    return false;
  }

  get modelPermission() {
    if (
      this.permissions &&
      this.permissions[
        permissionTags.ManualReservation.LIST_VEHICLE_MODELS
      ]
    ) {
      return true;
    }
    return false;
  }

  get dmsSearchKey() {
    return IManualReservations.DmsSearchKey;
  }

  get isFormInvalid(): boolean {
    if (
      !this.isCdkCustomerExist &&
      this.corporateInfo?.configuration?.cdk?.active
    ) {
      return (
        this.form.invalid ||
        !this.createPermission ||
        this.makeControl.invalid ||
        this.modelControl.invalid ||
        this.yearMakeControl.invalid
      );
    } else {
      return this.form.invalid || !this.createPermission;
    }
  }

  serviceSelected(service: string) {
    if (service) {
      const info = this.serviceLines.find(
        (x) => x?.service?.title.toLowerCase() == service.toLowerCase()
      );
      const dialogRef = this.dialog.open(ServiceDetailsDialogComponent, {
        data: { branchInfo: this.branchInfo, serviceLine: info },
        width: '700px',
      });

      dialogRef.componentInstance.add.subscribe((res: boolean) => {
        if (res) {
          const selectedService: IServiceLine.IDocument = {
            service: info.service,
            active: info.active,
            branchUuid: info.branchUuid,
            corporateUuid: info.corporateUuid,
            customizedDescription: info.customizedDescription,
            isInCustomerApp: info.isInCustomerApp,
            operationCode: info.operationCode,
            uuid: info.uuid,
            eligibility: info.eligibility,
          };
          this.selectedServiceLines.push(selectedService);
        }
      });
    }
  }

  makeSelected(make: string) {
    if (make && this.makes && this.makes.length) {
      const info = this.makes.find(
        (x) => x?.name.toLowerCase() == make.toLowerCase()
      );
      if (info) {
        this.makeId = info.makeId;
        this.accountVehicle.patchValue({ brand: info.name });
        this.model.patchValue({ id: '', name: '' });
        this.modelControl.patchValue('');
        this.accountVehicle.patchValue({ year: '' });
        this.yearMakeControl.patchValue('');
        this.modelRecall.emit(info.makeId);
      }
    }
  }

  modelSelected(model: string) {
    if (model && this.models && this.models.length) {
      const info = this.models.find(
        (x) => x?.name.toLowerCase() == model.toLowerCase()
      );
      if (info) {
        this.model.patchValue({ id: info.modelId, name: info.name });
        this.accountVehicle.patchValue({ year: '' });
        this.yearMakeControl.patchValue('');
        this.makeYearRecall.emit({
          makeId: this.makeId,
          modelId: info.modelId,
        });
      }
    }
  }

  yearSelected(yearMakes: string) {
    if (yearMakes && this.yearMakes && this.yearMakes.length) {
      const info = this.yearMakes.find((x) => x?.name == yearMakes);
      if (info) {
        this.accountVehicle.patchValue({ year: info.name });
      }
    }
  }

  get isCdkCustomerExist(): boolean {
    if (
      this.existingCustomer == 'true' &&
      this.corporateInfo?.configuration?.cdk?.active
    ) {
      return true;
    }
    return false;
  }
}
