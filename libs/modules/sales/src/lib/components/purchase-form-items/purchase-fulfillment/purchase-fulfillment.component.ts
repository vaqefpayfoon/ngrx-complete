import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

// Models
import { IPurchases } from '../../../models';

// Angular forms
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ICorporates } from '@neural/modules/customer/corporate';

//AuthFacade
import { AuthFacade, Auth } from '@neural/auth';

//rxjs
import { Observable } from 'rxjs';

@Component({
  selector: 'neural-purchase-fulfillment',
  templateUrl: './purchase-fulfillment.component.html',
  styleUrls: ['./purchase-fulfillment.component.scss'],
})
export class PurchaseFulfillmentComponent implements OnChanges, OnInit {
  @Input() purchase: IPurchases.IDocument;

  @Input() permissions: any;

  @Output() updateFullFillment = new EventEmitter<{
    uuid: string;
    fullFillment: IPurchases.ISaleFulfillment;
  }>();

  branches$: Observable<Auth.ICorporates>;

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private readonly authFacade: AuthFacade
  ) {
    this.form = this.initialForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.purchase &&
      changes.purchase.currentValue &&
      this.purchase?.fulfillments
    ) {
      this.emptyFulfillment();

      for (const fulfillment of this.purchase.fulfillments) {
        this.addFulfillment(fulfillment);
      }
    }
  }

  ngOnInit(): void {
    this.branches$ = this.authFacade.selectedCorporate;
  }

  private initialForm(): FormGroup {
    return this.fb.group({
      fulfillments: this.fb.array([]),
    });
  }

  private createFulfillment(
    fulfillment: IPurchases.ISaleFulfillment
  ): FormGroup {
    return this.fb.group({
      type: [fulfillment.type, Validators.compose([Validators.required])],
      uuid: [fulfillment.uuid, Validators.compose([Validators.required])],
      isLocked: [
        fulfillment.isLocked ?? false,
        Validators.compose([Validators.required]),
      ],
    });
  }

  removeFulfillment(index: number): void {
    this.fulfillments.removeAt(index);
  }

  private addFulfillment(fulfillment: IPurchases.ISaleFulfillment): void {
    const createFulfillment: FormGroup = this.createFulfillment(fulfillment);
    this.fulfillments.push(createFulfillment);
  }

  emptyFulfillment() {
    while (this.fulfillments.controls.length) {
      this.fulfillments.removeAt(0);
    }
  }

  onUpdateFullFillment(index: number) {
    const { value, valid } = this.fulfillments.controls[index];
    if (valid) {
      this.updateFullFillment.emit({
        uuid: this.purchase.uuid,
        fullFillment: value,
      });
    }
  }

  onLock(index: number) {
    const form = this.fulfillments.controls[index];

    form.get('isLocked').patchValue(!form.value.isLocked);

    this.onUpdateFullFillment(index);
  }

  get fulfillments(): FormArray {
    return this.form.get('fulfillments') as FormArray;
  }

  get modelSaleFulfillmentType() {
    return ICorporates.ModelSaleFulfillmentType;
  }
}
