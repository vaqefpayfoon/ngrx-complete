import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'neural-schedular-modal',
  templateUrl: './schedular-modal.component.html',
  styleUrls: ['./schedular-modal.component.scss']
})
export class SchedularModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<SchedularModalComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) {}

  parent: FormGroup = this.fb.group({
    uuid: [''],
    name: ['', Validators.required],
    type: ['']
  })

  ngOnInit(): void {
    if(this.data?.value) {
      this.parent.patchValue(this.data?.value)
    }
  }

  onClose(): void {
    this.dialogRef.close({
      confirm: false,
      value: null
    });
  }
  
  onConfirm(): void {
    const value = this.parent.value;
    if(!this.data?.value) {
      delete value.uuid
    }
    if(!this.data.isScheduler) {
      delete value.type
    }
    this.dialogRef.close({
      confirm: true,
      value
    });
  }

}
