import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';

// BreadCrumb Interface
import { IBC } from '@neural/shared/data';

// Models
import { ITemplates } from '../../models';

// facade
import { MasterTemplatesFacade } from '../../+state/facades';
// Auth
import { Auth, AuthFacade, PermissionValidatorService } from '@neural/auth';

// RxJs
import { Observable } from 'rxjs';

// permission tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-master-template-item',
  templateUrl: './master-template-item.component.html',
  styleUrls: ['./master-template-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MasterTemplateItemComponent implements OnInit, OnDestroy {
  title = 'create a new template';

  data$: Observable<any>;

  template$: Observable<ITemplates.IDocument>;

  selectedCorporate$: Observable<Auth.ICorporates>;

  error$: Observable<any>;

  permissions$: Observable<{}>;

  bc: IBC[];

  constructor(
    private templatesFacade: MasterTemplatesFacade,
    private authFacade: AuthFacade,
    private permissionValidatorService: PermissionValidatorService,
    private cd: ChangeDetectorRef
  ) {}

  initialData() {
    this.bc = [
      {
        name: 'administration',
        path: null
      },
      {
        name: 'configuration',
        path: null
      },
      {
        name: 'templates',
        path: '/app/configuration/templates/master'
      },
      {
        name: 'create',
        path: null
      }
    ];

    this.template$ = this.templatesFacade.template$;

    this.error$ = this.templatesFacade.error$;

    this.selectedCorporate$ = this.authFacade.selectedCorporate;

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.Template.CREATE_TEMPLATE,
      permissionTags.Template.CREATE_MASTER_TEMPLATE,
      permissionTags.Template.UPDATE_TEMPLATE,
      permissionTags.Template.GET_TEMPLATE
    ]);

    this.data$ = this.templatesFacade.router$;
  }

  ngOnInit() {
    this.initialData();
  }

  ngOnDestroy() {
    this.templatesFacade.onResetSelectedMasterTemplate();
  }

  onCreate(template: ITemplates.ICreateMaster) {
    if (!!template) {
      this.templatesFacade.onCreateMaster(template);
    }
  }

  onUpdate(template: ITemplates.IUpdate) {
    if (!!template) {
      this.templatesFacade.onUpdate(template);
    }
  }

  onLoad(template: ITemplates.IDocument) {
    if (template) {
      this.title = template.name;
      this.bc[this.bc.length - 1].name = template.name;
      this.cd.detectChanges();
    }
  }
}
