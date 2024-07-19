import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';

// BreadCrumb & Sort Interfaces
import {  IBC } from '@neural/shared/data';

// Models
import { IReservations } from '../../models';

// Facades
import { ServiceCenterScheduledFacade } from '../../+state/facade';

// Auth
import { Auth, AuthFacade } from '@neural/auth';

// RxJs
import { Observable } from 'rxjs';

@Component({
  selector: 'neural-service-center-scheduled-item',
  templateUrl: './service-center-scheduled-item.component.html',
  styleUrls: ['./service-center-scheduled-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceCenterScheduledItemComponent implements OnInit, OnDestroy {

  reservation$: Observable<IReservations.IDocument>;

  error$: Observable<any>;

  loading$: Observable<any>;

  bc: IBC[];

  selectedBranch$: Observable<Auth.IBranch>;
  
  timeZone$: Observable<string>;

  constructor(
    private serviceCenterScheduledFacade: ServiceCenterScheduledFacade,
    private authFacade: AuthFacade
  ) {}

  ngOnInit() {
    this.initialData();
  }

  ngOnDestroy() {
    this.serviceCenterScheduledFacade.onResetSelectedServiceCenterScheduled();
  }

  initialData() {
    this.bc = [
      {
        name: 'hub',
        path: null
      },
      {
        name: 'service center',
        path: null
      },
      {
        name: 'scheduled',
        path: '/app/hub/reservations/service-center/scheduled'
      },
      {
        name: 'create',
        path: null
      }
    ];

    this.reservation$ = this.serviceCenterScheduledFacade.completedReservation$;

    this.error$ = this.serviceCenterScheduledFacade.error$;

    this.loading$ = this.serviceCenterScheduledFacade.loading$;

    this.selectedBranch$ = this.authFacade.selectedBranch;
    
    this.timeZone$ = this.authFacade.timeZone$;
  }

  onLoad(scheduled: IReservations.IDocument) {
    if (scheduled) {
      this.bc[this.bc.length - 1].name = scheduled.referenceNumber;
    }
  }

  onBranchChange(event: boolean) {
    if (event) {
      this.serviceCenterScheduledFacade.branchChange();
    }
  }

}
