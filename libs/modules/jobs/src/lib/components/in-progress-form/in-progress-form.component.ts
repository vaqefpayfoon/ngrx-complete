import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  Input
} from '@angular/core';

// Angular forms
import {
  FormBuilder,
  Validators,
  FormControl,
  FormGroup
} from '@angular/forms';

// Models
import { IReservations } from '../../models';
import { ICorporates } from '@neural/modules/customer/corporate';

// permission tags
import { permissionTags } from '@neural/shared/data';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'neural-in-progress-form',
  templateUrl: './in-progress-form.component.html',
  styleUrls: ['./in-progress-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InProgressFormComponent implements OnChanges {
  @Input() inprogress: IReservations.IInProgressJob;

  STATUS = IReservations.Status;

  exists = false;

  @Input() error: IReservations.IError;

  @Input() permissions: any;

  @Input() digitalRepairOrder: ICorporates.IDigitalRepairOrder;

  @Output()
  create: EventEmitter<IReservations.ICreate> = new EventEmitter<
    IReservations.ICreate
  >();

  @Output()
  update: EventEmitter<IReservations.IUpdate> = new EventEmitter<
    IReservations.IUpdate
  >();

  @Output()
  loaded: EventEmitter<IReservations.IDocument> = new EventEmitter<
    IReservations.IDocument
  >();

  @Output()
  completeJob: EventEmitter<IReservations.IDocument> = new EventEmitter<
    IReservations.IDocument
  >();

  form = this.fb.group({
    uuid: [''],
    number: ['', Validators.compose([Validators.required])],
    file: [null, Validators.compose([Validators.required])]
  });

  invoiceForm = this.fb.group({
    uuid: [''],
    number: ['', Validators.compose([Validators.required])],
    payableAmount: ['', Validators.compose([Validators.required])],
    upSellAmount: [''],
    file: [null, Validators.compose([Validators.required])]
  });

  constructor(private fb: FormBuilder,
    private snackBar: MatSnackBar) {
    this.form.disable();
    this.invoiceForm.disable();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.inprogress && changes.inprogress.currentValue) {
      
      if(Array.isArray(this.inprogress)) {
        this.inprogress = this.inprogress[0];
      }
      this.uuid.patchValue(this.inprogress?.job.uuid);
      this.uuidInvoice.patchValue(this.inprogress?.job.uuid);
      this.loaded.emit(this.inprogress?.job);

      if (!this.inprogress?.job?.invoice) {
        this.form.enable();
      }

      if (!!this.inprogress?.job?.repairOrder) {
        this.invoiceForm.enable();

        this.form.patchValue({
          uuid: this.inprogress?.job?.uuid,
          number: this.inprogress?.job?.repairOrder?.number
        });

        this.form.disable();
      }

      if (
        this.inprogress?.job?.invoice &&
        this.inprogress?.job?.invoice?.status &&
        this.inprogress?.job?.invoice?.status ===
          IReservations.InvoiceStatus.SIGNATURE_REQUIRED
      ) {
        (this.invoiceForm.get('number') as FormControl).patchValue(
          this.inprogress?.job?.invoice?.number
        );
        (this.invoiceForm.get('payableAmount') as FormControl).patchValue(
          this.inprogress?.job?.invoice?.payment?.payableAmount
        );
        (this.invoiceForm.get('upSellAmount') as FormControl).patchValue(
          this.inprogress?.job?.invoice?.payment?.upSellAmount
        );
        this.exists = true;
        this.invoiceForm.disable();
      } else {
        this.exists = false;
        this.invoiceForm.enable();
      }
    }
  }

  handleFileInput(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.form.get('file').setValue(file);
    }
  }

  invoiceUpload(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.invoiceForm.get('file').setValue(file);
    }
  }

  get repairOrder() {
    return this.inprogress?.job?.repairOrder;
  }

  get invoice() {
    return this.inprogress?.job?.invoice;
  }

  get status() {
    return this.inprogress?.job?.status;
  }

  get pdf() {
    return this.form.get('file') as FormControl;
  }

  get uuid() {
    return this.form.get('uuid') as FormControl;
  }

  get uuidInvoice() {
    return this.invoiceForm.get('uuid') as FormControl;
  }

  get pdfInvoice() {
    return this.invoiceForm.get('file') as FormControl;
  }

  get payableAmount() {
    return this.invoiceForm.get('payableAmount') as FormControl;
  }

  get upSellAmount() {
    return this.invoiceForm.get('upSellAmount') as FormControl;
  }

  get invoiceDisabled() {
    return this.invoiceForm.disabled;
  }

  createRO(form: FormGroup) {
    const { value, valid } = form;
    if (valid && this.roPermission) {
      this.create.emit(value);
      form.disable();
    }
  }
  toggleSnackbar(message: string) {
    return this.snackBar.open(message, '', {
      duration: 6000,
      verticalPosition: 'top',
      panelClass: ['snackbar--custom'],
    });
  }
  createInvoice(form: FormGroup) {
    const { value, valid } = form;
    if (this.exists) {
      if (this.payableAmount.valid) {
        this.update.emit(value);
        form.disable();
      }
    } else {
      if (valid && this.invoicePermission) {
        this.update.emit(value);
        form.disable();
      }
    }
  }

  completeOrder() {
    if (this.completeReservationPermission && !!this.inprogress.job.repairOrder) {
      this.completeJob.emit(this.inprogress.job);
    }
  }

  get invoicePerms() {
    if (!this.exists) {
      return this.invoiceForm.valid;
    } else {
      return this.payableAmount.valid;
    }
  }

  get roPermission() {
    if (
      this.permissions &&
      this.permissions[
        permissionTags.Reservation.UPLOAD_INPROGRESS_REPAIR_ORDER
      ]
    ) {
      return true;
    }
    return false;
  }

  get invoicePermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Reservation.UPLOAD_INPROGRESS_INVOICE]
    ) {
      return true;
    }
    return false;
  }

  get completeReservationPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Reservation.COMPLETE_RESERVATION]
    ) {
      return true;
    }
    return false;
  }
}

