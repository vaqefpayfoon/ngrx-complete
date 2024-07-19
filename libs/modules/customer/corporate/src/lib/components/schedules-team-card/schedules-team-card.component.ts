import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IBranches } from '../../models';
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-schedules-team-card',
  templateUrl: './schedules-team-card.component.html',
  styleUrls: ['./schedules-team-card.component.scss']
})
export class SchedulesTeamCardComponent implements OnInit {

  @Input() team: IBranches.ITeams;

  @Input() permissions: any;

  @Output() deleteEvent = new EventEmitter<IBranches.ITeams>();
  
  constructor() { }

  ngOnInit(): void {
  }

  get name() {
    return this.team?.name;
  }

  get deletePermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Branch.DELETE_BRANCH_TEAM]
    ) {
      return false;
    }
    return true;
  }

  get updatePermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Branch.UPDATE_BRANCH_TEAM]
    ) {
      return false;
    }
    return true;
  }

  onDelete(): void {
    this.deleteEvent.emit(this.team);
  }

}
