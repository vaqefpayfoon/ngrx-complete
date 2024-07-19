import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IBranches } from '../../models';

@Component({
  selector: 'neural-cdk-branch',
  templateUrl: './cdk-branch.component.html',
  styleUrls: ['./cdk-branch.component.scss']
})
export class CdkBranchComponent implements OnInit {
  @Input() permissions: any;

  @Input() parent: FormGroup;

  @Input() formDisabled: boolean;

  @Input() branch: IBranches.IDocument;
  @Input() exists: boolean;
  constructor() { }

  ngOnInit(): void {
  }

}
