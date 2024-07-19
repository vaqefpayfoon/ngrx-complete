import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  OnInit,
  Output,
} from '@angular/core';

//Dialog
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'neural-service-details-dialog',
  templateUrl: './service-details-dialog.component.html',
  styleUrls: ['./service-details-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceDetailsDialogComponent {
  @Output() add = new EventEmitter<boolean>();


  constructor(
    public dialogRef: MatDialogRef<ServiceDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) {}

  ngOnInit(): void {
  }

  onClose() {
    this.dialogRef.close();
  }

  onAdd() {
    this.add.emit(true);
    this.dialogRef.close();
  }
}
