import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';

// BreadCrumb & Sort Interfaces
import { IBC } from '@neural/shared/data';

// Models
import { IApps, ICorporates } from '../../models';

// permission tags
import { permissionTags } from '@neural/shared/data';
import { PermissionValidatorService } from '@neural/auth';

// Facades
import { AppsFacade, CorporatesFacade } from '../../+state/facades';

// RxJs
import { Observable } from 'rxjs';

@Component({
  selector: 'neural-corporate-app-item',
  templateUrl: './corporate-app-item.component.html',
  styleUrls: ['./corporate-app-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class CorporateAppItemComponent implements OnInit, OnDestroy {
  permissions$: Observable<{}>;

  corporate$: Observable<ICorporates.IDocument>;

  app$: Observable<IApps.IDocument>;

  bc: IBC[];

  title = 'new app';

  constructor(
    private permissionValidatorService: PermissionValidatorService,
    private corporatesFacade: CorporatesFacade,
    private appsFacade: AppsFacade,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.initialData();
  }

  ngOnDestroy() {
    this.appsFacade.onResetSelectedApp();
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
      },
      {
        name: 'new',
        path: null
      }
    ];

    this.corporate$ = this.corporatesFacade.corporate$;

    this.app$ = this.appsFacade.app$;

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.Corporate.GET_CORPORATE_APP,
      permissionTags.Corporate.CREATE_CORPORATE_APP,
      permissionTags.Corporate.UPDATE_CORPORATE_APP
    ]);
  }

  onCreare(payload: IApps.ICreate) {
    this.appsFacade.create(payload);
  }

  onUpdate(payload: IApps.IDocument) {
    this.appsFacade.update(payload);
  }

  onLoad({
    app,
    corporate
  }: {
    app?: IApps.IDocument;
    corporate: ICorporates.IDocument;
  }) {
    if (corporate && app) {
      this.bc[this.bc.length - 1].name = app.name;
      this.bc[this.bc.length - 2].path = `/app/customer/corporates/${
        app.corporateUuid
      }/app`;
      this.bc[this.bc.length - 3].name = corporate.name;
      this.bc[this.bc.length - 3].path = `/app/customer/corporates/${
        app.corporateUuid
      }`;
      this.title = app.name;
    }

    if (corporate && !app) {
      this.bc[this.bc.length - 2].path = `/app/customer/corporates/${
        corporate.uuid
      }/app`;
      this.bc[this.bc.length - 3].name = corporate.name;
      this.bc[this.bc.length - 3].path = `/app/customer/corporates/${
        corporate.uuid
      }`;
    }

    this.cd.detectChanges();
  }
}
