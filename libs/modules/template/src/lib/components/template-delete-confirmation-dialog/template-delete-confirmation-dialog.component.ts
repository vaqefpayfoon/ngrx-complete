import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'neural-template-delete-confirmation-dialog',
  templateUrl: './template-delete-confirmation-dialog.component.html',
  styleUrls: ['./template-delete-confirmation-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplateDeleteConfirmationDialogComponent {
  @Output()
  delete = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<TemplateDeleteConfirmationDialogComponent>
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  deleted() {
    this.delete.emit(true);
    this.dialogRef.close();
  }
}
