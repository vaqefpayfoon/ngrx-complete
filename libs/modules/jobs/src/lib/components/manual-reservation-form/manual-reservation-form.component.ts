import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  Input,
  OnInit,
} from '@angular/core';

// Models
import { IManualReservations, IReservations, IServiceLine } from '../../models';
import { ICalendars } from '@neural/modules/calendar';
import { ICorporates, IBranches } from '@neural/modules/customer/corporate';

// Auth
import { Auth } from '@neural/auth';

// Angular forms
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormControl,
} from '@angular/forms';

// permission tags
import { permissionTags, traverseAndRemove } from '@neural/shared/data';

// Location
import { Location } from '@angular/common';

import { DatePipe } from '@angular/common';

import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment } from 'moment';
import { Observable } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { ServiceDetailsDialogComponent } from '../service-details-dialog/service-details-dialog.component';
import { MatSelect } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { CustomizedDescriptionDialogComponent } from '../customized-description-dialog/customized-description-dialog.component';
import { DecimalValidators } from '../new-reservation-form/custom-validation';

const moment = _rollupMoment || _moment;

@Component({
  selector: 'neural-manual-reservation-form',
  templateUrl: './manual-reservation-form.component.html',
  styleUrls: ['./manual-reservation-form.component.scss'],
})
export class ManualReservationFormComponent implements OnChanges, OnInit {
  @Input() selectedSlot: ICalendars.ISlot;
  @Input() customTag: string;
  @Input() serviceTypes: ICalendars.CalendarType[];
  @Input() timeZone: string;
  @Input() operations: Auth.IAccount[];
  @Input() reservation: IManualReservations.IDocument;
  @Input() selectedBranch: Auth.IBranch;
  @Input() error: any;
  @Input() loading: boolean;
  @Input() permissions: any;
  @Input() corporateInfo: ICorporates.IDocument;
  @Input() serviceLines$: Observable<IServiceLine.IDocument[]>;
  @Input() serviceLineloading: any;
  @Input() branchInfo: IBranches.IDocument;

  @Output() created = new EventEmitter<IManualReservations.ICreate>();
  @Output() updated = new EventEmitter<IManualReservations.IDocument>();
  @Output() loaded = new EventEmitter<IManualReservations.IDocument>();
  @Output() branchChange = new EventEmitter();
  @Output() updateBcTime = new EventEmitter();

  serviceLines: IServiceLine.IDocument[] = [];
  selectedServiceLines: IServiceLine.IDocument[] = [];
  serviceLineControl = new FormControl();
  timer: number;
  exists: boolean;
  isCdkActive = false;
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
    operationUuid: ['', Validators.compose([Validators.required])],
    account: this.fb.group({
      fullName: ['', Validators.compose([Validators.required])],
      phone: [null],
      email: [null, Validators.compose([Validators.email])],
    }),
    accountVehicle: this.fb.group({
      numberPlate: [''],
      mileage: [null, Validators.compose([Validators.required, Validators.min(0)])],
      brand: [''],
      year: [''],
      identificationNumber: [''],
      model: this.fb.group({
        name: [''],
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
    customerTag: ['']
  });

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.serviceLines$.subscribe((res) => {
      if (res) {
        this.serviceLines = res;
        this.serviceLines$ = this.serviceLineControl.valueChanges.pipe(
          startWith(''),
          debounceTime(500),
          map((value) => (value ? this._filter(value) : this.serviceLines))
        );
        if (
          this.reservation?.serviceLines &&
          this.reservation?.serviceLines.length
        ) {
          this.selectedServiceLines = [];
          for (const serviceLine of this.reservation?.serviceLines) {
            const info = this.reservation?.serviceLines.find(
              (x) => x?.uuid == serviceLine.uuid
            );
            const selectedService: IServiceLine.IDocument = {
              service: info?.service,
              active: info?.active,
              branchUuid: info?.branchUuid,
              corporateUuid: info?.corporateUuid,
              customizedDescription: info?.service?.customizedDescription,
              isInCustomerApp: info?.isInCustomerApp,
              operationCode: info?.operationCode,
              uuid: info?.uuid,
              eligibility: info?.eligibility,
            };
            this.selectedServiceLines.push(selectedService);
          }
        }
      }
    });
    this.model.patchValue({name: this.reservation?.accountVehicle?.model});
    if (this.isCdkCustomerExist) {
      this.form.patchValue({customerTag: 'EXISTING_CUSTOMER'});
    } else {
      this.form.patchValue({customerTag: 'NEW_CUSTOMER'});
    }
    this.checkCdkConfig();
  }

  private _filter(value: string): any {
    return this.serviceLines.filter(
      (option) =>
        option.service?.title
          ?.toLowerCase()
          .includes(value.toLowerCase()) ||
        option.operationCode.toLowerCase().includes(value.toLowerCase())
    );
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

  ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedSlot && changes.selectedSlot.currentValue) {
      (<FormControl>this.calendar.get('slot')).patchValue(
        this.selectedSlot.iso
      );

      this.updateBcTime.emit(this.selectedSlot?.time);
      (<FormControl>this.previewForm.get('slot')).patchValue(
        this.selectedSlot?.time
      );
    }

    if (changes.serviceTypes && changes.serviceTypes.currentValue) {
      (<FormControl>this.previewForm.get('serviceTypes')).patchValue(
        this.serviceTypes
      );

      (<FormControl>this.calendar.get('serviceTypes')).patchValue(
        this.serviceTypes
      );
    }

    if (changes.selectedBranch && changes.selectedBranch.currentValue) {
      this.branchUuid.patchValue(this.selectedBranch.uuid);
    }

    if (changes.selectedBranch && !changes.selectedBranch.firstChange) {
      this.branchChange.emit(true);
    }

    if (changes.reservation && changes.reservation.currentValue) {
      this.exists = true;
      this.loaded.emit(this.reservation);
      this.form.patchValue(this.reservation);

      this.previewForm
        .get('serviceTypes')
        .patchValue(this.reservation.calendar.serviceTypes);

      const moments = moment(this.reservation.calendar.slot);
      const formattedSlot = this.datePipe.transform(
        this.reservation.calendar.slot,
        'h:mm a',
        this.timeZone
      );
      const formatedDate = this.datePipe.transform(
        this.reservation.calendar.slot,
        'd MMM',
        this.timeZone
      );

      this.updateBcTime.emit(moments.format('hh:mm'));
      this.slot.patchValue(formattedSlot);
      this.date.patchValue([formatedDate]);

      this.form.disable();
    }

    if (this.reservation && this.operations) {
      const operationUuid = this.reservation?.operation?.uuid ?? '';

      this.operationUuid.patchValue(operationUuid);
    }
  }

