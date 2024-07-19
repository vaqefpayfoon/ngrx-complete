import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Inject,
  OnInit,
} from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// Model
import { ICalendars } from '../../models';

// Angular forms
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { traverseAndRemove } from '@neural/shared/data';

@Component({
  selector: 'neural-calendar-slot-block-confirmation-dialog',
  templateUrl: './calendar-slot-block-confirmation-dialog.component.html',
  styleUrls: ['./calendar-slot-block-confirmation-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarSlotBlockConfirmationDialogComponent implements OnInit {

  @Output() blockedChanges = new EventEmitter<ICalendars.IUpdateCalendarSlot>();

  constructor(
    public dialogRef: MatDialogRef<CalendarSlotBlockConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ICalendars.ISlot,
    private fb: FormBuilder
  ) {}

  form = this.fb.group({
    isBlocked: [!this.data?.isBlocked],
    remark: ['', Validators.required],
  });

  ngOnInit() {
    if (this.data?.isBlocked) {
      this.form.get('remark').clearValidators();
    }
  }

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
