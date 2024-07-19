import { Component, OnInit, Inject } from '@angular/core';

import { Observable } from 'rxjs';

import { AuthFacade } from '../../+state/facades/auth.facade';

import { Auth } from '../../models';

// Environment
import { ENVIRONMENT, Environment } from '@neural/environment';

@Component({
  selector: 'neural-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loading$: Observable<boolean>;
  error$: Observable<string>;
  anonymousToken$: Observable<string>;

  constructor(
    private authFacade: AuthFacade,
    @Inject(ENVIRONMENT) private readonly env: Environment
  ) {}

  /**
   * version
   */
  public get version() {
    return this.env.version;
  }

  ngOnInit() {
    this.loading$ = this.authFacade.loading$;
    this.error$ = this.authFacade.error$;
    this.anonymousToken$ = this.authFacade.anonymousToken$;
  }

  onSubmit(event: Auth.Login) {
    this.authFacade.login(event);
  }

  OnContactUs() {
    this.authFacade.onContactUs();
  }
}
