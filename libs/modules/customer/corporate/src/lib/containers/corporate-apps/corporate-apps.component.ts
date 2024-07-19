import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';

// BreadCrumb & Sort Interfaces
import { IBC } from '@neural/shared/data';

// Models
import { IApps, ICorporates } from '../../models';

// Facades
import { AppsFacade, CorporatesFacade } from '../../+state/facades';

// RxJs
import { Observable } from 'rxjs';

// permission tags
import { permissionTags } from '@neural/shared/data';
import { PermissionValidatorService } from '@neural/auth';

// MatDialog
import { MatDialog } from '@angular/material/dialog';

// Dialog
import { CorporateAppConfirmationDialogComponent } from '../../components';

@Component({
  selector: 'neural-corporate-apps',
  templateUrl: './corporate-apps.component.html',
  styleUrls: ['./corporate-apps.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class CorporateAppsComponent implements OnInit, AfterViewInit {
  corporate$: Observable<ICorporates.IDocument>;

  appsConfig$: Observable<IApps.IConfig>;

  apps$: Observable<IApps.IDocument[]>;

  token$: Observable<string>;

  total$: Observable<number>;

  error$: Observable<any>;

  loading$: Observable<any>;

  permissions$: Observable<{}>;

  bc: IBC[];

  @ViewChild('corporateName', { static: true })
  public corporateName: ElementRef<HTMLInputElement>;

  constructor(
    private appsFacade: AppsFacade,
    private corporatesFacade: CorporatesFacade,
    private permissionValidatorService: PermissionValidatorService,
    private dialog: MatDialog,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.initialData();
  }

  ngAfterViewInit() {
    this.bc[this.bc.length - 2].name = this.corporateName.nativeElement.value;
    this.cd.detectChanges();
  }

  initialData() {
    this.bc = [
      {
        name: 'administration',
        path: null
      },
      {
        name: 'corporates',
        path: '/app/customer/corporates'
      },
      {
        name: 'corporate name',
        path: null
      },
      {
        name: 'apps',
        path: null
      }
    ];

    this.corporate$ = this.corporatesFacade.corporate$;

    this.appsConfig$ = this.appsFacade.corporateAppsConfig$;

    this.apps$ = this.appsFacade.apps$;

    this.total$ = this.appsFacade.total$;

    this.error$ = this.appsFacade.error$;

    this.loading$ = this.appsFacade.loading$;

    this.token$ = this.appsFacade.token$;

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.Corporate.LIST_CORPORATE_APP,
      permissionTags.Corporate.GET_CORPORATE_APP,
      permissionTags.Corporate.CREATE_CORPORATE_APP,
      permissionTags.Corporate.ACTIVATE_CORPORATE_APP,
      permissionTags.Corporate.DEACTIVATE_CORPORATE_APP,
      permissionTags.Corporate.REGENERATE_CORPORATE_APP_TOKEN
    ]);
  }

  openDialog(event: IApps.IDocument) {
    const dialogRef = this.dialog.open(
      CorporateAppConfirmationDialogComponent,
      {
        data: event,
        disableClose: true
      }
    );

    dialogRef.componentInstance.status.subscribe((res: boolean) => {
      if (res) {
        return this.appsFacade.toggleStatus(event);
      } else {
        return this.appsFacade.resetToggle(event);
      }
    });
  }

  onRefresh(event: boolean, corporateUuid: string) {
    if (event) {
      const params: IApps.IConfig = {
        corporateUuid
      };
      this.appsFacade.setCorporateAppsPage(params);
    }
  }

  onRegenerateAppToken(corporateApp: IApps.IDocument) {
    this.appsFacade.regenerateCorporateAppToken(corporateApp);
  }
}
