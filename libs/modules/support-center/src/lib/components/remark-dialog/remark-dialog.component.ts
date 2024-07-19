import { Component, Inject, OnInit } from '@angular/core';

//Angular material
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

//Models
import { IInsuranceEnquiries } from '../../models';

@Component({
  selector: 'neural-remark-dialog',
  templateUrl: './remark-dialog.component.html',
  styleUrls: ['./remark-dialog.component.scss'],
})
export class RemarkDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<RemarkDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IInsuranceEnquiries.IDocument
  ) {}

  ngOnInit(): void {}

  close(): void {
    this.dialogRef.close(false);
  }
}
