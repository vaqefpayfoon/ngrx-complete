import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

// BreadCrumb & Sort Interfaces
import { IBC } from '@neural/shared/data';

// Models
import { ICalendars } from '../../models';

// Auth
import { Auth, AuthFacade, PermissionValidatorService } from '@neural/auth';

// Facades
import { CalendarsFacade } from '../../+state/facades';

// RxJs
import { Observable } from 'rxjs';

// permission tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-calendar-item',
  templateUrl: './calendar-item.component.html',
  styleUrls: ['./calendar-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarItemComponent implements OnInit {
  bc: IBC[];

  selectedBranch$: Observable<Auth.IBranch>;

  error$: Observable<any>;

  loading$: Observable<any>;

  permissions$: Observable<{}>;

  constructor(
    private calendarsFacade: CalendarsFacade,
    private permissionValidatorService: PermissionValidatorService,
    private authFacade: AuthFacade
  ) {}

  ngOnInit() {
    this.initialData();
  }

  initialData() {
    this.bc = [
      {
        name: 'hub',
        path: 'null',
      },
      {
        name: 'calendars',
        path: '/app/hub/calendar',
      },
      {
        name: 'create',
        path: null,
      },
    ];

    this.error$ = this.calendarsFacade.error$;

    this.loading$ = this.calendarsFacade.loading$;

    this.selectedBranch$ = this.authFacade.selectedBranch;

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.Calendar.GENERATE_CALENDARS,
    ]);
  }

  onCreate(calendar: ICalendars.IGenerateInternalCalendars) {
    this.calendarsFacade.create(calendar);
  }

  onBranchChange(event: boolean) {
    if (event) {
      this.calendarsFacade.branchChange();
    }
  }
}
