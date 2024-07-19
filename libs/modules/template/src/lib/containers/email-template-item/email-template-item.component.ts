import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';

// BreadCrumb Interface
import { IBC } from '@neural/shared/data';

// Models
import { ITemplates } from '../../models';

// facade
import { EmailTemplatesFacade, MasterTemplatesFacade } from '../../+state/facades';
// Auth
import { Auth, AuthFacade, PermissionValidatorService } from '@neural/auth';

// RxJs
import { Observable } from 'rxjs';

// permission tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-email-template-item',
  templateUrl: './email-template-item.component.html',
  styleUrls: ['./email-template-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmailTemplateItemComponent implements OnInit, OnDestroy {
  title = 'create a new email template';

  data$: Observable<any>;

  template$: Observable<ITemplates.IDocument>;

  masterTemplates$: Observable<ITemplates.IDocument[]>;

  selectedCorporate$: Observable<Auth.ICorporates>;

  error$: Observable<any>;

  permissions$: Observable<{}>;

  images$: Observable<string[]>;

  bc: IBC[];

  constructor(
    private templatesFacade: EmailTemplatesFacade,
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
        name: 'email templates',
        path: '/app/configuration/templates/email'
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

    this.masterTemplates$ = this.masterTemplatesFacade.templates$;

    this.data$ = this.templatesFacade.router$;

    this.images$ = this.templatesFacade.images$;
  }

  ngOnInit() {
    this.initialData();
  }

  ngOnDestroy() {
    this.templatesFacade.onResetSelectedEmailTemplate();
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
