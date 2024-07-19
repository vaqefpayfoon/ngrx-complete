import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  AfterViewChecked,
  ViewChild,
  ElementRef,
} from '@angular/core';

import { IReservations } from '../../models';

// Forms
import { FormControl } from '@angular/forms';

// Material datePicker event
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment } from 'moment';

const moment = _rollupMoment || _moment;
@Component({
  selector: 'neural-confirmed-calendar',
  templateUrl: './confirmed-calendar.component.html',
  styleUrls: ['./confirmed-calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmedCalendarComponent implements OnChanges, AfterViewChecked {
  @Input() dayList: {
    days: number;
    year: number;
    month: number;
  };

  @Input() currentDate: string;
  @Input() filterInput = false;

  date = new FormControl(new Date());

  @Output() incrementChange: EventEmitter<boolean> = new EventEmitter<
    boolean
  >();

  @Output() decrementChange: EventEmitter<boolean> = new EventEmitter<
    boolean
  >();

  @Output() dateChange: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('scrollMe', { static: true })
  private myScrollContainer: ElementRef;
  
  daysArray: {
    day: number;
    year: number;
    month: number;
    active?: boolean;
  }[] = [];
  selectedDate = false;

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    const [year, month, day] = this.currentDate?.split('-');
    if (!this.selectedDate) {

      this.daysArray = this.fillDays(
        this.dayList.year,
        this.filterInput ? +month : this.dayList.month,
        this.dayList.days,
      );
    }

    if ((changes.currentDate && changes.currentDate.currentValue) || this.selectedDate) {
      const myDate = new Date(`${year}/${month}/${day}`);

      this.date.patchValue(myDate);
      this.daysArray = this.fillDays(
        +year,
        +month,
        this.dayList.days,
        +day
      );
    }
  }
  fillDays(year: number, month: number, days: number, currentDay: number = 0) {
    const arr = [];
    const [cyear, cmonth, cday] = this.currentDate?.split('-');
    for (let index = 0; index < days; index++) {
      arr.push({
        day: index + 1,
        year: year,
        month: month,
        active:
        (currentDay == 0 ? (+cday == index + 1) : (+cday == index + 1)) &&
          +cyear == year &&
          (+cmonth == month),
      });
    }
    return arr;
  }
  ngAfterViewChecked() {
    if (this.date.valid) {
      const currenctDate = this.date.value.getDate();

      if (currenctDate > 15) {
        this.scrollToRight();
      }
    }
  }

  onIncDate() {
    this.selectedDate = false;
    this.incrementChange.emit(true);
    setTimeout(() => {
      this.scrollToLeft();
    }, 500);
  }

  onDecDate() {
    this.selectedDate = false;
    this.decrementChange.emit(true);
    setTimeout(() => {
      this.scrollToLeft();
    }, 500);
  }

  onValChange(date: string) {
    this.selectedDate = true;
    this.currentDate = moment(new Date(date)).format('YYYY-MM-DD');
    this.daysArray = this.fillDays(
      new Date(date).getFullYear(),
      new Date(date).getMonth() + 1,
      this.dayList.days,
      new Date(date).getDate()
    );
    this.dateChange.emit(this.currentDate);
  }
  activeStatus(item: boolean): string {
    if(item) {
      return 'active-button';
    }
    return 'deactive-button';
  }

  monthName(month: number) {
    return IReservations.months[month - 1];
  }

  addEvent(event: MatDatepickerInputEvent<Date>) {
    this.selectedDate = true;
    const date = event.target.value;
    this.currentDate = moment(new Date(date)).format('YYYY-MM-DD');
    this.daysArray = this.fillDays(
      new Date(date).getFullYear(),
      new Date(date).getMonth() + 1,
      this.dayList.days,
      new Date(date).getDate()
    );
    this.dateChange.emit(this.currentDate);
  }

  scrollToRight(): void {
    try {
      this.myScrollContainer.nativeElement.scrollLeft = this.myScrollContainer.nativeElement.scrollWidth;
    } catch (err) {}
  }

  scrollToLeft(): void {
    try {
      this.myScrollContainer.nativeElement.scrollLeft = 0;
    } catch (err) {}
  }
}
