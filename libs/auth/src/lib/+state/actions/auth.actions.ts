import { createAction, props, union } from '@ngrx/store';

// Models
import { Auth } from '../../models';

// Anonymous Token
export const AnonymousToken = createAction('[Auth] Anonymous Token');
export const AnonymousTokenSuccess = createAction(
  '[Auth] Anonymous Token Success',
  props<{ payload: string }>()
);

// Login
export const Login = createAction(
  '[Auth] Login',
  props<{ payload: Auth.Login }>()
);
export const LoginSuccess = createAction('[Auth] Login Success');
export const LoginFail = createAction(
  '[Auth] Login Fail',
  props<{ payload: any }>()
);
export const LoginRedirect = createAction('[Auth] Login Redirect');

// Account Class
export const AccountClass = createAction('[Auth] Account Class');
export const AccountClassSuccess = createAction(
  '[Auth] Account Class Success',
  props<{ payload: Auth.Account }>()
);
export const AccountClassFail = createAction(
  '[Auth] Account Class Fail',
  props<{ payload: any }>()
);

// Select Corporate
export const SelectCorporate = createAction(
  '[Auth] Select Corporate',
  props<{ payload: Auth.ICorporates }>()
);

// Select Branch
export const SelectBranch = createAction(
  '[Auth] Select Branch',
  props<{ payload: Auth.IBranch }>()
);

// Reset Switcher
export const ResetSwitcher = createAction(
  '[Auth] Reset Switcher',
  props<{ payload: string }>()
);

// forgotPassword
export const ForgotPassword = createAction('[Auth] Forgot Password');

// Logout
export const Logout = createAction('[Auth] Logout', props<{ payload: any }>());

// Server Authenticate
export const ServerAuthenticated = createAction(
  '[Auth] Server Authenticated',
  props<{ payload: Auth.Account }>()
);

// Firebase Authenticate
export const FirebaseAuthenticated = createAction(
  '[Auth] Firebase Authenticated',
  props<{ payload: { token: string } }>()
);
export const FirebaseReauthenticated = createAction(
  '[Auth] Firebase Reauthenticated',
  props<{ payload: string }>()
);

// Permission
export const LoadPermission = createAction(
  '[Auth] Load Permissions',
  props<{ payload: Auth.IPermissions }>()
);
export const ReLoadPermission = createAction(
  '[Auth] ReLoad Permissions',
  props<{ payload: Auth.IPermissions }>()
);

// Core Self Name
export const UpdateSelfAccountProfile = createAction(
  '[Core] Update Self Acount Profile',
  props<{ payload: Auth.IAccount }>()
);
export const UpdateSelfAccountProfileFail = createAction(
  '[Core] Update Self Acount Profile Fail',
  props<{ payload: any }>()
);
export const UpdateSelfAccountProfileSuccess = createAction(
  '[Core] Update Self Acount Profile Success',
  props<{ payload: any }>()
);

// Core Self Phone
export const UpdateSelfPhone = createAction(
  '[Core] Update Self Phone',
  props<{ payload: Auth.IPhone }>()
);
export const UpdateSelfPhoneFail = createAction(
  '[Core] Update Self Phone Fail',
  props<{ payload: any }>()
);
export const UpdateSelfPhoneSuccess = createAction(
  '[Core] Update Self Phone Success',
  props<{ payload: Auth.IPhone }>()
);

// Core Self Password
export const UpdateSelfPassword = createAction(
  '[Core] Update Self Password',
  props<{ payload: string }>()
);
export const UpdateSelfPasswordFail = createAction(
  '[Core] Update Self Password Fail',
  props<{ payload: any }>()
);
export const UpdateSelfPasswordSuccess = createAction(
  '[Core] Update Self Password Success'
);

// Core Self Image
export const UpdateSelfImage = createAction(
  '[Core] Update Self Image',
  props<{ payload: Auth.IAccount }>()
);
export const UpdateSelfImageFail = createAction(
  '[Core] Update Self Image Fail',
  props<{ payload: any }>()
);
export const UpdateSelfImageSuccess = createAction(
  '[Core] Update Self Image Success',
  props<{ payload: Auth.IAccount }>()
);

// Check Account Type
export const CheckAccountType = createAction('[Core] Check Account Type');

// Go Home from Login Guard
export const GoHomeFromLoginGuard = createAction(
  '[Core] Go Home From Login Guard',
  props<{ payload: Auth.IPermission }>()
);

// Redirect to Home Page
export const GoHome = createAction('[Core] Go Home');

// Redirect to Zendesk
export const ContactUs = createAction('[Core] Contact Us');

// Redirect to profile Page
export const GoToProfile = createAction('[Core] Go To Profile');

// Get Countries Calling Codes
export const GetCountriesCallingCodes = createAction(
  '[Core] Get Countries Calling Codes'
);
export const GetCountriesCallingCodesFail = createAction(
  '[Core] Get Countries Calling Codes Fail',
  props<{ payload: any }>()
);
export const GetCountriesCallingCodesSuccess = createAction(
  '[Core] Get Countries Calling Codes Success',
  props<{ payload: Auth.IPhoneCode[] }>()
);

// Get Time Zone
export const GetTimeZone = createAction(
  '[Auth] Get Time Zone',
  props<{ payload: string }>()
);
export const GetTimeZoneSuccess = createAction(
  '[Auth] Get Time Zone Success',
  props<{ payload: string }>()
);

const all = union({
  AnonymousToken,
  Login,
  LoginSuccess,
  LoginFail,
  LoginRedirect,
  Logout,
  ServerAuthenticated,
  FirebaseAuthenticated,
  FirebaseReauthenticated,
  AccountClass,
  AccountClassSuccess,
  SelectCorporate,
  SelectBranch,
  AccountClassFail,
  UpdateSelfAccountProfile,
  UpdateSelfAccountProfileFail,
  UpdateSelfAccountProfileSuccess,
  UpdateSelfPhone,
  UpdateSelfPhoneFail,
  UpdateSelfPhoneSuccess,
  UpdateSelfPassword,
  UpdateSelfPasswordFail,
  UpdateSelfPasswordSuccess,
  UpdateSelfImage,
  UpdateSelfImageFail,
  UpdateSelfImageSuccess,
  CheckAccountType,
  GoHomeFromLoginGuard,
  GoHome,
  GetCountriesCallingCodes,
  GetCountriesCallingCodesFail,
  GetCountriesCallingCodesSuccess,
  GetTimeZone,
  GetTimeZoneSuccess,
  GoToProfile,
  ContactUs,
});
export type AuthActionsUnion = typeof all;
