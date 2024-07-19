import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Auth, AuthFacade, PermissionValidatorService } from '@neural/auth';
import { IBC, permissionTags } from '@neural/shared/data';
import { Dictionary } from '@ngrx/entity';
import { Observable } from 'rxjs';
import { NextServiceFacade } from '../../+state';
import { INextService } from '../../models';

@Component({
  selector: 'neural-next-services',
  templateUrl: './next-services.component.html',
  styleUrls: ['./next-services.component.scss'],
})
export class NextServicesComponent implements OnInit {
  bc!: IBC[];

  nextServices$!: Observable<Dictionary<INextService.ITotal>>;
  allNextServices$!: Observable<INextService.ITotal[]>;
  total$!: Observable<number>;
  
  nextServicesConfig$!: Observable<INextService.IConfig>;

  nextServicesFilter$!: Observable<INextService.IFilter | undefined>;

  permissions$!: Observable<Record<string, unknown>>;

  selectedCorporate$!: Observable<Auth.ICorporates>;
  selectedBranch$!: Observable<Auth.IBranch>;
  loading$!: Observable<boolean>;
  error$!: Observable<{status: number; message: string}>;
  pageEvent!: PageEvent;
  lastColumnTxt = 'Scheduled';
  constructor(
    private nextServiceFacade: NextServiceFacade,
    private permissionValidatorService: PermissionValidatorService,
    private authFacade: AuthFacade
  ) {}
  
  initialData(): void {
    this.bc = [
      {
        name: 'hub',
        path: null,
      },
      {
        name: 'Next Service',
        path: null,
      },
    ];
    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.Reservation.LIST_NEXT_SERVICE_RESERVATION,
    ]);
    this.selectedCorporate$ = this.authFacade.selectedCorporate;
    this.selectedBranch$ = this.authFacade.selectedBranch;
    this.nextServices$ = this.nextServiceFacade.NextServices$;
    this.allNextServices$ = this.nextServiceFacade.allNextServices$;
    this.total$ = this.nextServiceFacade.total$;
    this.nextServicesConfig$ = this.nextServiceFacade.getNextServiceConfig$;
    this.nextServicesFilter$ = this.nextServiceFacade.getNextServiceFilters$;
    this.loading$ = this.nextServiceFacade.loading$;
    this.error$ = this.nextServiceFacade.error$;
  }
  ngOnInit(): void {
    this.initialData();
  }

  onRefresh(event: boolean) {
    if (event) {
      this.nextServiceFacade.resetNextServicePage();
    }
  }
  changePage(event: PageEvent) {
    const params: INextService.IConfig = {
      limit: INextService.Config.LIMIT,
      page: event.pageIndex + 1,
    };
    this.nextServiceFacade.changeNextServicePage(params);
  }
  onFilter(event: INextService.IFilter) {
    if (event) {
      this.lastColumnTxt = event.type == 'MISSED_APPOINTMENTS' ? 'Appointment Date' : 'Scheduled';
      this.nextServiceFacade.changeNextServiceFilter(event);
    }
  }
}
