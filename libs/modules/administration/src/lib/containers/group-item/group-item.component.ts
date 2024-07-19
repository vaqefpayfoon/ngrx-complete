import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';

// BreadCrumb Interface
import {  IBC } from '@neural/shared/data';

// Models
import { IGroup } from '../../models';

// RxJs
import { Observable } from 'rxjs';

// facade
import { GroupsFacade } from '../../+state/facades';

// permission tags
import { permissionTags } from '@neural/shared/data';
import { Auth, AuthFacade, PermissionValidatorService } from '@neural/auth';

@Component({
  selector: 'neural-group-item',
  templateUrl: './group-item.component.html',
  styleUrls: ['./group-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupItemComponent implements OnInit, OnDestroy {
  group$: Observable<IGroup.IDocument>;
  roles$: Observable<{ uuid: string; name: string }[]>;

  loading$: Observable<any>;
  error$: Observable<any>;

  permissions$: Observable<{}>;

  selectedCorporate$: Observable<Auth.ICorporates>;

  bc: IBC[];

  constructor(
    private groupsFacade: GroupsFacade,
    private authFacade: AuthFacade,
    private permissionValidatorService: PermissionValidatorService
  ) {}

  ngOnInit() {
    this.initialData();
  }

  ngOnDestroy() {
    this.groupsFacade.onResetSelectedGroup();
  }

  initialData() {
    this.bc = [
      {
        name: 'administration',
        path: null
      },
      {
        name: 'Configuration',
        path: null
      },
      {
        name: 'groups',
        path: '/app/administration/groups'
      },
      {
        name: 'create',
        path: null
      }
    ];

    this.group$ = this.groupsFacade.group$;
    this.roles$ = this.groupsFacade.roles$;

    this.loading$ = this.groupsFacade.loading$;
    this.error$ = this.groupsFacade.error$;

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.AccountGroup.CREATE_ACCOUNT_GROUP,
      permissionTags.AccountGroup.UPDATE_ACCOUNT_GROUP,
      permissionTags.AccountGroup.GET_ACCOUNT_GROUP
    ]);

    this.selectedCorporate$ = this.authFacade.selectedCorporate;
  }

  onCreate(group: IGroup.IDocument) {
    this.groupsFacade.create(group);
  }

  onUpdate(group: IGroup.IDocument) {
    this.groupsFacade.update(group);
  }

  onLoad(group: IGroup.IDocument) {
    if (group) {
      this.bc[this.bc.length - 1].name = group.name;
    }
  }

  onCorporateChange(event: boolean) {
    if (event) {
      this.groupsFacade.onRedirect();
    }
  }
}
