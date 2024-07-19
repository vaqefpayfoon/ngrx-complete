import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

// Auth Facades
import { AuthFacade, Auth } from '@neural/auth';

// RxJs
import { Observable } from 'rxjs';

@Component({
  selector: 'neural-account-general',
  templateUrl: './account-general.component.html',
  styleUrls: ['./account-general.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountGeneralComponent implements OnInit {
  account$: Observable<Auth.AccountClass>;

  codes$: Observable<Auth.IPhoneCode[]>;

  constructor(private authFacade: AuthFacade) { }

  ngOnInit() {
    this.account$ = this.authFacade.account$;

    this.codes$ = this.authFacade.codes$;
  }

  updateSelfAccountProfile(payload: Auth.IAccount) {
    this.authFacade.onUpdateSelfAccountProfile(payload);
  }

  updatePassword(password: string) {
    this.authFacade.onUpdatePassword(password);
    // this.authFacade.onLogout()
  }

  updatePhone(phone: Auth.IPhone) {
    this.authFacade.onUpdatePhone(phone);
  }
  
  updateImage(image) {
    this.authFacade.onUpdateImage(image);
  }
}