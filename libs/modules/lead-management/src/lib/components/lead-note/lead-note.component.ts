import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'neural-lead-note',
  templateUrl: './lead-note.component.html',
  styleUrls: ['./lead-note.component.scss']
})
export class LeadNoteComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<LeadNoteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}
  editmode = false;
  value = '';
  ngOnInit(): void {
      if (this.data.noteUuid) {
        this.editmode = true;
        this.value = this.data?.value;
      }
  }
  onClose(): void {
    this.dialogRef.close();
  }
  onConfirm(): void {
    this.data.note = this.value;
    this.dialogRef.close(this.data);
  }
}
