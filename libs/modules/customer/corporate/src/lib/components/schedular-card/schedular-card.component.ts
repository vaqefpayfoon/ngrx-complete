import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IBranches } from '../../models';
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-schedular-card',
  templateUrl: './schedular-card.component.html',
  styleUrls: ['./schedular-card.component.scss']
})
export class SchedularCardComponent implements OnInit {

  @Input() schedule: IBranches.ISchedules;

  @Input() permissions: any;

  @Output() deleteEvent = new EventEmitter<IBranches.ISchedules>();
  @Output() updateEvent = new EventEmitter<IBranches.ISchedules>();
  
  constructor() { }

  ngOnInit(): void {
  }

  get name() {
    return this.schedule.name;
  }

  get deletePermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Branch.DELETE_BRANCH_SCHEDULES]
    ) {
      return false;
    }
    return true;
  }

  get updatePermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Branch.UPDATE_BRANCH_SCHEDULES]
    ) {
      return false;
    }
    return true;
  }

  onDelete(): void {
    this.deleteEvent.emit(this.schedule);
  }

  onUpdate(): void {
    this.updateEvent.emit(this.schedule);
  }

}
