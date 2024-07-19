import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { CanActivate } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { AuthFacade } from '../+state';
import { Auth } from '../models';
import { ICorporates } from '../models/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private af: AngularFireAuth, private authFacade: AuthFacade) {}

  canActivate(): Observable<boolean> {
    return this.checkTokenResult().pipe(map(x => x));
  }

  checkTokenResult(): Observable<boolean> {
    const localSelectedCorporate: ICorporates = JSON.parse(localStorage.getItem(Auth.Storage.SELECTED_CORPORATE)) || null;
    const helper = new JwtHelperService();

    return this.af.idToken.pipe(
      map(token => {
        if (!!token) {
          const { provider_id, accounts } = helper.decodeToken(token);
          let [ account ] = Array.isArray(accounts) ? accounts : [];
  
          if (this.isUserNotValid(provider_id, localSelectedCorporate)) {
            this.authFacade.getToken();
            return true;
          } else {
            if (accounts.length > 1) {
              account = accounts.find((acc) => acc.corporate.uuid === localSelectedCorporate.uuid);
            }
  
            if (this.isSuperAdmin(account.uuid)) {
              if (this.isAdminLocalCorporateNotExisted(localSelectedCorporate.uuid)) {
                this.authFacade.getToken();
                return true;
              }
            } else if (this.isUserCorporateNotMatched(account.corporate.uuid, localSelectedCorporate.uuid)) {
              this.authFacade.getToken();
              return true;
            }
          }
          
          this.authFacade.onRedirectFromLoginGuard(account.permissions);
          return false;
        } else {
          this.authFacade.getToken();
          return true;
        }
      }),
      filter((permitted: boolean) => permitted),
      take(1)
    );
  }

  isUserNotValid(provider_id: string, localSelectedCorporate: ICorporates): boolean {
    return provider_id === 'anonymous' ? true : 
      !localSelectedCorporate ? true : false;
  }

  isSuperAdmin(uuid: string): boolean {
    return uuid === '01bc8c3f-7aa7-4911-8b20-d93b286a0cb7' ? true : false;
  }

  isUserCorporateNotMatched(tokenCorporateUuid: string, localSelectedCorporateUuid: string): boolean {
    return tokenCorporateUuid !== localSelectedCorporateUuid ? true : false;
  }

  isAdminLocalCorporateNotExisted(localSelectedCorporateUuid: string) {
    return !localSelectedCorporateUuid ? true : false;
  }
}
