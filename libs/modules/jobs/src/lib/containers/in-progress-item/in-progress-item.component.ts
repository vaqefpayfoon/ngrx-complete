import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

// BreadCrumb & Sort Interfaces
import { IBC } from '@neural/shared/data';

// Models
import { IReservations } from '../../models';
import { ICorporates } from '@neural/modules/customer/corporate';

// Facades
import { InProgressFacade, ReservationsFacade } from '../../+state/facade';
import { AuthFacade, PermissionValidatorService } from '@neural/auth';

// RxJs
import { Observable, of } from 'rxjs';

// permission tags
import { permissionTags } from '@neural/shared/data';

// Dialog
import { CompleteConfirmationDialogComponent } from '../../components';

// MatDialog
import { MatDialog } from '@angular/material/dialog';
import { PasswordExpiredDialogComponent } from '../../components/password-expired-dialog/password-expired-dialog.component';

@Component({
  selector: 'neural-in-progress-item',
  templateUrl: './in-progress-item.component.html',
  styleUrls: ['./in-progress-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InProgressItemComponent implements OnInit {
  title = 'in progress';

  inProgressJob$: Observable<IReservations.IInProgressJob>;
  inProgressJobList$: Observable<IReservations.IInProgressJobList>;

  report$: Observable<IReservations.IAnalytics>;

  error$: Observable<any>;

  dailyReportError$: Observable<any>;

  loading$: Observable<any>;

  permissions$: Observable<{}>;

  bc: IBC[];

  timeZone$: Observable<string>;

  corporateInfo$: Observable<ICorporates.IDocument>;

  passwordValidity: Date;

  reservation = true;


  constructor(
    private inProgressFacade: InProgressFacade,
    private permissionValidatorService: PermissionValidatorService,
    private dialog: MatDialog,
    private authFacade: AuthFacade,
    private reservationsFacade: ReservationsFacade
  ) {}

  ngOnInit() {
    this.initialData();
  }

  initialData() {
    this.bc = [
      {
        name: 'Hub',
        path: null,
      },
      {
        name: 'reservations',
        path: null,
      },
      {
        name: 'in progress',
        path: null,
      },
    ];

    this.inProgressJob$ = this.inProgressFacade.inProgressJob$;
    this.inProgressJobList$ = this.inProgressFacade.inProgressJobList$;
    this.error$ = this.inProgressFacade.error$;

    this.loading$ = this.inProgressFacade.loading$;

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.Reservation.GET_INPROGRESS,
      permissionTags.Reservation.UPLOAD_INPROGRESS_INVOICE,
      permissionTags.Reservation.UPLOAD_INPROGRESS_REPAIR_ORDER,
      permissionTags.Analytic.OPERATION_DAILY_REPORT,
      permissionTags.Reservation.COMPLETE_RESERVATION,
    ]);

    this.report$ = this.inProgressFacade.dailyReport$;
    this.dailyReportError$ = this.inProgressFacade.dailyReportError$;

    this.timeZone$ = this.authFacade.timeZone$;

    this.corporateInfo$ = this.reservationsFacade.corporate$;

    this.authFacade.account$.subscribe(
      (data) => (this.passwordValidity = new Date(data?.password?.expiry))
    );

    this.openPasswordExpiredDialog();
  }

  createRO(event: IReservations.ICreate) {
    event.reservation = this.reservation;
    event.type = 'REPAIR_ORDER';
    event.status = 'IN_PROGRESS';
    this.inProgressFacade.onCreate(event);
  }

  createInvoice(event: IReservations.IUpdate) {
    event.reservation = this.reservation;
    event.type = 'SERVICE_INVOICE';
    event.status = 'IN_PROGRESS';
    this.inProgressFacade.onUpdate(event);
  }

  onRefresh(event: boolean) {
    if (event) {
      this.inProgressFacade.onLoad();
      this.inProgressFacade.onLoadList();
    }
  }

  onLoad(reservation: IReservations.IDocument) {
    if (reservation) {
      this.bc[this.bc.length - 1].name = reservation.referenceNumber;
      this.title = reservation.referenceNumber;
    }
  }

  getDailyReport(date: string) {
    this.inProgressFacade.onReport(date);
  }

  openDialog(event: IReservations.IDocument) {
    const dialogRef = this.dialog.open(CompleteConfirmationDialogComponent, {
      data: event,
      disableClose: true,
    });

    dialogRef.componentInstance.status.subscribe((res: boolean) => {
      if (res) {
        // const doc = Object.assign(event, { reservation: this.reservation });
        const doc: IReservations.IDocument = {
          ...event,
          reservation: this.reservation,
        };
        return this.inProgressFacade.onComplete(doc);
      }
    });
  }

  openPasswordExpiredDialog() {
    const expiryDays = this.permissionValidatorService.calculateExpiryDays(
      this.passwordValidity
    );

    if (expiryDays < 1) {
      const dialogRef = this.dialog.open(PasswordExpiredDialogComponent, {
        disableClose: true,
        width: '480px',
        height: '200px',
      });

      dialogRef.componentInstance.redirect.subscribe((x) => {
        if (x) {
          this.authFacade.onRedirectToProfile();
        }
      });

      dialogRef.componentInstance.logout.subscribe((x) => {
        if (x) {
          this.authFacade.onLogout();
        }
      });
    }
  }
  getReferenceNo(event): void {
    this.inProgressFacade.onGetInprogress(event.referenceNumber);
    this.bc[this.bc.length - 1].name = event.referenceNumber;
    this.title = event.referenceNumber;
    this.reservation = event.reservationParam;
  }
}
