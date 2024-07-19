import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { BranchFacade } from '../../+state';
import { AuthFacade, PermissionValidatorService } from '@neural/auth';
import { ActivatedRoute } from '@angular/router';
import { SchedularModalComponent } from '../../components';
import { IBranches } from '../../models';
import { IBC, permissionTags } from '@neural/shared/data';
import { map } from 'rxjs/operators';

@Component({
  selector: 'neural-schedules-teams',
  templateUrl: './schedules-teams.component.html',
  styleUrls: ['./schedules-teams.component.scss']
})
export class SchedulesTeamsComponent implements OnInit {

  branch$: Observable<IBranches.IDocument>;

  total$: Observable<number>;

  error$: Observable<any>;

  loading$: Observable<any>;

  permissions$: Observable<{}>;

  bc: IBC[];

  branchUuid: string;
  corporateUuid: string;
  scheduleUuid: string;

  constructor(
    private branchFacade: BranchFacade,
    private permissionValidatorService: PermissionValidatorService,
    public dialog: MatDialog,
    private route: ActivatedRoute
  ) {

  }

  ngOnInit() {
    this.route.params.subscribe(res => {
      this.branchUuid = res.uuid;
      this.corporateUuid = res.cUuid;
      this.scheduleUuid = res.scheduleUuid;
      this.branch$ = this.branchFacade.selectedBranch$;
      this.branchFacade.onGetBranch(res.uuid);
    })
    this.initialData();
  }

  initialData() {
    this.branch$.subscribe(res => {
      if(res) {
        this.bc = [
          {
            name: 'Administration',
            path: null,
          },
          {
            name: 'Branches',
            path: `/app/customer/corporates/branches`,
          },
          {
            name: res?.name,
            path: `/app/customer/corporates/branches/${res.corporateUuid}/${res.uuid}`,
          },
          {
            name: 'Scheduler',
            path: `/app/customer/corporates/branches/${res.corporateUuid}/${res.uuid}/schedules`,
          },
          {
            name: res?.schedules?.find(x => x.uuid == this.scheduleUuid)?.name,
            path: null,
          },
        ];
      }
    });
    this.error$ = of({ status: '404', message: 'Currently No Teams Added' })

    this.loading$ = this.branchFacade.loading$;

    this.total$ = this.branchFacade.total$;

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.Branch.CREATE_BRANCH_TEAM,
      permissionTags.Branch.DELETE_BRANCH_TEAM,
      permissionTags.Branch.UPDATE_BRANCH_TEAM,
    ]);

  }

  addTeam(): void {
    const data = {isScheduler: false};
    this.dialog
      .open(SchedularModalComponent, {
        width: '850px',
        data,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result?.confirm) {
          const payload: IBranches.ITeamPayload = {
            branchUuid: this.branchUuid,
            corporateUuid: this.corporateUuid,
            scheduleUuid: this.scheduleUuid,
            data: result.value
          }
          if(result?.value?.uuid && this.branchUuid) {
            this.branchFacade.onUpdateScheduleTeam(payload)
          } else {
            this.branchFacade.onCreateScheduleTeam(payload)
          }
        }
      });
  }

  onDelete(event: IBranches.ITeams): void {
    const payload: IBranches.ITeamPayload = {
      branchUuid: this.branchUuid,
      corporateUuid: this.corporateUuid,
      scheduleUuid: this.scheduleUuid,
      data: event
    }
    this.branchFacade.onDeleteScheduleTeam(payload);
  }

  get teamsList(): Observable<IBranches.ISchedules> {
    return this.branch$.pipe(map(x => x?.schedules?.find(x => x.uuid == this.scheduleUuid)))
  }


}
