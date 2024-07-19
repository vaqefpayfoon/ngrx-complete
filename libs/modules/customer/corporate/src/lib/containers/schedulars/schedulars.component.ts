import { Component, OnInit } from '@angular/core';
import { Auth, AuthFacade, PermissionValidatorService } from '@neural/auth';
import { Observable, of } from 'rxjs';
import { IBranches } from '../../models';
import { IBC, permissionTags } from '@neural/shared/data';
import { BranchFacade } from '../../+state';
import { MatDialog } from '@angular/material/dialog';
import { SchedularModalComponent } from '../../components';
import { ActivatedRoute, Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'neural-schedulars',
  templateUrl: './schedulars.component.html',
  styleUrls: ['./schedulars.component.scss'],
})
export class SchedularsComponent implements OnInit {
  corporate$: Observable<Auth.ICorporates>;

  branch$: Observable<IBranches.IDocument>;
  offDays$: Observable<IBranches.IOffDaysList[]>;
  offDaysConfig$: Observable<IBranches.IConfig>;

  total$: Observable<number>;

  error$: Observable<any>;
  error2$: Observable<any>;

  loading$: Observable<any>;

  permissions$: Observable<{}>;

  bc: IBC[];

  branchUuid: string;
  corporateUuid: string;

  constructor(
    private branchFacade: BranchFacade,
    private authFacade: AuthFacade,
    private permissionValidatorService: PermissionValidatorService,
    public dialog: MatDialog,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe(res => {
      this.branchUuid = res.uuid;
      this.corporateUuid = res.cUuid;
      this.branchFacade.onSchedulesOffDays(res.uuid);
      this.branchFacade.onGetBranch(res.uuid);
      this.branch$ = this.branchFacade.selectedBranch$;
      this.offDays$ = this.branchFacade.schedulesOffDays$;
      this.offDaysConfig$ = this.branchFacade.offDaysConfig$;
    })
  }

  ngOnInit() {
    this.initialData();
  }

  initialData() {
    this.bc = [
      {
        name: 'administration',
        path: null,
      },
      {
        name: 'Scheduler',
        path: '/app/customer/Scheduler',
      },
    ];
    this.corporate$ = this.authFacade.selectedCorporate;

    this.error$ = of({ status: '404', message: 'Currently No Schedules Added' })

    this.error2$ = of({ status: '404', message: 'Currently No Off Days Added' })

    this.loading$ = this.branchFacade.loading$;

    this.total$ = this.branchFacade.total$;

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.Branch.CREATE_BRANCH_SCHEDULES,
      permissionTags.Branch.DELETE_BRANCH_SCHEDULES,
      permissionTags.Branch.UPDATE_BRANCH_SCHEDULES,
      permissionTags.Branch.CREATE_BRANCH_SCHEDULES_OFF_DAYS,
      permissionTags.Branch.UPDATE_BRANCH_SCHEDULES_OFF_DAYS,
      permissionTags.Branch.DELETE_BRANCH_SCHEDULES_OFF_DAYS,
    ]);
  }

  addSchedule(): void {
    const data = {isScheduler: true};
    this.dialog
      .open(SchedularModalComponent, {
        width: '850px',
        data,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result?.confirm) {
          const payload: IBranches.ISchedulesPayload = {
            branchUuid: this.branchUuid,
            corporateUuid: this.corporateUuid,
            data: result.value
          }
          this.branchFacade.onCreateSchedule(payload)
        }
      });
  }

  onDelete(event: IBranches.ISchedules): void {
    const payload: IBranches.ISchedulesPayload = {
      branchUuid: this.branchUuid,
      corporateUuid: this.corporateUuid,
      data: event
    }
    this.branchFacade.onDeleteSchedule(payload);
  }

  onUpdate(event: IBranches.ISchedules): void {
    const data = {isScheduler: true, value: event};
    this.dialog
      .open(SchedularModalComponent, {
        width: '850px',
        data,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result?.confirm) {
          const payload: IBranches.ISchedulesPayload = {
            branchUuid: this.branchUuid,
            corporateUuid: this.corporateUuid,
            data: result.value
          }
          this.branchFacade.onUpdateSchedule(payload)
        }
      });
  }

  changePage(event: PageEvent) {
    const params: IBranches.IConfig = {
      limit: 10,
      page: event.pageIndex + 1,
    };
    this.branchFacade.changeOffDaysPage(params, this.branchUuid);
  }

  onDeleteOffDays(event: IBranches.IOffDaysItem): void {
    const payload: IBranches.IOffDaysPayload = {
      branchUuid: this.branchUuid,
      corporateUuid: this.corporateUuid,
      data: event
    }
    this.branchFacade.onDeleteScheduleOffDays(payload);
  }

}
