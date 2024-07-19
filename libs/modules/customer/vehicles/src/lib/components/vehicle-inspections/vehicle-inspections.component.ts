import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';

// Model
import { IVehicle } from '../../models';

@Component({
  selector: 'neural-vehicle-inspections',
  templateUrl: './vehicle-inspections.component.html',
  styleUrls: ['./vehicle-inspections.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VehicleInspectionsComponent {
  @Input() inspections: IVehicle.IInspection[];

  status = IVehicle.CheckupStatus;

  constructor() {}
}
