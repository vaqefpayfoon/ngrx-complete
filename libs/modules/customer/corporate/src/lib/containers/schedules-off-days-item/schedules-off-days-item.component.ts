import { Component, OnInit } from '@angular/core';
import { IBranches } from '../../models';
import { Observable } from 'rxjs';
import { IBC } from '@neural/shared/data';
import { IAccount } from '@neural/modules/administration';
import { BranchFacade, OperationAccountsFacade } from '../../+state';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'neural-schedules-off-days-item',
  templateUrl: './schedules-off-days-item.component.html',
  styleUrls: ['./schedules-off-days-item.component.scss']
})
export class SchedulesOffDaysItemComponent implements OnInit {

  branch$: Observable<IBranches.IDocument>;
  branchUuid: string;
  corporateUuid: string;
  offDaysUuid: string;

  bc: IBC[];

  accounts$: Observable<IAccount.IDocument[]>;

  constructor(
    private branchFacade: BranchFacade,
    private route: ActivatedRoute,
    private operationAccountsFacade: OperationAccountsFacade
  ) {
    this.route.params.subscribe((res) => {
      this.branchUuid = res.uuid;
      this.corporateUuid = res.cUuid;
      this.offDaysUuid = res.offDaysUuid;
      this.branchFacade.onGetBranch(res.uuid);
      this.branch$ = this.branchFacade.selectedBranch$;
    });
  }

  ngOnInit(): void {
    this.accounts$ = this.operationAccountsFacade.accounts$;
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
            name: res?.schedules?.find((x) => x.uuid == this.offDaysUuid)
              ?.name,
            path: null,
          },
          {
            name: 'Teams',
            path: `/app/customer/corporates/branches/${res.corporateUuid}/${res.uuid}/schedules/offdays/${this.offDaysUuid}`,
          },
        ];
      }
    });
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

  updateOffDays(event: IBranches.IOffDaysPayload): void {
    if(event?.data?.uuid) {
      this.branchFacade.onUpdateScheduleOffDays(event);
    } else {
      this.branchFacade.onCreateScheduleOffDays(event);
    }
  }

  onRedirectToOffDays(): void {
    this.branchFacade.onRedirectToOffDays();
  }

  get offDays$(): Observable<IBranches.IOffDaysItem> {
    return this.branch$.pipe(
      map((x) => x?.schedulesOffDays?.find((x) => x.uuid == this.offDaysUuid))
    );
  }

}
