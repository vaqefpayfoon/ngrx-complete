import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// Vehicles Components
import * as profileComponents from './components';

// Vehicles Containers
import * as profileContainers from './containers';

// Auth Gaurds
import * as fromAuth from '@neural/auth'

// Ui
import { UiModule } from '@neural/ui';

// Auth Guards
import { AuthGuard, CallingCodesExistsGuard } from '@neural/auth';

import { from } from 'rxjs';

const ROUTES: Routes = [
  {
    path: '',
    component: profileContainers.AccountComponent,
    pathMatch: 'prefix',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'general'
      },
      {
        path: 'general',
        component: profileContainers.AccountGeneralComponent,
        canLoad: [AuthGuard],
        canActivate: [AuthGuard, fromAuth.CallingCodesExistsGuard]
      }
    ]
  }
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(ROUTES), UiModule],
  declarations: [
    ...profileComponents.COMPONENTS,
    ...profileContainers.COMPONENTS
  ],
  exports: [...profileComponents.COMPONENTS, ...profileContainers.COMPONENTS],
})
export class ProfileModule {}