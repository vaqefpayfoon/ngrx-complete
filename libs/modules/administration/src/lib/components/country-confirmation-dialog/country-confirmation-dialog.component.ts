import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Inject
} from '@angular/core';

// Mate dialog
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// Country interface
import { ICountry } from '../../models';

@Component({
  selector: 'neural-country-confirmation-dialog',
  templateUrl: './country-confirmation-dialog.component.html',
  styleUrls: ['./country-confirmation-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CountryConfirmationDialogComponent {
  @Output() status = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<CountryConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ICountry.IDocument
  ) {}

  get name() {
    return this.data.name;
  }

  get isActive() {
    return this.data.isActive;
  }

  close(): void {
    this.status.emit(false);
    this.dialogRef.close();
  }

  toggleStatus() {
    this.status.emit(true);
    this.dialogRef.close();
  }
}
