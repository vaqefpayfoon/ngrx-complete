import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';

// Models
import { IInsurer } from '../../models';

// facade
import { InsurerFacade } from '../../+state/facades';

// RxJs
import { Observable } from 'rxjs';

// Paginator
import { PageEvent } from '@angular/material/paginator';

// permission tags -- // BreadCrumb & Sort Interfaces
import {
  permissionTags,
  IBC,
  IGlobalConfig,
  IGlobalFilter,
  GlobalPaginationConfig,
} from '@neural/shared/data';
import { Auth, PermissionValidatorService } from '@neural/auth';

// Dialog
import {
  InsurerConfirmationDialogComponent,
  InsurerConfirmationDeleteDialogComponent,
} from '../../components';

// MatDialog
import { MatDialog } from '@angular/material/dialog';
import { AuthFacade } from '@neural/auth';
import { switchMap, map } from 'rxjs/operators';
@Component({
  selector: 'neural-insurers',
  templateUrl: './insurers.component.html',
  styleUrls: ['./insurers.component.scss'],
})
export class InsurersComponent implements OnInit, AfterViewInit {
  bc!: IBC[];

  insurers$!: Observable<IInsurer.IDocument[]>;
  total$!: Observable<number>;

  configs$!: Observable<IGlobalConfig>;

  filters$!: Observable<IGlobalFilter | null>;

  permissions$!: Observable<{ [name: string]: any }>;

  loading$!: Observable<boolean | null>;
  error$!: Observable<any>;

  pageEvent!: PageEvent | null;

  @ViewChild('corporate') corporate!: ElementRef<HTMLInputElement>;

  constructor(
    private insurerFacade: InsurerFacade,
    private authFacade: AuthFacade,
    private dialog: MatDialog,
    private permissionValidatorService: PermissionValidatorService
  ) {}

  ngOnInit(): void {
    this.initialData();
  }

  ngAfterViewInit() {
    if(this.corporate) {
      this.bc[this.bc.length - 2].name =
        this.corporate.nativeElement.getAttribute('data-name') || '';
  
      this.bc = [...this.bc];

    }
  }

  initialData(): void {
    this.bc = [
      {
        name: 'administration',
        path: null,
      },
      {
        name: 'corporates',
        path: '/app/customer/corporates',
      },
      {
        name: 'corporate name',
        path: null,
      },
      {
        name: 'insurers',
        path: null,
      },
    ];

    this.insurers$ = this.insurerFacade.insurers$;
    this.total$ = this.insurerFacade.total$;

    this.configs$ = this.insurerFacade.configs$;
    this.filters$ = this.insurerFacade.filters$;

    this.loading$ = this.insurerFacade.loading$;
    this.error$ = this.insurerFacade.error$;

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.Insurer.LIST_INSURERS,
      permissionTags.Insurer.CREATE_INSURER,
      permissionTags.Insurer.DELETE_INSURER,
      permissionTags.Insurer.DEACTIVATE_INSURER,
      permissionTags.Insurer.ACTIVATE_INSURER,
    ]);
  }

  onRefresh(event: boolean) {
    if (event) {
      this.insurerFacade.setPage();
    }
  }

  changePage(event: PageEvent) {
    const payload: IGlobalConfig = {
      limit: GlobalPaginationConfig.LIMIT,
      page: event.pageIndex + 1,
    };

    this.insurerFacade.changePage(payload);
  }

  openDialog(event: IInsurer.IDocument) {
    const dialogRef = this.dialog.open(InsurerConfirmationDialogComponent, {
      data: event,
      disableClose: true,
    });

    dialogRef.componentInstance.status.subscribe((res: boolean) => {
      if (res) {
        return this.insurerFacade.toggleStatus({ payload: event });
      } else {
        return this.insurerFacade.resetStatus(event);
      }
    });
  }

  deleteDialog(event: IInsurer.IDocument) {
    const dialogRef = this.dialog.open(
      InsurerConfirmationDeleteDialogComponent,
      {
        data: event,
        disableClose: true,
      }
    );

    dialogRef.componentInstance.deleted.subscribe((res: boolean) => {
      if (res) {
        return this.insurerFacade.delete({ payload: event });
      }
    });
  }

  get corporate$(): Observable<Auth.ICorporates | undefined> {
    return this.insurerFacade.corporateUuid$.pipe(
      switchMap((uuid) =>
        this.authFacade.corporates$.pipe(
          map((corporates) =>
            corporates.find((corporate) => corporate.uuid === uuid)
          )
        )
      )
    );
  }
}
