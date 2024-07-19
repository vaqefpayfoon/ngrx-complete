import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Inject,
} from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// Model
import { ICalendars } from '../../models';

// Angular forms
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { traverseAndRemove } from '@neural/shared/data';

@Component({
  selector: 'neural-calendar-block-confirmation-dialog',
  templateUrl: './calendar-block-confirmation-dialog.component.html',
  styleUrls: ['./calendar-block-confirmation-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarBlockConfirmationDialogComponent {
  @Output() blockedChanges = new EventEmitter<
    ICalendars.IUpdateInternalCalendar
  >();

  constructor(
    public dialogRef: MatDialogRef<CalendarBlockConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ICalendars.IDocument,
    private fb: FormBuilder
  ) {}

  form = this.fb.group({
    isBlocked: [!this.data?.isBlocked],
    remark: ['',Validators.required],
  });

  close(): void {
    this.dialogRef.close(false);
  }

  toggleBlock(form: FormGroup) {
    const { value } = form;

    traverseAndRemove(value);

    this.blockedChanges.emit(value);

    this.dialogRef.close(true);
  }
}
