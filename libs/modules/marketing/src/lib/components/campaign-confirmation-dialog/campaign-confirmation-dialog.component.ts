import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Inject
} from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// Model
import { ICampaigns } from '../../models';

@Component({
  selector: 'neural-campaign-confirmation-dialog',
  templateUrl: './campaign-confirmation-dialog.component.html',
  styleUrls: ['./campaign-confirmation-dialog.component.scss']
})
export class CampaignConfirmationDialogComponent {
  @Output() status = new EventEmitter();
  @Output() isFeaturedEvent = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<CampaignConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  close(): void {
    this.isFeature ? this.isFeaturedEvent.emit(false) : this.status.emit(false)
    this.dialogRef.close(false);
  }

  get name() {
    return this.data.event.name;
  }

  get isActive() {
    return this.data.event.active;
  }

  get isFeature() {
    return this.data.isFeature;
  }

  toggleStatus() {
    this.isFeature ? this.isFeaturedEvent.emit(true) : this.status.emit(true)
    this.dialogRef.close(true);
  }
}
