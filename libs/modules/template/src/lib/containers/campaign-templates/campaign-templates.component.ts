import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

// BreadCrumb & Sort Interfaces
import { IBC } from '@neural/shared/data';

// Models
import { ITemplates } from '../../models';

// facade
import { CampaignTemplatesFacade } from '../../+state/facades';

// RxJs
import { Observable } from 'rxjs';

// Paginator
import { PageEvent } from '@angular/material/paginator';

// permission tags
import { permissionTags } from '@neural/shared/data';
import { PermissionValidatorService } from '@neural/auth';

// Dialog
import {
  TemplateConfirmationDialogComponent,
  TemplateDeleteConfirmationDialogComponent
} from '../../components';

// MatDialog
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'neural-campaign-templates',
  templateUrl: './campaign-templates.component.html',
  styleUrls: ['./campaign-templates.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CampaignTemplatesComponent implements OnInit {
  title = 'Campaign Templates';

  bc: IBC[];

  templates$: Observable<ITemplates.IDocument[]>;

  templatesConfig$: Observable<ITemplates.IConfig>;

  total$: Observable<number>;

  loading$: Observable<any>;

  error$: Observable<any>;

  permissions$: Observable<{}>;

  constructor(
    private templatesFacade: CampaignTemplatesFacade,
    private permissionValidatorService: PermissionValidatorService,
    private dialog: MatDialog
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
        name: 'configuration',
        path: null
      },
      {
        name: 'campaign templates',
        path: null
      }
    ];

    this.templates$ = this.templatesFacade.templates$;

    this.templatesConfig$ = this.templatesFacade.templatesConfig$;

    this.total$ = this.templatesFacade.total$;

    this.loading$ = this.templatesFacade.loading$;

    this.error$ = this.templatesFacade.error$;

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.Template.LIST_TEMPLATE,
      permissionTags.Template.CREATE_TEMPLATE,
      permissionTags.Template.CREATE_FROM_MASTER_TEMPLATE,
      permissionTags.Template.CREATE_MASTER_TEMPLATE,
      permissionTags.Template.GET_TEMPLATE,
      permissionTags.Template.DEACTIVATE_TEMPLATE,
      permissionTags.Template.ACTIVATE_TEMPLATE,
      permissionTags.Template.DELETE_TEMPLATE,
      permissionTags.Template.CREATE_MASTER_TEMPLATE,
      permissionTags.Template.CREATE_FROM_MASTER_TEMPLATE
    ]);
  }

  onRefresh(event: boolean) {
    if (event) {
      const config: ITemplates.IConfig = {
        page: 1,
        limit: ITemplates.Config.LIMIT
      };

      const filters: ITemplates.IFilter[] = [
        {
          labels: [ITemplates.Labels.Campaign]
        }
      ];
      this.templatesFacade.changeCampaignTemplatesPage(config, filters);
    }
  }

  openDialog(event: ITemplates.IDocument) {
    const dialogRef = this.dialog.open(TemplateConfirmationDialogComponent, {
      data: event,
      disableClose: true
    });

    dialogRef.componentInstance.status.subscribe((res: boolean) => {
      if (res) {
        return this.templatesFacade.toggleStatus(event);
      } else {
        return this.templatesFacade.resetToggle(event);
      }
    });
  }

  openRemoveDialog(event: ITemplates.IDocument) {
    const dialogRef = this.dialog.open(
      TemplateDeleteConfirmationDialogComponent,
      {
        disableClose: true
      }
    );

    dialogRef.componentInstance.delete.subscribe((res: boolean) => {
      if (res) {
        return this.templatesFacade.onDelete(event);
      }
    });
  }

  changePage(event: PageEvent) {
    const params: ITemplates.IConfig = {
      limit: ITemplates.Config.LIMIT,
      page: event.pageIndex + 1
    };

    const filters: ITemplates.IFilter[] = [
      {
        labels: [ITemplates.Labels.Campaign]
      }
    ];

    this.templatesFacade.changeCampaignTemplatesPage(params, filters);
  }
}
