import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Inject
} from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// Model
import { IProductReferences } from '../../models';

@Component({
  selector: 'neural-product-confirmation-dialog',
  templateUrl: './product-confirmation-dialog.component.html',
  styleUrls: ['./product-confirmation-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductConfirmationDialogComponent {

  @Output() status = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<ProductConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IProductReferences.IDocument
  ) {}

  close(): void {
    this.dialogRef.close(false);
    this.status.emit(false);
  }

  get name() {
    return `${this.data.unit.brand} ${this.data.unit.model}`;
  }

  get isActive() {
    return this.data.active;
  }

  toggleStatus() {
    this.status.emit(true);
    this.dialogRef.close(true);
  }

}
