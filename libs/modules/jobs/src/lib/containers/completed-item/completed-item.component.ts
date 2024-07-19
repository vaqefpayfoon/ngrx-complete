import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';

// BreadCrumb & Sort Interfaces
import {  IBC } from '@neural/shared/data';

// Models
import { IReservations } from '../../models';

// Facades
import { CompletedFacade } from '../../+state/facade';

// Facades
import { ManualReservationFacade } from '../../+state';

// Auth
import { Auth, AuthFacade, PermissionValidatorService } from '@neural/auth';

// RxJs
import { Observable } from 'rxjs';

// permission tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-completed-item',
  templateUrl: './completed-item.component.html',
  styleUrls: ['./completed-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompletedItemComponent implements OnInit, OnDestroy {
  reservation$: Observable<IReservations.MyReservations>;

  error$: Observable<any>;

  loading$: Observable<any>;

  bc: IBC[];

  selectedBranch$: Observable<Auth.IBranch>;

  timeZone$: Observable<string>;

  permissions$: Observable<{}>;

  operations$: Observable<Auth.IAccount[]>;

  constructor(
    private completedFacade: CompletedFacade,
    private authFacade: AuthFacade,
    private permissionValidatorService: PermissionValidatorService,
    private manualReservationFacade: ManualReservationFacade,
  ) {}

  ngOnInit() {
    this.initialData();
  }

  ngOnDestroy() {
    this.completedFacade.onResetSelectedCompletedReservation();
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
        name: 'scheduled',
        path: '/app/hub/reservations/mobile/scheduled'
      },
      {
        name: 'create',
        path: null
      }
    ];

    this.reservation$ = this.completedFacade.completedReservation$;

    this.error$ = this.completedFacade.error$;

    this.loading$ = this.completedFacade.loading$;

    this.selectedBranch$ = this.authFacade.selectedBranch;

    this.timeZone$ = this.authFacade.timeZone$;

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.ManualReservation.CREATE_MANUAL_RESERVATION,
      permissionTags.ManualReservation.UPDATE_MANUAL_RESERVATION,
      permissionTags.ManualReservation.GET_MANUAL_RESERVATION,
    ]);

    this.operations$ = this.manualReservationFacade.operations$;
  }

  onLoad(scheduled: IReservations.IDocument) {
    if (scheduled) {
      this.bc[this.bc.length - 1].name = scheduled.referenceNumber;
    }
  }

  onBranchChange(event: boolean) {
    if (event) {
      this.completedFacade.branchChange();
    }
  }

  get rosterType() {
    return IReservations.RosterType
  }
}
