import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// Model
import { IApps } from '../../models';

@Component({
  selector: 'neural-corporate-app-token-dialog',
  templateUrl: './corporate-app-token-dialog.component.html',
  styleUrls: ['./corporate-app-token-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CorporateAppTokenDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CorporateAppTokenDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: IApps.IToken
  ) {}

  get name() {
    return this.data.corporateApp.name;
  }

  copy(token: string): void {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = token;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);

    this.dialogRef.close(false);
  }
}
