import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  AfterViewInit,
  Input,
  OnChanges,
  SimpleChanges,
  EventEmitter,
  Output,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
} from '@angular/core';

import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormGroupDirective,
  FormControl,
} from '@angular/forms';

//Permission
import { permissionTags } from '@neural/shared/data';

// Interfaces
import { IPurchases } from '../../../models';
import { ICorporates } from '@neural/modules/customer/corporate';
import { MatDialog } from '@angular/material/dialog';
import { SaleFulfillmentFileEditorComponent } from '../../sale-fulfillment-file-editor/sale-fulfillment-file-editor.component';
import { traverseAndRemove } from '../../../functions';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'neural-purchase-fulfillment-rco-form',
  templateUrl: './purchase-fulfillment-rco-form.component.html',
  styleUrls: [
    './purchase-fulfillment-rco-form.component.scss',
    '../../purchase-form/purchase-form.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchaseFulfillmentRcoFormComponent
  implements OnChanges, OnInit, AfterViewInit {
  @Input() purchase: IPurchases.IDocument;

  @Input() index: number;

  @Input() permissions: any;

  @Output() updated = new EventEmitter<number>();

  @Output() locked = new EventEmitter<number>();

  @ViewChild('fulFillmentDoc', { static: false }) fulFillmentDocEle: ElementRef<
    HTMLInputElement
  >;

  form: FormGroup;

  edit = true;

  constructor(
    private fb: FormBuilder,
    private parentForm: FormGroupDirective,
    private dialog: MatDialog,
    private cd: ChangeDetectorRef
  ) {
    this.form = this.rcoForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.index >= 0) {
      const rco = this.purchase.fulfillments[this.index].rco;

      this.form.patchValue(rco);

      this.edit = true;
    }
  }

  ngOnInit(): void {
    const parent = this.fulfillments.controls[this.index] as FormGroup;

    parent.addControl('file', this.fb.control(['']));

    const rco = (ICorporates.ModelSaleFulfillmentType
      .RCO as string).toLowerCase();

    parent.addControl(rco, this.form);
    this.cd.detectChanges();
  }

  ngAfterViewInit() {
    if (this.index) {
      const parent = this.fulfillments.controls[this.index] as FormGroup;

      const rco = (ICorporates.ModelSaleFulfillmentType
        .RCO as string).toLowerCase();

      parent.addControl(rco, this.form);
    }
  }

  private rcoForm(): FormGroup {
    return this.fb.group({
      finalValue: ['', Validators.compose([Validators.required])],
      url: [''],
      signature: this.fb.group({
        position: this.fb.group({
          x: [''],
          y: [''],
          page: [''],
        }),
        isRequired: [false, Validators.compose([Validators.required])],
        url: [''],
      }),
      isRequired: [false, Validators.compose([Validators.required])],
    });
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
  // Image Preview
  onSelectFile(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    const fileCtrl: FormControl = this.fulfillments.controls[this.index].get(
      'file'
    ) as FormControl;
    fileCtrl.patchValue(file);
    this.url.reset();
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

  get documentIsRequired(): FormControl {
    return this.form.get('isRequired') as FormControl;
  }

  get signatureIsRequired(): FormControl {
    return this.signature.get('isRequired') as FormControl;
  }

  get signature(): FormGroup {
    return this.form.get('signature') as FormGroup;
  }

  get page(): FormControl {
    return this.position.get('page') as FormControl;
  }

  get position(): FormGroup {
    return this.signature.get('position') as FormGroup;
  }

  get signatureUrl(): FormControl {
    return this.signature.get('url') as FormControl;
  }

  get saleFulfillmentRcoStatus() {
    return IPurchases.SaleFulfillmentRcoStatus;
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
