import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';

// BreadCrumb & Sort Interfaces
import {  IBC } from '@neural/shared/data';

// Models
import { IReservations } from '../../models';

// Facades
import { ReservationsFacade } from '../../+state/facade';

// Auth
import { Auth, AuthFacade } from '@neural/auth';

// RxJs
import { Observable } from 'rxjs';

@Component({
  selector: 'neural-reservation-item',
  templateUrl: './reservation-item.component.html',
  styleUrls: ['./reservation-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReservationItemComponent implements OnInit, OnDestroy {
  reservation$: Observable<IReservations.IDocument>;

  error$: Observable<any>;

  loading$: Observable<any>;

  bc: IBC[];

  selectedBranch$: Observable<Auth.IBranch>;

  timeZone$: Observable<string>;

  constructor(
    private reservationsFacade: ReservationsFacade,
    private authFacade: AuthFacade
  ) {}

  ngOnInit() {
    this.initialData();
  }

  ngOnDestroy() {
    this.reservationsFacade.onResetSelectedReservation();
  }

  initialData() {
    this.bc = [
      {
        name: 'hub',
        path: null
      },
      {
        name: 'reservations',
        path: null
      },
      {
        name: 'declined',
        path: '/app/hub/reservations/mobile/declined'
      },
      {
        name: 'create',
        path: null
      }
    ];

    this.reservation$ = this.reservationsFacade.reservation$;

    this.error$ = this.reservationsFacade.error$;

    this.loading$ = this.reservationsFacade.loading$;

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
      this.reservationsFacade.branchChange();
    }
  }
}
