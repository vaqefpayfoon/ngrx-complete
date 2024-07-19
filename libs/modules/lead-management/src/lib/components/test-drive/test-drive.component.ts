import { Component, Input, OnInit } from '@angular/core';
import { ILeadTestDrive } from '../../models';

@Component({
  selector: 'neural-test-drive',
  templateUrl: './test-drive.component.html',
  styleUrls: ['./test-drive.component.scss']
})
export class TestDriveComponent {

  @Input() testDriveItem: ILeadTestDrive.IDocument;

}
