import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';

// BreadCrumb Interface
import { IBC } from '@neural/shared/data';

// Models
import { ITemplates } from '../../models';

// facade
import {
  CampaignTemplatesFacade,
  MasterTemplatesFacade
} from '../../+state/facades';
// Auth
import { Auth, AuthFacade, PermissionValidatorService } from '@neural/auth';

// RxJs
import { Observable } from 'rxjs';

// permission tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-campaign-template-item',
  templateUrl: './campaign-template-item.component.html',
  styleUrls: ['./campaign-template-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CampaignTemplateItemComponent implements OnInit, OnDestroy {
  title = 'create a new template';

  data$: Observable<any>;

  template$: Observable<ITemplates.IDocument>;

  masterTemplates$: Observable<ITemplates.IDocument[]>;

  selectedCorporate$: Observable<Auth.ICorporates>;

  error$: Observable<any>;

  permissions$: Observable<{}>;

  images$: Observable<string[]>;

  bc: IBC[];

  constructor(
    private templatesFacade: CampaignTemplatesFacade,
    private masterTemplatesFacade: MasterTemplatesFacade,
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
        name: 'campiagn templates',
        path: '/app/configuration/templates/campaign'
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
      permissionTags.Template.UPDATE_TEMPLATE,
      permissionTags.Template.GET_TEMPLATE
    ]);

    this.data$ = this.templatesFacade.router$;

    this.masterTemplates$ = this.masterTemplatesFacade.templates$;

    this.images$ = this.templatesFacade.images$;
  }

  ngOnInit() {
    this.initialData();
  }

  ngOnDestroy() {
    this.templatesFacade.onResetSelectedCampaignTemplate();
  }

  onCreate(template: ITemplates.ICreate) {
    if (!!template) {
      this.templatesFacade.onCreate(template);
    }
  }

  onCreateFromMaster(template: ITemplates.ICreateFromMaster) {
    if (!!template) {
      this.templatesFacade.onCreateFromMaster(template);
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

  onCorporateChange(event: boolean) {
    if (event) {
      this.templatesFacade.onRedirect();
    }
  }

  uploadTemplateImage(image: File): void {
    this.templatesFacade.uploadTemplateImage(image);
  }
}
