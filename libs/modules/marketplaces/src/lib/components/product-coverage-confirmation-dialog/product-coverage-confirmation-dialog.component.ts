import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Inject
} from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// Model
import { IProductCoverages } from '../../models';

@Component({
  selector: 'neural-product-coverage-confirmation-dialog',
  templateUrl: './product-coverage-confirmation-dialog.component.html',
  styleUrls: ['./product-coverage-confirmation-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCoverageConfirmationDialogComponent {
  @Output() status = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<ProductCoverageConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IProductCoverages.IDocument
  ) {}

  close(): void {
    this.dialogRef.close(false);
    this.status.emit(false);
  }

  get productReference() {
    return this.data.productReference;
  }

  get unit() {
    return this.productReference.unit;
  }

  get name() {
    return `${this.unit.brand} ${this.unit.model}`;
  }

  get isActive() {
    return this.data.active;
  }

  toggleStatus() {
    this.status.emit(true);
    this.dialogRef.close(true);
  }
}
