import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';

// BreadCrumb Interface
import { IBC } from '@neural/shared/data';

// Models
import { IAccount } from '../../models';

// facade
import { AccountsFacade } from '../../+state/facades';
// Auth
import { Auth, AuthFacade, PermissionValidatorService } from '@neural/auth';

// RxJs
import { Observable } from 'rxjs';

// permission tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-synchronization-item',
  templateUrl: './synchronization-item.component.html',
  styleUrls: ['./synchronization-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SynchronizationItemComponent implements OnInit {

  private _title = 'synchronization';
  public get title() {
    return this._title;
  }
  public set title(value) {
    this._title = value;
  }

  error$: Observable<any>;

  permissions$: Observable<{}>;

  selectedCorporate$: Observable<Auth.ICorporates>;

  bc: IBC[];

  constructor(
    private cd: ChangeDetectorRef,
    private accountsFacade: AccountsFacade,
    private authFacade: AuthFacade,
    private permissionValidatorService: PermissionValidatorService
  ) {}

  initialData() {
    this.bc = [
      {
        name: 'administration',
        path: null,
      },
      {
        name: 'synchronization',
        path: null,
      },
    ];

    this.permissions$ = this.permissionValidatorService.isAvailable([
      permissionTags.Account.ACCOUNT_EXCEL_IMPORT
    ]);

    this.selectedCorporate$ = this.authFacade.selectedCorporate;
  }

  ngOnInit() {
    this.initialData();
  }

  onUpdate(paload: IAccount.ISynchronization) {
    this.accountsFacade.synchronization(paload);
  }

  onLoad(corporate: string) {
    if (corporate) {
      this.bc[this.bc.length - 1].name += ' | ' + corporate;

      this.title += ' | ' + corporate;

      this.cd.detectChanges();
    }
  }
}
