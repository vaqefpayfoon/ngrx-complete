import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IBranches, ICorporates } from '../../models';

@Component({
  selector: 'neural-adtorque-branch',
  templateUrl: './adtorque-branch.component.html',
  styleUrls: ['./adtorque-branch.component.scss']
})
export class AdtorqueBranchComponent implements OnInit {
  @Input() permissions: any;
  @Input() parent: FormGroup;

  @Input() formDisabled: boolean;

  @Input() branch: IBranches.IDocument;
  constructor() { }

  ngOnInit(): void {
  }

}
