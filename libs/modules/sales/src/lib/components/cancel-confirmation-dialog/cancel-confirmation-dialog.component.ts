import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Inject,
  OnInit,
} from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// Angular forms
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { traverseAndRemove } from '../../functions';

// Model
import { IPurchases } from '../../models';

@Component({
  selector: 'neural-cancel-confirmation-dialog',
  templateUrl: './cancel-confirmation-dialog.component.html',
  styleUrls: ['./cancel-confirmation-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CancelConfirmationDialogComponent {
  @Output() status = new EventEmitter();

  form = this.fb.group({
    remark: ['', Validators.required],
  });

  constructor(
    public dialogRef: MatDialogRef<CancelConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IPurchases.IDocument,
    private fb: FormBuilder
  ) {}

  close(): void {
    this.dialogRef.close(false);
    this.status.emit(false);
  }

  get name() {
    return this.data?.referenceNumber ?? 'DBP5LL5';
  }

  toggleStatus(form: FormGroup) {
    const { value } = form;

    traverseAndRemove(value);

    this.status.emit(value);
    this.dialogRef.close(true);
  }
}
