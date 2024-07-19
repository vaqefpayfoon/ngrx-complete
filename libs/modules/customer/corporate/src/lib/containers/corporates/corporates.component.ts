import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

// BreadCrumb & Sort Interfaces
import { ISort, IBC } from '@neural/shared/data';

// Models
import { ICorporates } from '../../models';

// facade
import { CorporatesFacade } from '../../+state/facades';

// RxJs
import { Observable } from 'rxjs';

// Paginator
import { PageEvent } from '@angular/material/paginator';

// MatDialog
import { MatDialog } from '@angular/material/dialog';

// permission tags
import { permissionTags } from '@neural/shared/data';
import { PermissionValidatorService } from '@neural/auth';

// Dialog
import { CorporateConfirmationDialogComponent } from '../../components';

@Component({
  selector: 'neural-corporates',
  templateUrl: './corporates.component.html',
  styleUrls: ['./corporates.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CorporatesComponent implements OnInit {
  corporates$: Observable<ICorporates.IDocument[]>;

  total$: Observable<number>;

  corporatesConfig$: Observable<ICorporates.IConfig>;

  permissions$: Observable<{}>;

  loading$: Observable<any>;

  error$: Observable<any>;

  bc: IBC[];

  sort: ISort[];

  search = false;

  sorts: any[] = [];

  constructor(
    private corporatesFacade: CorporatesFacade,
    private dialog: MatDialog,
    private permissionValidatorService: PermissionValidatorService
  ) {}

  ngOnInit() {
    this.initialData();
  }

  initialData() {
    this.bc = [
      {
        name: 'administration',
        path: null
      },
      {
        name: 'corporates',
        path: null
      }
    ];

    this.sort = [
      {
        Name: 1
      },
      {
        Type: 1
      },
      {
        'Registeration Number': 1
      },
      {
        Status: 1
      }
    ];
    this.corporates$ = this.corporatesFacade.corporates$;
    this.total$ = this.corporatesFacade.total$;
    this.corporatesConfig$ = this.corporatesFacade.corporatesConfig$;

    this.loading$ = this.corporatesFacade.loading$;
    this.error$ = this.corporatesFacade.error$;

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.Corporate.LIST_CORPORATE,
      permissionTags.Corporate.CREATE_CORPORATE,
      permissionTags.Corporate.UPDATE_CORPORATE,
      permissionTags.Corporate.ACTIVATE_CORPORATE,
      permissionTags.Corporate.DEACTIVATE_CORPORATE,
      permissionTags.Corporate.GET_CORPORATE,
      permissionTags.Corporate.LIST_CORPORATE_APP,
      permissionTags.Agreement.LIST_AGREEMENT
    ]);
  }

  openDialog(event: ICorporates.IDocument) {
    const dialogRef = this.dialog.open(CorporateConfirmationDialogComponent, {
      data: event,
      disableClose: true
    });

    dialogRef.componentInstance.status.subscribe((res: boolean) => {
      if (res) {
        return this.corporatesFacade.toggleStatus(event);
      } else {
        return this.corporatesFacade.resetToggle(event);
      }
    });
  }

  onRefresh(event: boolean) {
    if (event) {
      const params: ICorporates.IConfig = {
        limit: ICorporates.Config.LIMIT,
        page: 1
      };
      this.corporatesFacade.setCorporatePage(params);
    }
  }

  changePage(event: PageEvent) {
    const params: ICorporates.IConfig = {
      limit: ICorporates.Config.LIMIT,
      page: event.pageIndex + 1
    };
    this.corporatesFacade.setCorporatePage(params);
  }
}
