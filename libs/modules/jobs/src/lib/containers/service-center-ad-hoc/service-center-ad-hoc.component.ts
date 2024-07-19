import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

// BreadCrumb & Sort Interfaces
import {  IBC } from '@neural/shared/data';

// Models
import { IReservations } from '../../models';

// Facades
import { ServiceCenterScheduledFacade } from '../../+state/facade';

// Auth
import { Auth, AuthFacade } from '@neural/auth';
import { CustomerAccountsFacade } from '@neural/modules/administration';

// RxJs
import { Observable } from 'rxjs';



@Component({
  selector: 'neural-service-center-ad-hoc',
  templateUrl: './service-center-ad-hoc.component.html',
  styleUrls: ['./service-center-ad-hoc.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceCenterAdHocComponent implements OnInit {

  bc: IBC[];

  constructor(
    private serviceCenterScheduledFacade: ServiceCenterScheduledFacade,
    private customerAccountsFacade: CustomerAccountsFacade,
  ) {}

  ngOnInit(): void {
    this.initialData();
  }

  initialData() {
    this.bc = [
      {
        name: 'hub',
        path: null
      },
      {
        name: 'service center',
        path: null
      },
      {
        name: 'scheduled',
        path: '/app/hub/reservations/service-center/scheduled'
      },
      {
        name: 'create',
        path: null
      }
    ];
  }

}
