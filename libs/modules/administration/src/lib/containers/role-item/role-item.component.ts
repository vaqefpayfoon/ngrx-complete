import { Component, OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';

// BreadCrumb Interface
import { IBC } from '@neural/shared/data';

// Models
import { IRole } from '../../models';

// RxJs
import { Observable } from 'rxjs';

// facade
import { RolesFacade, RoleTagsFacade } from '../../+state/facades';
import { AuthFacade, Auth, PermissionValidatorService } from '@neural/auth';

// permission tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-role-item',
  templateUrl: './role-item.component.html',
  styleUrls: ['./role-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleItemComponent implements OnInit, OnDestroy {
  title = 'create';

  role$: Observable<IRole.IDocument>;

  permissions$: Observable<string[]>;

  tagPermissions$: Observable<{}>;

  loading$: Observable<any>;

  error$: Observable<any>;

  account$: Observable<Auth.AccountClass>;

  bc: IBC[];

  constructor(
    private rolesFacade: RolesFacade,
    private roleTagsFacade: RoleTagsFacade,
    private authFacade: AuthFacade,
    private permissionValidatorService: PermissionValidatorService
  ) {}

  ngOnInit() {
    this.initialData();
  }

  ngOnDestroy() {
    this.rolesFacade.onResetSelectedRole()
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
        name: 'roles',
        path: '/app/administration/roles'
      },
      {
        name: 'create',
        path: null
      }
    ];

    this.role$ = this.rolesFacade.role$;
    this.permissions$ = this.roleTagsFacade.permissions$;
    this.loading$ = this.rolesFacade.loading$;
    this.error$ = this.rolesFacade.error$;

    this.account$ = this.authFacade.account$;

    this.tagPermissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.AccountRole.CREATE_ACCOUNT_ROLE,
      permissionTags.AccountRole.UPDATE_ACCOUNT_ROLE,
      permissionTags.AccountRole.GET_ACCOUNT_ROLE
    ]);
  }

  onCreate(role: IRole.IDocument) {
    this.rolesFacade.create(role);
  }

  onUpdate(role: IRole.IDocument) {
    this.rolesFacade.update(role);
  }

  onLoad(role: IRole.IDocument) {
    if (role) {
      this.bc[this.bc.length - 1].name = role.name;
    }
  }
}
