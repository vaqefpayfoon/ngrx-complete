import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';

// Angular forms
import { FormGroup, FormArray, FormControl, Validators, AbstractControl } from '@angular/forms';

// Models
import { IBranches, ICorporates } from '../../models';

// permission tags
import { permissionTags } from '@neural/shared/data';

// Mat Select
import { MatSelectChange } from '@angular/material/select';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { FulfillmentFileEditorComponent } from '../fulfillment-file-editor/fulfillment-file-editor.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'neural-corporate-model',
  templateUrl: './corporate-model.component.html',
  styleUrls: [
    './corporate-model.component.scss',
    '../corporate-form/corporate-form.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CorporateModelComponent {
  @Input() parent: FormGroup;

  @Input() corporate: ICorporates.IDocument;

  @Input() permissions: any;

  @Output() action = new EventEmitter<string>();

  @Output() addedFullFillment = new EventEmitter<any>();

  @Output() removeFullFillment = new EventEmitter<any>();

  @Output() fullFillmentTypeChanges = new EventEmitter<{
    index: number;
    value: string;
  }>();

  @Output() created = new EventEmitter<boolean>();
  @Output() updated = new EventEmitter<boolean>();

  constructor(private dialog: MatDialog, private cd: ChangeDetectorRef) {}

  onAction(action: string) {
    this.action.emit(action);
  }

  onSave(form: FormGroup) {
    if (this.corporate && this.corporate.uuid) {
      if (form.valid) {
        this.updated.emit(form.valid);
      }
    } else {
      if (form.valid) {
        this.created.emit(form.valid);
      }
    }
  }

  onTypeChange(event: MatSelectChange, index: number) {
    const { value } = event;

    this.fullFillmentTypeChanges.emit({ index, value });

    this.parent.updateValueAndValidity();
  }

  signatureChanged(
    event: MatSlideToggleChange,
    { form, name }: { form: FormGroup; name: 'document' | 'rco' }
  ) {
    const position = ((form.get(name) as FormGroup).get(
      'signature'
    ) as FormGroup).get('position') as FormGroup;
    const x = position.get('x') as FormControl;
    const y = position.get('y') as FormControl;
    const page = position.get('page') as FormControl;
    if (event.checked) {
      x.setValidators(Validators.compose([Validators.required]));
      y.setValidators(Validators.compose([Validators.required]));
      page.setValidators(Validators.compose([Validators.required]));
    } else {
      x.clearValidators();
      y.clearValidators();
      page.clearValidators();
    }

    x.updateValueAndValidity();
    y.updateValueAndValidity();
    page.updateValueAndValidity();
  }

  dropFullFillment(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.fulfillments.controls,
      event.previousIndex,
      event.currentIndex
    );

    this.fulfillments.controls.map((_, i) =>
      this.fulfillments.controls[i].get('order').patchValue(i)
    );
  }

  openEditor(formGroup: FormGroup | AbstractControl) {
    const dialogRef = this.dialog.open(FulfillmentFileEditorComponent, {
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((x) => {
      if (!!x) {
        const position = <FormGroup>(
          (<FormGroup>(<FormGroup>formGroup.get('signature')).get('position'))
        );

        position.patchValue(x?.position);

        this.cd.detectChanges();
      }
    });
  }

  getFulFilment(index: number): FormGroup {
    return this.fulfillments.controls[index] as FormGroup;
  }

  get configuration() {
    return this.parent.get('configuration') as FormGroup;
  }

  get model() {
    return this.configuration.get('model') as FormGroup;
  }

  get sale() {
    return this.model.get('sale') as FormGroup;
  }

  get fulfillments() {
    return this.sale.get('fulfillments') as FormArray;
  }

  get modelSaleFulfillmentType() {
    return ICorporates.ModelSaleFulfillmentType;
  }

  getPaymentControl(index: number): FormGroup {
    const downPayment = this.fulfillments.controls[index].get(
      'downPayment'
    ) as FormGroup;
    return downPayment.get('payment') as FormGroup;
  }

  get methodName() {
    return IBranches.MethodNames;
  }

  get currenciesName() {
    return IBranches.Currencies;
  }

  get createPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Corporate.CREATE_CORPORATE]
    ) {
      return true;
    }
    return false;
  }

  get updatePermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Corporate.UPDATE_CORPORATE]
    ) {
      return true;
    }
    return false;
  }
}
