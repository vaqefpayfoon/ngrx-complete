import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

// BreadCrumb & Sort Interfaces
import { IBC } from '@neural/shared/data';

// Models
import { ITemplates } from '../../models';

// facade
import { MasterTemplatesFacade } from '../../+state/facades';

// RxJs
import { Observable } from 'rxjs';

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
  selector: 'neural-master-templates',
  templateUrl: './master-templates.component.html',
  styleUrls: ['./master-templates.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MasterTemplatesComponent implements OnInit {

  title = 'Master Templates';

  bc: IBC[];

  templates$: Observable<ITemplates.IDocument[]>;

  templatesConfig$: Observable<ITemplates.IConfig>;

  total$: Observable<number>;

  loading$: Observable<any>;

  error$: Observable<any>;

  permissions$: Observable<{}>;

  constructor(
    private templatesFacade: MasterTemplatesFacade,
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
        name: 'master templates',
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
      const configMaster: ITemplates.IConfig = {
        page: 1,
        limit: 1000
      };

      const filtersMaster: ITemplates.IFilter[] = [
        {
          isMaster: 1
        }
      ];

      this.templatesFacade.changeMasterTemplatesPage(
        configMaster,
        filtersMaster
      );
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

}
