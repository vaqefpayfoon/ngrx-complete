import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthFacade } from '@neural/auth';
import { IBC, permissionTags } from '@neural/shared/data';
import { PermissionValidatorService } from 'libs/auth/src/lib/services';
import { Observable, of } from 'rxjs';
import { delay, filter, map } from 'rxjs/operators';
import { LeadFacade } from '../../+state/facades/lead.facade';
import { ILead } from '../../models';


@Component({
  selector: 'neural-lead-list',
  templateUrl: './lead-list.component.html',
  styleUrls: ['./lead-list.component.scss']
})
export class LeadListComponent implements OnInit {
  bc: IBC[];

  leads$: Observable<ILead.IDocument[]>;
  total$: Observable<number>;

  leadsConfig$: Observable<ILead.IConfig>;

  leadsFilter$: Observable<ILead.IFilter>;

  permissions$: Observable<Record<string, unknown>>;

  passwordValidity: unknown;
  selectedCorporate$: Observable<{}>;
  selectedBranch$: Observable<{}>;
  loading$: Observable<boolean>;
  error$: Observable<unknown>;
  pageEvent: PageEvent;

  constructor(
    private leadFacade: LeadFacade,
    private permissionValidatorService: PermissionValidatorService,
    private authFacade: AuthFacade,
    private snackBar: MatSnackBar,
  ) {}
  
  initialData(): void {
    this.bc = [
      {
        name: 'hub',
        path: null,
      },
      {
        name: 'lead',
        path: null,
      },
    ];
    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.Lead.GET_LEAD,
      permissionTags.Lead.LIST_LEADS,
      permissionTags.Lead.GET_LEAD_WISH_LISTS,
      permissionTags.Lead.SEND_MANUAL_LEAD_INVITATION,
      permissionTags.Lead.CREATE_LEAD,
      permissionTags.Lead.UPDATE_LEAD,
    ]);
    this.selectedCorporate$ = this.authFacade.selectedCorporate;
    this.selectedBranch$ = this.authFacade.selectedBranch;
    this.leads$ = this.leadFacade.leadManagements$;
    this.total$ = this.leadFacade.total$;
    this.leadsConfig$ = this.leadFacade.getLeadConfig$;
    this.leadsFilter$ = this.leadFacade.getLeadsFilters$;
    this.loading$ = this.leadFacade.loading$;
    this.error$ = this.leadFacade.error$;
    this.authFacade.account$.subscribe(
      (data) => (this.passwordValidity = new Date(data?.password?.expiry))
    );
  }
  ngOnInit(): void {
    this.initialData();
  }

  toggleSnackbar(message: string) {
    return this.snackBar.open(message, '', {
      duration: 5000,
      verticalPosition: 'top',
      panelClass: ['snackbar--custom'],
    });
  }
  onRefresh(event: boolean) {
    if (event) {
      this.leadFacade.resetLeadManagementPage();
    }
  }
  changePage(event: PageEvent) {
    const params: ILead.IConfig = {
      limit: ILead.Config.LIMIT,
      page: event.pageIndex + 1,
    };
    this.leadFacade.changeLeadManagementPage(params);
  }
  onFilter(event: ILead.IFilter) {
    if (event) {
      this.leadFacade.changeLeadManagementFilter(event);
    }
  }
  onClientFilter(event) {
    if (event == '1') {
      this.leadFacade.getLeadManagements();
      this.leads$ = this.leadFacade.leadManagements$;
      this.leads$ = this.leads$.pipe(map((data: ILead.IDocument[]) => data.filter(x => x.advisorAssigned)));
    }
    else if (event == '2') {
      this.leads$ = this.leadFacade.leadManagements$;
      this.leads$ = this.leads$.pipe(map((data: ILead.IDocument[]) => 
      data.filter(x => !x.advisorAssigned ||
        x.advisorAssigned == null ||
        x.advisorAssigned == undefined)));
        this.leadFacade.setFilterFaild();
    }
    else {
      this.leadFacade.getLeadManagements();
      this.leads$ = this.leadFacade.leadManagements$;
    }
  }
  onStatusChanged(payload: {
    changes: ILead.IUpdate;
    lead: ILead.IDocument;
  }) {
    this.leadFacade.update(payload);
    delay(900);
    this.leadFacade.getLeadManagements();
    this.leads$ = this.leadFacade.leadManagements$;
  }
}
