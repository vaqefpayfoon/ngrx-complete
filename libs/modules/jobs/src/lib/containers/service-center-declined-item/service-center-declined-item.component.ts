import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';

// BreadCrumb & Sort Interfaces
import {  IBC } from '@neural/shared/data';

// Models
import { IReservations } from '../../models';

// Facades
import { ServiceCenterDeclinedFacade } from '../../+state/facade';

// Auth
import { Auth, AuthFacade } from '@neural/auth';

// RxJs
import { Observable } from 'rxjs';

@Component({
  selector: 'neural-service-center-declined-item',
  templateUrl: './service-center-declined-item.component.html',
  styleUrls: ['./service-center-declined-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceCenterDeclinedItemComponent implements OnInit, OnDestroy {

  reservation$: Observable<IReservations.IDocument>;

  error$: Observable<any>;

  loading$: Observable<any>;

  bc: IBC[];

  selectedBranch$: Observable<Auth.IBranch>;

  timeZone$: Observable<string>;

  constructor(
    private serviceCenterDeclinedFacade: ServiceCenterDeclinedFacade,
    private authFacade: AuthFacade
  ) {}

  ngOnInit() {
    this.initialData();
  }

  ngOnDestroy() {
    this.serviceCenterDeclinedFacade.onResetSelectedServiceCenterDeclined();
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
        name: 'declined',
        path: '/app/hub/reservations/service-center/declined'
      },
      {
        name: 'create',
        path: null
      }
    ];

    this.reservation$ = this.serviceCenterDeclinedFacade.reservation$;

    this.error$ = this.serviceCenterDeclinedFacade.error$;

    this.loading$ = this.serviceCenterDeclinedFacade.loading$;

    this.selectedBranch$ = this.authFacade.selectedBranch;
    
    this.timeZone$ = this.authFacade.timeZone$;
  }

  onLoad(declined: IReservations.IDocument) {
    if (declined) {
      this.bc[this.bc.length - 1].name = declined.referenceNumber;
    }
  }

  onBranchChange(event: boolean) {
    if (event) {
      this.serviceCenterDeclinedFacade.branchChange();
    }
  }

}
