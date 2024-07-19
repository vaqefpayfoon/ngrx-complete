import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';

// BreadCrumb & Sort Interfaces
import { IBC } from '@neural/shared/data';

// Models
import { IReservations, IBranchTeams } from '../../models';

// Facades
import {
  ServiceCenterScheduledFacade,
  BranchTeamFacade,
} from '../../+state/facade';

// Auth
import { Auth, AuthFacade } from '@neural/auth';

// RxJs
import { Observable } from 'rxjs';

@Component({
  selector: 'neural-service-center-reservation-actions',
  templateUrl: './service-center-reservation-actions.component.html',
  styleUrls: ['./service-center-reservation-actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceCenterReservationActionsComponent implements OnInit, OnDestroy {
  title = 'Assign Operation Team';

  reservation$: Observable<IReservations.IDocument>;

  team$: Observable<IBranchTeams.IDocument>;

  selectedBranch$: Observable<Auth.IBranch>;

  error$: Observable<any>;

  loading$: Observable<any>;

  bc: IBC[];

  constructor(
    private serviceCenterScheduledFacade: ServiceCenterScheduledFacade,
    private branchTeamFacade: BranchTeamFacade,
    private authFacade: AuthFacade,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.initialData();
  }

  ngOnDestroy() {
    this.branchTeamFacade.onReset();
  }

  initialData() {
    this.bc = [
      {
        name: 'hub',
        path: null,
      },
      {
        name: 'reservations',
        path: '/app/hub/reservations/service-center/scheduled',
      },
      {
        name: 'assign',
        path: null,
      },
    ];

    this.reservation$ = this.serviceCenterScheduledFacade.completedReservation$;

    this.team$ = this.branchTeamFacade.branchTeams$;

    this.error$ = this.serviceCenterScheduledFacade.error$;

    this.loading$ = this.serviceCenterScheduledFacade.loading$;

    this.selectedBranch$ = this.authFacade.selectedBranch;
  }

  createOperationTeam({
    reservation,
    assign,
  }: {
    reservation: IReservations.IDocument;
    assign: IReservations.IAssign;
  }) {
    this.serviceCenterScheduledFacade.assignOperationTeam(reservation, assign);
  }

  onLoad(scheduled: IReservations.IDocument) {
    if (scheduled) {
      this.title = scheduled.referenceNumber;
      this.bc[this.bc.length - 1].name = scheduled.referenceNumber;

      this.cd.detectChanges();
    }
  }

  onBranchChange(event: boolean) {
    if (event) {
      this.serviceCenterScheduledFacade.branchChange();
    }
  }
}
