import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanLoad,
  CanActivateChild,
  Router,
  UrlSegment,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Store } from '@ngrx/store';
import * as fromStore from '../+state';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, of, throwError } from 'rxjs';
import { map, switchMap, catchError, filter, take, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {

  constructor(
    private store: Store<fromStore.AuthState>,
    private af: AngularFireAuth,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.checkAnonymousToken().pipe(
      switchMap(() => this.checkToken()),
      catchError((error) => {
        console.error(`Error occurred on Activation: `, error);
        return of(false);
      })
    );
  }

  canLoad(): Observable<boolean> {
    return this.checkAnonymousToken().pipe(
      switchMap(() => this.checkToken()),
      catchError((error) => {
        console.error(`Error occurred on Load: `, error);
        return of(false);
      })
    );
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.checkAnonymousToken().pipe(
      switchMap(() => this.checkToken()),
      catchError((error) => {
        console.error(`Error occurred on Child Activatio: `, error);
        return of(false);
      })
    );
  }

  checkAnonymousToken(): Observable<boolean> {
    return this.af.authState.pipe(
      map((loaded: any) => {
        if (!loaded || !!loaded.isAnonymous) {
          this.router.navigate(['/login']);
          return loaded.isAnonymous;
        }
        return !loaded.isAnonymous;
      }),
      take(1)
    );
  }

  checkToken(): Observable<boolean> {
    return this.af.idToken.pipe(
      catchError((error) => {
        this.store.dispatch(
          fromStore.AuthActions.Logout({
            payload: 'Error retrieving id token.',
          })
        );
        return of(false);
      }),
      switchMap((token) => {
        if (!token) {
          this.store.dispatch(
            fromStore.AuthActions.Logout({
              payload: 'You do not have access to the control panel.',
            })
          );
          this.store.dispatch(fromStore.AuthActions.AnonymousToken());
          return of(false);
        }

        return this.checkStore(token).pipe(
          catchError((error) => {
            console.error(error);
            this.store.dispatch(
              fromStore.AuthActions.Logout({
                payload: 'Error checking token.',
              })
            );
            return of(false);
          })
        );
      }),
      filter((permitted: any) => permitted),
      take(1)
    );
  }

  checkStore(token: any): Observable<boolean> {
    if (!token) {
      return of(false);
    }
      return this.store.select(fromStore.getAuthLoggedIn).pipe(
        tap((loaded) => {
          if (!loaded) {
            const helper = new JwtHelperService();
            if (!token) {
              this.store.dispatch(
                fromStore.AuthActions.FirebaseReauthenticated({
                  payload: token,
                })
              );
              return of(false);
            } 
            // token?.subscribe(res => {
              try{
              // if(!res){
              //   return of(false);
              // }
              const decodedToken = helper.decodeToken(token);
              const isTokenExpired = helper.isTokenExpired(token);
              const timestamp = Math.floor(Date.now() / 1000);
            if (token && isTokenExpired) {
              this.store.dispatch(
                fromStore.AuthActions.FirebaseReauthenticated({
                  payload: token,
                })
              );
              return of(true);
            } else if (token && !isTokenExpired) {
              if (timestamp < decodedToken?.exp) {
                this.store.dispatch(
                  fromStore.AuthActions.FirebaseReauthenticated({
                    payload: token,
                  })
                );
              }
              return of(true);
            }
          }
            catch(error){
              console.error('Error at Check: ', error);
              return of(false);
            }
          // });
            return of(true);
          }
        }),
        filter((loaded) => loaded),
        take(1)
      );
    }
}