  create(form: FormGroup) {
    this.getServiceLinesUuid(this.selectedServiceLines);
    const { value, valid } = form;
    if (valid && this.createPermission) {
      traverseAndRemove(value);
      this.created.emit(value);
    }
  }

  update(form: FormGroup) {
    this.getServiceLinesUuid(this.selectedServiceLines);
    const { valid } = form;
    const value = form.getRawValue();

    if (valid && this.updatePermission) {
      traverseAndRemove(value);
      if (
        !value?.integration?.cdk?.customerId &&
        !value?.integration?.cdk?.vehicleId
      ) {
        delete value.integration;
      }
      this.updated.emit({
        ...this.reservation,
        ...value,
      });

      this.form.disable();
    }
  }

  cancel() {
    if (this.exists) {
      this.exists = true;
      this.loaded.emit(this.reservation);
      this.form.patchValue(this.reservation);
      this.form.disable();
    } else {
      this.location.back();
    }
  }

  checkCdkConfig() {
    this.isCdkActive = this.corporateInfo?.configuration?.cdk?.active;
    if (
      this.isCdkCustomerExist &&
      this.corporateInfo?.configuration?.cdk?.active
    ) {
      this.customerId.setValidators(Validators.compose([Validators.required]));
      this.vehicleId.setValidators(Validators.compose([Validators.required]));
      this.form.updateValueAndValidity();
      this.mileage.clearValidators();
    } else {
      this.customerId.clearValidators();
      this.vehicleId.clearValidators();
      this.form.updateValueAndValidity();
    }
    if (!this.corporateInfo?.configuration?.cdk?.active) {
      this.brand.setValidators(Validators.compose([Validators.required]));
      this.modelName.setValidators(Validators.compose([Validators.required]));
      this.mileage.clearValidators();
      this.form.updateValueAndValidity();
    }
  }

  onRemoveServiceLine(index: number) {
    this.selectedServiceLines.splice(index, 1);
  }

  onEditServiceLine(index: number, serviceLine: IServiceLine.IDocument) {
    this.dialog
      .open(CustomizedDescriptionDialogComponent, {
        data: {
          operationCode: this.selectedServiceLines[index].operationCode,
          description: this.selectedServiceLines[index].customizedDescription
            ? this.selectedServiceLines[index].customizedDescription
            : this.selectedServiceLines[index].service.description,
        },
        width: '700px',
        height: '280px',
        panelClass: 'custom-dialog-container',
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.selectedServiceLines[index].customizedDescription = res;
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

  getServiceLinesUuid(arr: IServiceLine.IDocument[]) {
    if (arr && arr.length) {
      const uuidsArr = arr.map(({ uuid, customizedDescription }) => ({
        uuid,
        customizedDescription,
      }));
      this.serviceLinesFrm.patchValue(uuidsArr);
    }
  }

  get isEditAllowed() {
    if (this.reservation?.status === IReservations.Status.JOB_PENDING) {
      return true;
    }
    return false;
  }

  get slot(): FormControl {
    return <FormControl>this.previewForm.get('slot');
  }

  get date(): FormControl {
    return <FormControl>this.previewForm.get('date');
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

  get modelName(): FormControl {
    return <FormControl>this.model.get('name');
  }

  get serviceLinesFrm(): FormGroup {
    return <FormGroup>this.form.get('serviceLines');
  }

  get brand(): FormControl {
    return <FormControl>this.accountVehicle.get('brand');
  }

  get accountVehicle(): FormGroup {
    return <FormGroup>this.form.get('accountVehicle');
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

  get mileage(): FormControl {
    return <FormControl>this.accountVehicle.get('mileage');
  }
  
  get calendar(): FormGroup {
    return <FormGroup>this.form.get('calendar');
  }

  get model(): FormControl {
    return <FormControl>this.accountVehicle.get('model');
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

  get updatePermission() {
    if (
      this.permissions &&
      this.permissions[
        permissionTags.ManualReservation.UPDATE_MANUAL_RESERVATION
      ]
    ) {
      return true;
    }
    return false;
  }
  get isCdkNewCustomer(): boolean {
    if (
      this.customTag == 'NEW_CUSTOMER' &&
      this.corporateInfo?.configuration?.cdk?.active
    ) {
      return true;
    }
    return false;
  }
  get isCdkCustomerExist(): boolean {
    if (
      this.customTag != 'NEW_CUSTOMER' &&
      this.corporateInfo?.configuration?.cdk?.active
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
}
