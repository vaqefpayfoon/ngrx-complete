import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IBranches, ICorporates } from '../../models';

@Component({
  selector: 'neural-leaseGenius-branch',
  templateUrl: './leaseGenius-branch.component.html',
  styleUrls: ['./leaseGenius-branch.component.scss']
})
export class LeaseGeniusBranchComponent implements OnInit {
  @Input() permissions: any;
  @Input() parent: FormGroup;

  @Input() formDisabled: boolean;

  @Input() branch: IBranches.IDocument;
  constructor() { }

  ngOnInit(): void {
  }

}
