import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Inject,
} from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// Model
import { IPromotions } from '../../models';

@Component({
  selector: 'neural-promotion-confirmation-dialog',
  templateUrl: './promotion-confirmation-dialog.component.html',
  styleUrls: ['./promotion-confirmation-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromotionConfirmationDialogComponent {
  @Output() status = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<PromotionConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {value: IPromotions.IDocument, isRedeem: boolean}
  ) {}

  close(): void {
    this.dialogRef.close(false);
    this.status.emit(false);
  }

  get name(): string {
    return this.data.value.code;
  }

  get isActive(): boolean {
    return this.data.value.active;
  }

  toggleStatus(): void {
    this.status.emit(true);
    this.dialogRef.close(true);
  }
}
