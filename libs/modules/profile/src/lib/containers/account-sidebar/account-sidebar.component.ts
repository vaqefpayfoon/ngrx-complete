import { Component, ChangeDetectionStrategy } from '@angular/core';

// Dialog
import { LogoutConfirmationDialogComponent } from '../../components';

// MatDialog Angular material
import { MatDialog } from '@angular/material/dialog';

// Auth Facades
import { AuthFacade } from '@neural/auth';

@Component({
  selector: 'neural-account-sidebar',
  templateUrl: './account-sidebar.component.html',
  styleUrls: ['./account-sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountSidebarComponent {
  menu = ['general'];

  constructor(private dialog: MatDialog, private authFacade: AuthFacade) {}

  logout() {
    const dialogRef = this.dialog.open(LogoutConfirmationDialogComponent);

    dialogRef.componentInstance.exit.subscribe(x => {
      if (x) {
        this.authFacade.onLogout();
      }
    });
  }
}
