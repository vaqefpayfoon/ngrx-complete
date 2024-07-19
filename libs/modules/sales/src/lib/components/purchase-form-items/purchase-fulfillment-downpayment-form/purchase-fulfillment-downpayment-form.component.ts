import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';

//Forms
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormGroupDirective,
} from '@angular/forms';

//Permission
import { permissionTags } from '@neural/shared/data';

// Interfaces
import { IPurchases } from '../../../models';

import { traverseAndRemove } from '../../../functions';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'neural-purchase-fulfillment-downpayment-form',
  templateUrl: './purchase-fulfillment-downpayment-form.component.html',
  styleUrls: [
    './purchase-fulfillment-downpayment-form.component.scss',
    '../../purchase-form/purchase-form.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchaseFulfillmentDownpaymentFormComponent
  implements OnChanges, OnInit {
  @Input() purchase: IPurchases.IDocument;

  @Input() index: number;

  @Input() permissions: any;

  @Output() updated = new EventEmitter<number>();

  @Output() locked = new EventEmitter<number>();

  form: FormGroup;

  edit = true;

  constructor(
    private fb: FormBuilder,
    private parentForm: FormGroupDirective,
    private cd: ChangeDetectorRef
  ) {
    this.form = this.downPaymentForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.index && changes.index.currentValue) {
      const downPayment = this.purchase.fulfillments[this.index].downPayment;

      this.form.patchValue(downPayment);

      this.edit = true;

      this.onChangeStatus();
    }
  }

  onChangeStatus(event?: MatSelectChange) {
    if (this.status.value === this.paymentStatus.SUCCESS) {
      this.receiptNumber.enable();
      this.receiptNumber.setValidators(
        Validators.compose([Validators.required])
      );
    } else {
      this.receiptNumber.setValidators([]), this.receiptNumber.disable();
    }
    this.receiptNumber.updateValueAndValidity();
  }

  ngOnInit(): void {
    const parent = this.fulfillments.controls[this.index] as FormGroup;

    parent.addControl('downPayment', this.form);
    this.cd.detectChanges();
  }

  private downPaymentForm(): FormGroup {
    return this.fb.group({
      payment: this.fb.group({
        status: ['', Validators.compose([Validators.required])],
        remark: [''],
        receiptNumber: [{ value: '', disabled: true }],
      }),
      breakDown: this.fb.group({
        insuranceAndRoadTax: [''],
        otherFees: [''],
      }),
    });
  }

  onLock(form: FormGroup) {
    const { valid, value } = form;

    if (valid) {
      traverseAndRemove(value);
      this.locked.emit(this.index);
    }
  }

  onUpdate(form: FormGroup) {
    const { valid, value } = form;

    if (valid) {
      traverseAndRemove(value);
      this.updated.emit(this.index);
    }
  }

  get payment(): FormGroup {
    return this.form.get('payment') as FormGroup;
  }

  get receiptNumber(): FormGroup {
    return this.payment.get('receiptNumber') as FormGroup;
  }

  get status(): FormGroup {
    return this.payment.get('status') as FormGroup;
  }

  get fulfillments(): FormArray {
    return this.parentForm.form.get('fulfillments') as FormArray;
  }

  get paymentStatus() {
    return IPurchases.SAPaymentStatus;
  }

  get downPaymentStatus() {
    return IPurchases.DownPaymentStatus;
  }

  get updatePermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Sale.UPDATE_SALE_FULFILLMENT]
    ) {
      return true;
    }
    return false;
  }
}
