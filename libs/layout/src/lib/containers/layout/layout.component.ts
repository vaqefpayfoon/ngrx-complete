import { Component, OnInit, Inject } from '@angular/core';

// Auth Facades
import { AuthFacade, Auth, PermissionValidatorService } from '@neural/auth';

// RxJs
import { Observable } from 'rxjs';

// NavService
import { MenuService } from '../../services';

// validator

// Environment
import { ENVIRONMENT, Environment } from '@neural/environment';

@Component({
  selector: 'neural-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  account$: Observable<any>;

  menu$: any;

  corporates$: Observable<Auth.ICorporates[]>;

  branches$: Observable<Auth.IBranch[]>;

  selectedCorporate$: Observable<Auth.ICorporates>;

  selectedBranch$: Observable<Auth.IBranch>;

  permissions$: Observable<Auth.IPermissions>;

  data$: Observable<any>;

  isPasswordExpired: boolean;

  passwordValidity: any;

  constructor(
    private authFacade: AuthFacade,
    private menuService: MenuService,
    private validator: PermissionValidatorService,
    @Inject(ENVIRONMENT) private readonly env: Environment
  ) {}

  public get version() {
    return this.env.version;
  }

  ngOnInit() {
    this.account$ = this.authFacade.account$;

    this.corporates$ = this.authFacade.corporates$;

    this.selectedCorporate$ = this.authFacade.selectedCorporate;

    this.selectedBranch$ = this.authFacade.selectedBranch;

    this.menu$ = this.validator.generateMenu(this.menuService.getMenuItems());

    this.data$ = this.authFacade.router$;

    this.permissions$ = this.authFacade.permissions$;

    this.authFacade.passwordValidity$.subscribe(
      (data) => (this.passwordValidity = new Date(data))
    );

    this.getPasswordExpiry();
  }

  selectCorporate(corporate: Auth.ICorporates) {
    this.authFacade.onSelectCorporate(corporate);
  }

  selectBranch(branch: Auth.IBranch) {
    this.authFacade.onSelectBranch(branch);
  }

  resetSwitcher(name: string) {
    this.authFacade.onReset(name);
  }

  reditectToHome(event: boolean) {
    if (event) {
      this.authFacade.onRedirect();
    }
  }

  getPasswordExpiry() {
    const expiryDays = this.validator.calculateExpiryDays(
      this.passwordValidity
    );

    if (expiryDays < 1) {
      this.isPasswordExpired = true;
    }
  }

  OnContactUs() {
    this.authFacade.onContactUs();
  }
}
