import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from '@angular/core';

//Forms
import {
  FormGroupDirective,
  FormArray,
  FormGroup,
  FormBuilder,
  Validators,
  ValidatorFn,
} from '@angular/forms';
import { ICorporates } from '@neural/modules/customer/corporate';

//Permission
import { permissionTags } from '@neural/shared/data';

// Models
import { IPurchases } from '../../../models';
import { FormControl } from '@angular/forms';

import { SaleFulfillmentFileEditorComponent } from '../../sale-fulfillment-file-editor/sale-fulfillment-file-editor.component';
import { MatDialog } from '@angular/material/dialog';

import { traverseAndRemove } from '../../../functions';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'neural-purchase-fulfillment-document-form',
  templateUrl: './purchase-fulfillment-document-form.component.html',
  styleUrls: [
    './purchase-fulfillment-document-form.component.scss',
    '../../purchase-form/purchase-form.component.scss',
  ],
})
export class PurchaseFulfillmentDocumentFormComponent
  implements OnChanges, OnInit {
  @ViewChild('fulFillmentDoc', { static: false }) fulFillmentDocEle: ElementRef<
    HTMLInputElement
  >;

  @Input() purchase: IPurchases.IDocument;

  @Input() index: number;

  @Input() permissions: any;

  @Output() badgeChanges = new EventEmitter<IPurchases.IUpdateBadge>();

  @Output() updated = new EventEmitter<number>();

  @Output() locked = new EventEmitter<number>();

  edit = true;

  form: FormGroup;

  constructor(
    private dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private fb: FormBuilder,
    private parentForm: FormGroupDirective
  ) {
    this.form = this.documentForm();
  }

  ngOnInit(): void {
    const parent = this.fulfillments.controls[this.index] as FormGroup;

    parent.addControl('file', this.fb.control(['']));

    const document = (ICorporates.ModelSaleFulfillmentType
      .DOCUMENT as string).toLowerCase();

    parent.addControl(document, this.form);
    this.cd.detectChanges();
  }

  ngOnChanges() {
    if (this.index >= 0) {
      const document = this.purchase.fulfillments[this.index].document;

      this.form.patchValue(document);

      this.edit = true;
    }
  }

  // Image Preview
  onSelectFile(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    const fileCtrl: FormControl = this.fulfillments.controls[this.index].get(
      'file'
    ) as FormControl;
    fileCtrl.patchValue(file);
    this.url.reset();
  }

  onClearBadge() {
    const payload: IPurchases.IUpdateBadge = {
      uuid: this.purchase.uuid,
      section: IPurchases.BadgeSection.RETAIL_CUSTOMER_ORDER,
    };

    this.badgeChanges.emit(payload);
  }

  private documentForm(): FormGroup {
    return this.fb.group({
      status: ['', Validators.compose([Validators.required])],
      url: [''],
      signature: this.fb.group({
        position: this.fb.group({
          x: [''],
          y: [''],
          page: [''],
        }),
        isRequired: [false, Validators.compose([Validators.required])],
        status: ['', Validators.compose([Validators.required])],
        url: [''],
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

  openEditor(formGroup: FormGroup) {
    const { value } = this.fulfillments.controls[this.index].get(
      'file'
    ) as FormControl;

    const dialogRef = this.dialog.open(SaleFulfillmentFileEditorComponent, {
      data: {
        ...formGroup.value,
        file: value,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((x) => {
      if (!!x) {
        const position = <FormGroup>(
          (<FormGroup>(<FormGroup>formGroup).get('signature')).get('position')
        );

        position.patchValue(x?.position);

        this.cd.detectChanges();
      }
    });
  }

  signatureIsRequiredChanges(event: MatSlideToggleChange) {
    const { checked } = event;

    const x = this.position.get('x') as FormControl;
    const y = this.position.get('y') as FormControl;
    const page = this.position.get('page') as FormControl;

    checked
      ? (x.setValidators([Validators.required]),
        y.setValidators([Validators.required]),
        page.setValidators([Validators.required]))
      : (x.clearValidators(), y.clearValidators(), page.clearValidators());

    x.updateValueAndValidity();
    y.updateValueAndValidity();
    page.updateValueAndValidity();
  }

  get fulfillments(): FormArray {
    return this.parentForm.form.get('fulfillments') as FormArray;
  }

  get url(): FormControl {
    return this.form.get('url') as FormControl;
  }

  get signature(): FormGroup {
    return this.form.get('signature') as FormGroup;
  }

  get position(): FormGroup {
    return this.signature.get('position') as FormGroup;
  }

  get page(): FormControl {
    return this.position.get('page') as FormControl;
  }

  get x(): FormControl {
    return this.position.get('x') as FormControl;
  }

  get y(): FormControl {
    return this.position.get('y') as FormControl;
  }

  get isRequired(): FormControl {
    return this.signature.get('isRequired') as FormControl;
  }

  get signatureUrl(): FormControl {
    return this.signature.get('url') as FormControl;
  }

  get saleFulfillmentDocumentStatus() {
    return IPurchases.SaleFulfillmentDocumentStatus;
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

  get updateSignaturePermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Sale.UPDATE_SALE_FULFILLMENT]
    ) {
      return true;
    }
    return false;
  }
}

const isrequiedValidator: ValidatorFn = (ctrl: FormControl) => {
  return ctrl.value === true ? null : Validators.required;
};
