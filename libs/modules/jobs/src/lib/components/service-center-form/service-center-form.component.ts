import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'neural-service-center-form',
  templateUrl: './service-center-form.component.html',
  styleUrls: ['./service-center-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceCenterFormComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  selectCustomer(event: any) {

  }

}
