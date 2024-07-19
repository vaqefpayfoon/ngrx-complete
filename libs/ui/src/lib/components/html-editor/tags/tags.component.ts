import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ITags } from '@neural/shared/data';

@Component({
  selector: 'nrv-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit {
  selectedTag: string;

  constructor(
    private dialogRef: MatDialogRef<TagsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ITags
  ) {}

  ngOnInit(): void {}

  changeSelected(tag: string) {
    this.selectedTag = tag;
  }

  addTag() {
    if (this.selectedTag) {
      this.dialogRef.close({ data: this.selectedTag });
    }
  }

}
