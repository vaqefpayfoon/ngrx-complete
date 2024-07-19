import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IBranches } from '../../models';
import { permissionTags } from '@neural/shared/data';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'neural-schedules-off-days-card',
  templateUrl: './schedules-off-days-card.component.html',
  styleUrls: ['./schedules-off-days-card.component.scss'],
})
export class SchedulesOffDaysCardComponent implements OnInit {
  @Input() offDays: IBranches.IOffDaysList;

  @Input() permissions: any;

  @Output() deleteEvent = new EventEmitter<IBranches.IOffDaysList>();

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  get deletePermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Branch.DELETE_BRANCH_SCHEDULES_OFF_DAYS]
    ) {
      return false;
    }
    return true;
  }

  get updatePermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Branch.UPDATE_BRANCH_SCHEDULES_OFF_DAYS]
    ) {
      return false;
    }
    return true;
  }

  onDelete(): void {
    let data: string = 'This off day will be Remove';
      const dialogRef = this.dialog.open(ConfirmModalComponent, {
        width: '370px',
        data,
        disableClose: true
      });
  
      dialogRef.afterClosed().subscribe((res: boolean) => {
        if (res) {
          this.deleteEvent.emit(this.offDays);
        }
      });

  }

  get advisorsName(): string {
    if (this.offDays?.advisors && this.offDays?.advisors.length) {
      const advisors = this.offDays?.advisors;
      if (advisors.length > 2) {
        return (
          advisors
            .slice(0, 2)
            .map((x) => x?.name)
            .toString() + `and ${this.offDays?.advisors.length - 2} more`
        );
      } else {
        return this.offDays?.advisors.map((x) => x?.name).toString();
      }
    }
    return '-';
  }
}
