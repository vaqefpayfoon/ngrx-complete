import { Component, OnInit } from '@angular/core';
import {
  BranchFacade,
  BrandsFacade,
  OperationAccountsFacade,
} from '../../+state';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { IBranches } from '../../models';
import { IAccount } from '@neural/modules/administration';
import { map } from 'rxjs/operators';
import { IBC } from '@neural/shared/data';

@Component({
  selector: 'neural-schedular-item',
  templateUrl: './schedular-team-item.component.html',
  styleUrls: ['./schedular-team-item.component.scss'],
})
export class SchedularTeamItemComponent implements OnInit {
  branch$: Observable<IBranches.IDocument>;
  branchUuid: string;
  corporateUuid: string;
  scheduleUuid: string;
  brands$: Observable<string[]>;

  bc: IBC[];

  accounts$: Observable<IAccount.IDocument[]>;

  constructor(
    private branchFacade: BranchFacade,
    private route: ActivatedRoute,
    private brandsFacade: BrandsFacade,
    private operationAccountsFacade: OperationAccountsFacade
  ) {
    this.route.params.subscribe((res) => {
      this.branchUuid = res.uuid;
      this.corporateUuid = res.cUuid;
      this.scheduleUuid = res.scheduleUuid;
      this.branchFacade.onGetBranch(res.uuid);
      this.branch$ = this.branchFacade.selectedBranch$;
    });
  }

  ngOnInit(): void {
    this.branch$.subscribe((res) => {
      if (res) {
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
            name: res?.schedules?.find((x) => x.uuid == this.scheduleUuid)
              ?.name,
            path: null,
          },
          {
            name: 'Teams',
            path: `/app/customer/corporates/branches/${res.corporateUuid}/${res.uuid}/schedules/${this.scheduleUuid}`,
          },
        ];
      }
    });
    this.brands$ = this.brandsFacade.globalBrands$;
    this.accounts$ = this.operationAccountsFacade.accounts$;
  }

  onTypeEvent(event: IBranches.IOperationPayload): void {
    this.operationAccountsFacade.getAccounts(event);
    this.accounts$ = this.operationAccountsFacade.accounts$;
  }

  fillOperation(): void {
    this.branch$.subscribe((branch) => {
      if (branch) {
        const event: IBranches.IOperationPayload = {
          type: '',
          corporateUuid: branch.corporateUuid,
          branchUuid: branch.uuid,
        };
        this.operationAccountsFacade.getAccounts(event);
      }
    });
  }

  updateSchedular(event: IBranches.ITeamPayload): void {
    this.branchFacade.onUpdateScheduleTeam(event);
  }

  redirecttoTeams(): void {
    this.branchFacade.onRedirectToTeams();
  }

  get schedule$(): Observable<IBranches.ISchedules> {
    return this.branch$.pipe(
      map((x) => x?.schedules?.find((x) => x.uuid == this.scheduleUuid))
    );
  }
}
