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
import { CompletedFacade, BranchTeamFacade } from '../../+state/facade';

// Auth
import { Auth, AuthFacade } from '@neural/auth';

// RxJs
import { Observable } from 'rxjs';

@Component({
  selector: 'neural-reservation-actions',
  templateUrl: './reservation-actions.component.html',
  styleUrls: ['./reservation-actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReservationActionsComponent implements OnInit, OnDestroy {
  title = 'Assign Operation Team';

  reservation$: Observable<IReservations.IDocument>;

  team$: Observable<IBranchTeams.IDocument>;

  selectedBranch$: Observable<Auth.IBranch>;

  error$: Observable<any>;

  loading$: Observable<any>;

  bc: IBC[];

  constructor(
    private completedFacade: CompletedFacade,
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
        path: '/app/hub/reservations/mobile/scheduled',
      },
      {
        name: 'assign',
        path: null,
      },
    ];

    this.reservation$ = this.completedFacade.completedReservation$;

    this.team$ = this.branchTeamFacade.branchTeams$;

    this.error$ = this.completedFacade.error$;

    this.loading$ = this.completedFacade.loading$;

    this.selectedBranch$ = this.authFacade.selectedBranch;
  }

  createOperationTeam({
    reservation,
    assign,
  }: {
    reservation: IReservations.IDocument;
    assign: IReservations.IAssign;
  }) {
    this.completedFacade.assignOperationTeam(reservation, assign);
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
      this.completedFacade.branchChange();
    }
  }
}
