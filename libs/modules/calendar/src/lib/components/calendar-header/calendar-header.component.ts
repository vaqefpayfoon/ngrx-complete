import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';

import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment, Moment } from 'moment';

const moment = _rollupMoment || _moment;

// Models
import { ICalendars } from '../../models';

// Swiper
import { SwiperComponent, SwiperConfigInterface } from 'ngx-swiper-wrapper';

// Block calendar dialog
import { CalendarBlockConfirmationDialogComponent } from '../calendar-block-confirmation-dialog/calendar-block-confirmation-dialog.component';

// MatDialog
import { MatDialog } from '@angular/material/dialog';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

// permission tags
import { permissionTags } from '@neural/shared/data';

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'neural-calendar-header',
  templateUrl: './calendar-header.component.html',
  styleUrls: ['./calendar-header.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class CalendarHeaderComponent
  implements OnChanges, OnInit, AfterViewInit {
  @Input() permissions: any;

  @Input() timeZone: string;

  @Input() selectedDate: _moment.Moment;

  @Input() calendars: ICalendars.IDocument[];

  @Input() filter: ICalendars.IGetCalendar | null;

  @Output() selectedChange = new EventEmitter<_moment.Moment>();

  @Output() slotBlocked = new EventEmitter<
    ICalendars.IUpdateInternalCalendar
  >();

  @Output() loaded = new EventEmitter<ICalendars.IGetCalendar>();

  date = new FormControl();

  form = this.fb.group({
    date: ['', Validators.required],
    type: ['', Validators.compose([Validators.required])],
  });

  private _index: number;
  public get index(): number {
    return this._index;
  }
  public set index(value: number) {
    this._index = value;
  }

  public show = true;

  public config: SwiperConfigInterface = {
    a11y: { enabled: true },
    observer: true,
    direction: 'horizontal',
    slidesPerView: 15,
    centeredSlides: true,
    centerInsufficientSlides: true,
    keyboard: true,
    mousewheel: true,
    scrollbar: false,
    navigation: false,
    pagination: false,
    preventClicks: false,
    preventClicksPropagation: false,
    slideToClickedSlide: false,
  };

  public configMonth: SwiperConfigInterface = {
    a11y: { enabled: true },
    observer: true,
    loop: true,
    direction: 'horizontal',
    slidesPerView: 12,
    centeredSlides: true,
    centerInsufficientSlides: true,
    keyboard: false,
    mousewheel: false,
    scrollbar: false,
    navigation: false,
    pagination: false,
  };

  @ViewChild(SwiperComponent, { static: false }) componentRef?: SwiperComponent;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
  ) {}

  ngOnChanges(changes: SimpleChanges) {

    if (changes.filter && changes.filter.currentValue) {
      const [ type ] = this.filter?.selectedTypes ?? [];
      this.form.get('type').patchValue(type);
    }

    if (changes.selectedDate && changes.selectedDate.currentValue) {

      this.form.get('date').patchValue(moment(this.selectedDate));

      this.ngAfterViewInit();
    }
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    if (this.componentRef && this.componentRef.directiveRef) {
      this.componentRef.directiveRef.setIndex(this.selectedDate.date() - 1);

      this.index = this.componentRef.directiveRef.getIndex();

      this.componentRef.directiveRef.update();
    }
  }

  openDialog(slot: ICalendars.IDocument) {
    const { uuid, day } = slot;

    const dialogRef = this.dialog.open(
      CalendarBlockConfirmationDialogComponent,
      {
        data: slot,
        disableClose: true,
      }
    );

    dialogRef.componentInstance.blockedChanges.subscribe(
      (res: ICalendars.IUpdateInternalCalendar) => {
        this.slotBlocked.emit({ ...res, uuid, day });
      }
    );
  }

  public onIndexChange(index: number): void {
    const currentDay = this.days.find(
      (day) => moment(day).date() === index + 1
      );
    this.selectedChange.emit(moment(currentDay));
  }

  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.form.get('date').value;
    ctrlValue.year(normalizedYear.year());
    this.form.get('date').setValue(ctrlValue);
    
    this.form.get('date').markAsDirty();
    this.form.get('date').markAsTouched();
  }

  chosenMonthHandler(
    normalizedMonth: Moment,
    datepicker: MatDatepicker<Moment>
  ) {
    const ctrlValue = this.form.get('date').value;
    ctrlValue.month(normalizedMonth.month());
    this.form.get('date').setValue(ctrlValue);

    const current = this.form.get('date').value as Moment;
    const first = current.subtract(current.date() - 1, 'days');

    this.selectedChange.emit(first);
    this.componentRef.directiveRef.setIndex(0);
    this.index = 0;

    datepicker.close();

    this.form.get('date').markAsDirty();
    this.form.get('date').markAsTouched();
  }

  onGenerate(form: FormGroup) {
    const { valid, value } = form;
    if (valid) {
      const filter: ICalendars.IGetCalendar = {
        year: value?.date?.year(),
        month: value?.date?.month() + 1,
        selectedTypes: [value?.type],
      };
      this.loaded.emit(filter);
      this.form.disable();
    }
  }

  public onClick(index: number) {
    this.componentRef.directiveRef.setIndex(index);
    this.index = index;
  }

  get days() {
    const days = [];
    const today = moment(this.form.get('date').value);

    // Find first date of month
    const startDate = today.subtract(
      parseInt(today.format('DD'), 10) - 1,
      'days'
      );

    // create dates of months
    for (let index = 0; index < today.daysInMonth(); index++) {
      days.push(startDate.toISOString());
      startDate.add(1, 'days');
    }

    return days;
  }

  get months() {
    return moment.months();
  }

  get day(): ICalendars.IDocument {
    return this.calendars.find(
      (calendar) => moment(calendar.day).date() === this.selectedDate.date()
    );
  }

  get types() {
    return ICalendars.CalendarType;
  }

  get updatePermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Calendar.UPDATE_CALENDAR]
    ) {
      return true;
    }
    return false;
  }
}
