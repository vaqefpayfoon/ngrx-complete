import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IBranches } from '../../models';

@Component({
  selector: 'neural-fortellis-branch',
  templateUrl: './fortellis-branch.component.html',
  styleUrls: ['./fortellis-branch.component.scss']
})
export class FortellisBranchComponent implements OnInit {
  
  @Input() permissions: any;

  @Input() parent: FormGroup;

  @Input() formDisabled: boolean;

  @Input() branch: IBranches.IDocument;
  @Input() exists: boolean;
  constructor() { }

  ngOnInit(): void {
  }

}
