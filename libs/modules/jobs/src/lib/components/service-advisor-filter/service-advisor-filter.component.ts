import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Auth } from '@neural/auth';
import { IReservations } from '../../models';

@Component({
  selector: 'neural-service-advisor-filter',
  templateUrl: './service-advisor-filter.component.html',
  styleUrls: ['./service-advisor-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceAdvisorFilterComponent implements OnInit {
  @Input() totals: IReservations.ITotals;

  @Output() filtered = new EventEmitter();

  @Input() selectedServiceAdvisor: string;

  disableAllFilter = true;

  constructor() {}

  ngOnInit(): void {
    this.CheckAllFilter();
  }

  onFilter(value?: any) {
    this.filtered.emit(value);
  }

  CheckAllFilter() {
    if (
      this.selectedServiceAdvisor &&
      this.selectedServiceAdvisor === this.serviceAdvisorFilter.ALL
    ) {
      this.disableAllFilter = true;
    } else if (
      this.selectedServiceAdvisor &&
      this.selectedServiceAdvisor !== this.serviceAdvisorFilter.ALL
    ) {
      this.disableAllFilter = false;
    }
  }

  get serviceAdvisorFilter() {
    return IReservations.ServiceAdvisorFilter;
  }
}
