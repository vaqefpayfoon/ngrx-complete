import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Inject
} from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// Model
import { IWarranties } from '../../models';

// Angular forms
import {
  FormBuilder,
  Validators,
  FormControl,
  FormGroup
} from '@angular/forms';

@Component({
  selector: 'neural-warranty-confirmation-dialog',
  templateUrl: './warranty-confirmation-dialog.component.html',
  styleUrls: ['./warranty-confirmation-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WarrantyConfirmationDialogComponent {
  @Output() status = new EventEmitter<{
    form: IWarranties.IClose;
    warranty: IWarranties.IDocument;
  }>();

  reasons = IWarranties.Reason;


  form = this.fb.group({
    reason: ['', Validators.compose([Validators.required])],
    remark: ['', Validators.compose([Validators.required])],
  });

  constructor(
    public dialogRef: MatDialogRef<WarrantyConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IWarranties.IDocument,
    private fb: FormBuilder
  ) {}

  close(): void {
    this.dialogRef.close(false);
  }

  get name() {
    return `${this.data.accountVehicle.numberPlate}`;
  }

  toggleStatus(form: FormGroup) {
    this.status.emit({
      form: form.value,
      warranty: this.data
    });
    this.dialogRef.close(true);
  }
}
