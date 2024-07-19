import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { IAccount } from '@neural/modules/administration';
import { IBranches } from '../../models';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ScheduleValidators } from '../../functions/schedule-validation';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { debounceTime, map, startWith } from 'rxjs/operators';
import moment from 'moment';
import { Location } from '@angular/common';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'neural-schedular-team-form',
  templateUrl: './schedular-team-form.component.html',
  styleUrls: ['./schedular-team-form.component.scss'],
})
export class SchedularTeamFormComponent
  implements OnInit, AfterViewInit, OnChanges {
  @Output() typeEvent = new EventEmitter<string>();
  @Output() save = new EventEmitter<IBranches.ITeamPayload>();
  @Output() cancelEvent = new EventEmitter();
  @Input() brands: string[] = [];
  @Input() schedule: IBranches.ISchedules;
  @Input() accounts$: Observable<IAccount.IDocument[]>;
  team: IBranches.ITeams;
  schedulesUuid: string;
  teamUuid: string;
  branchUuid: string;
  corporateUuid: string;
  accounts: string[] = [];
  accountsObject: IAccount.IDocument[];

  @ViewChild('brandInput') brandInput: ElementRef<HTMLInputElement>;
  @ViewChild('accountInput') accountInput: ElementRef<HTMLInputElement>;
  @ViewChild('fElement', { static: false }) fElement: ElementRef<
    HTMLInputElement
  >;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  filteredBrands: Observable<string[]>;
  filteredAccounts: Observable<string[]>;

  myBrands: string[] = [];
  myAccounts: string[] = [];

  brandCtrl = new FormControl('');
  accountCtrl = new FormControl('', Validators.required);

  onModelChange: any = () => {};

  onTouch: any = () => {};
  customeValidation = {
    validator: ScheduleValidators.MatchValidator(
      'active',
      'startTime',
      'endTime',
      'maxAppointments'
    ),
  };
  durations: number[] = [5, 10, 15, 20, 30, 60];
  bookingLeadDays: number[] = [0,1,2,3,4,5,6,7];
  defaultValue = 'All Brands';
  step2 = false;
  saveState = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private location: Location
  ) {}

  form: FormGroup = this.fb.group({
    uuid: [''],
    name: ['', Validators.required],
    slotDuration: ['', Validators.required],
    brands: [[]],
    bookingLeadTime: [''],
    advisors: this.fb.array([]),
    weekdays: this.fb.array([]),
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.schedule && changes.schedule.currentValue && this.saveState) {
      this.initialized();
    }
  }

  ngOnInit(): void {
    this.initialized();
  }

  initialized(): void {
    this.route.params.subscribe((res) => {
      this.schedulesUuid = res.schedulesUuid;
      this.teamUuid = res.teamUuid;
      this.branchUuid = res.uuid;
      this.corporateUuid = res.cUuid;
      if (this.schedule) {
        this.team = this.schedule?.teams?.find((x) => x.uuid == this.teamUuid);
      } else {
        this.location.back();
      }
      if (this.team) {
        this.form.patchValue(this.team);
      }

      if (this.team?.brands && this.team?.brands.length) {
        this.myBrands = [...this.team?.brands];
      }

      if (this.team?.advisors && this.team?.advisors.length) {
        while (this.advisors.length !== 0) {
          this.advisors.removeAt(0);
        }
        this.myAccounts = [...this.team?.advisors.map((x) => x.name)];
        for (const advisor of this.team.advisors) {
          this.advisors.push(
            this.fb.group({
              uuid: [advisor.uuid],
              name: [advisor.name],
            })
          );
        }
      }

      // this.brands = [this.defaultValue, ...this.brands]
      // this.accounts.filter(x => x.permissions.operationRole == typeData)
      this.fillDaily();
      this.setAdviserValidation();
    });
  }

  ngAfterViewInit() {
    this.filteredBrands = this.brandCtrl.valueChanges.pipe(
      startWith(''),
      debounceTime(500),
      map((brand: string | null) =>
        brand ? this._filter(brand) : this.brands ? this.brands.slice() : []
      )
    );

    this.accounts$.subscribe((res) => {
      this.accountsObject = res;
      this.accounts = res.map((x) => x.identity.fullName);
      this.filteredAccounts = this.accountCtrl.valueChanges.pipe(
        startWith(''),
        debounceTime(500),
        map((account: string | null) =>
          account
            ? this._filterAccount(account)
            : this.accounts
            ? this.accounts.slice()
            : []
        )
      );
    });
  }

  registerOnChange(fn: Function) {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: Function) {
    this.onTouch = fn;
  }

  writeValue(value: string[]) {
    const brands = value ? value : [];

    this.myBrands = [...brands];
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.myBrands = [...this.myBrands, value];
    }

    this.brandCtrl.setValue(null);

    this.onTouch();
    this.onModelChange(this.myBrands);
  }

  remove(brand: string): void {
    const index = this.myBrands.findIndex((x) => x == brand);

    if (index >= 0 && this.myBrands && this.myBrands.length) {
      this.myBrands.splice(index, 1);

      this.onTouch();
      this.onModelChange(this.myBrands);

      if (this.myBrands && this.myBrands.length) {
        this.brandsControl.patchValue(this.myBrands);
      } else {
        this.brandsControl.patchValue([]);
      }
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const brands = this.myBrands ? this.myBrands : [];

    this.myBrands = [...brands, event.option.viewValue];

    this.brandInput.nativeElement.value = '';
    this.brandCtrl.setValue(null);

    this.onTouch();
    this.onModelChange(this.myBrands);

    if (this.myBrands && this.myBrands.length) {
      this.brandsControl.patchValue(this.myBrands);
    } else {
      this.brandsControl.patchValue([this.defaultValue]);
    }
    this.fElement?.nativeElement?.focus();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.brands.filter((brand) =>
      brand.toLowerCase().includes(filterValue)
    );
  }

  isBrandSelected(brand: string): boolean {
    return this.myBrands && this.myBrands.some((x) => x === brand)
      ? true
      : false;
  }

  writeValueAccount(value: string[]) {
    const accounts = value ? value : [];

    this.myAccounts = [...accounts];
  }

  addAccount(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.myAccounts = [...this.myAccounts, value];
    }

    this.accountCtrl.setValue(null);
    this.onTouch();
    this.onModelChange(this.myAccounts);
  }

  removeAccount(brand: string): void {
    const index = this.myAccounts.findIndex((x) => x == brand);

    if (index >= 0 && this.myAccounts && this.myAccounts.length) {
      this.myAccounts.splice(index, 1);
      this.advisors.removeAt(index);
      this.setAdviserValidation();
      this.onTouch();
      this.onModelChange(this.myAccounts);
    }
  }

  selectedAccount(event: MatAutocompleteSelectedEvent): void {
    const accounts = this.myAccounts ? this.myAccounts : [];

    this.myAccounts = [...accounts, event.option.viewValue];
    this.setAdviserValidation();
    this.accountInput.nativeElement.value = '';
    this.accountCtrl.setValue(null);
    this.onTouch();
    this.onModelChange(this.myBrands);

    const advisor = this.accountsObject.find(
      (x) => x.identity.fullName == event?.option?.value
    );
    if (advisor) {
      this.advisors.push(
        this.fb.group({
          uuid: [advisor.uuid, Validators.required],
          name: [advisor.identity.fullName],
        })
      );
    }
    this.fElement?.nativeElement?.focus();
  }

  private _filterAccount(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.accounts.filter((account) =>
      account.toLowerCase().includes(filterValue)
    );
  }

  isAccountSelected(account: string): boolean {
    return this.myAccounts && this.myAccounts.some((x) => x === account)
      ? true
      : false;
  }

  onTypeEvent(event: string): void {
    this.typeEvent.emit(event);
  }

  getType(scheduler: IBranches.SchedulesType): any {
    return IBranches.SchedulesType[scheduler];
  }

  get weekDays() {
    return this.form.get('weekdays') as FormArray;
  }

  get weekDaysItems(): AbstractControl[] {
    return (this.form.get('weekdays') as FormArray).controls;
  }

  activeDayName(day: AbstractControl): any {
    return day.get('day').value;
  }

  activeWeekDays(day: AbstractControl): any {
    return day.get('active').value;
  }

  dailyFormArray(i: number): FormArray {
    return this.weekDays?.controls[i]?.get('daily') as FormArray;
  }

  dailyItems(i: number): AbstractControl[] {
    return (this.weekDays?.controls[i]?.get('daily') as FormArray).controls;
  }

  slots(i: number, j: number) {
    return this.dailyFormArray(i).controls[j].get('slots') as FormArray;
  }

  slotsItems(i: number, j: number): AbstractControl[] {
    return (this.dailyFormArray(i).controls[j].get('slots') as FormArray)
      .controls;
  }

  get brandsControl() {
    return this.form.get('brands') as FormControl;
  }

  get advisors() {
    return this.form.get('advisors') as FormArray;
  }

  get advisorsItems(): AbstractControl[] {
    return (this.form.get('advisors') as FormArray).controls;
  }

  get ScheduleType() {
    return IBranches.SchedulesType;
  }

  get Name(): string {
    return this.schedule.name;
  }

  saveSchedule(form: FormGroup): void {
    const { valid, value } = form;
    if (valid) {
      const event: IBranches.ITeamPayload = {
        branchUuid: this.branchUuid,
        corporateUuid: this.corporateUuid,
        scheduleUuid: this.schedulesUuid,
        data: value,
      };
      this.save.emit(event);
      this.saveState = true;
    }
  }

  cancel(): void {
    this.cancelEvent.emit();
  }

  weekDaysForm(): void {
    this.weekDays.push(
      this.fb.group(
        {
          active: [false],
          day: ['Monday'],
          startTime: ['', Validators.required],
          endTime: ['', Validators.required],
          maxAppointments: [0, Validators.min(1)],
          daily: this.fb.array([]),
        },
        this.customeValidation
      )
    );
    this.weekDays.push(
      this.fb.group(
        {
          active: [false],
          day: ['Tuesday'],
          startTime: ['', Validators.required],
          endTime: ['', Validators.required],
          maxAppointments: [0, Validators.min(1)],
          daily: this.fb.array([]),
        },
        this.customeValidation
      )
    );
    this.weekDays.push(
      this.fb.group(
        {
          active: [false],
          day: ['Wednesday'],
          startTime: ['', Validators.required],
          endTime: ['', Validators.required],
          maxAppointments: [0, Validators.min(1)],
          daily: this.fb.array([]),
        },
        this.customeValidation
      )
    );
    this.weekDays.push(
      this.fb.group(
        {
          active: [false],
          day: ['Thursday'],
          startTime: ['', Validators.required],
          endTime: ['', Validators.required],
          maxAppointments: [0, Validators.min(1)],
          daily: this.fb.array([]),
        },
        this.customeValidation
      )
    );
    this.weekDays.push(
      this.fb.group(
        {
          active: [false],
          day: ['Friday'],
          startTime: ['', Validators.required],
          endTime: ['', Validators.required],
          maxAppointments: [0, Validators.min(1)],
          daily: this.fb.array([]),
        },
        this.customeValidation
      )
    );
    this.weekDays.push(
      this.fb.group(
        {
          active: [false],
          day: ['Saturday'],
          startTime: ['', Validators.required],
          endTime: ['', Validators.required],
          maxAppointments: [0, Validators.min(1)],
          daily: this.fb.array([]),
        },
        this.customeValidation
      )
    );
    this.weekDays.push(
      this.fb.group(
        {
          active: [false],
          day: ['Sunday'],
          startTime: ['', Validators.required],
          endTime: ['', Validators.required],
          maxAppointments: [0, Validators.min(1)],
          daily: this.fb.array([]),
        },
        this.customeValidation
      )
    );
    for (let i = 0; i <= 6; i++) {
      this.onActive(i);
    }
  }

  activeTmp(index: number) {
    return this.weekDays.controls[index].value.active;
  }

  onActive(index: number): void {
    const row = this.weekDays.controls[index].value;
    if (row?.active) {
      this.weekDays.controls[index]
        .get('startTime')
        .setValidators(Validators.compose([Validators.required]));
      this.weekDays.controls[index]
        .get('endTime')
        .setValidators(Validators.compose([Validators.required]));
      this.weekDays.controls[index]
        .get('maxAppointments')
        .setValidators(Validators.compose([Validators.min(1)]));
      this.weekDays.controls[index].get('startTime').updateValueAndValidity();
      this.weekDays.controls[index].get('endTime').updateValueAndValidity();
      this.weekDays.controls[index]
        .get('maxAppointments')
        .updateValueAndValidity();
    } else {
      this.weekDays.controls[index].get('startTime').clearValidators();
      this.weekDays.controls[index].get('startTime').updateValueAndValidity();
      this.weekDays.controls[index].get('endTime').clearValidators();
      this.weekDays.controls[index].get('endTime').updateValueAndValidity();
      this.weekDays.controls[index].get('maxAppointments').clearValidators();
      this.weekDays.controls[index]
        .get('maxAppointments')
        .updateValueAndValidity();
    }
  }

  setAdviserValidation(): void {
    if(this.myAccounts.length > 0) {
      this.accountCtrl.clearValidators();
      this.accountCtrl.updateValueAndValidity();
    } else {
      this.accountCtrl.setValidators(Validators.compose([Validators.required]));
      this.accountCtrl.updateValueAndValidity();
    }
  }

  timeSlotValue(i: number, j: number, k: number): string {
    return (this.dailyFormArray(i).controls[j].get(
      'slots'
    ) as FormArray).controls[k].get('startTime').value;
  }

  fillDaily(): void {
    if (this.team?.weekdays && this.team.weekdays?.length) {
      while (this.weekDays.length !== 0) {
        this.weekDays.removeAt(0);
      }
      let iCounter = 0;
      if (this.dailyFormArray(iCounter)) {
        while (this.dailyFormArray(iCounter).length !== 0) {
          let jCounter = 0;
          if (this.slots(iCounter, jCounter)) {
            while (this.slots(iCounter, jCounter).length !== 0) {
              this.slots(iCounter, jCounter).removeAt(0);
              jCounter++;
            }
          }
          this.dailyFormArray(iCounter).removeAt(0);
          iCounter++;
        }
      }
      let weekdayIndex = 0;
      for (const weekday of this.team?.weekdays) {
        let show = true;

        this.weekDays.push(
          this.fb.group(
            {
              active: [weekday.active],
              day: [weekday.day],
              startTime: [weekday.startTime],
              endTime: [weekday.endTime],
              maxAppointments: [weekday.maxAppointments],
              daily: this.fb.array([]),
            },
            this.customeValidation
          )
        );
        this.onActive(weekdayIndex);

        if (weekday?.daily && weekday?.daily?.length) {
          let j = 0;
          for (const day of weekday?.daily) {
            if (weekday.active) {
              this.dailyFormArray(weekdayIndex).push(
                this.fb.group({
                  day: [weekday.day],
                  show,
                  advisorUuid: day.advisorUuid,
                  advisorName: day.advisorName,
                  maxAppointments: day.maxAppointments,
                  slots: this.fb.array([]),
                })
              );
              show = false;
              if (day.slots && day.slots.length) {
                for (const slot of day.slots) {
                  this.slots(weekdayIndex, j).push(
                    this.fb.group({
                      startTime: slot.startTime,
                      endTime: slot.endTime,
                      numberOfAppointments: slot.numberOfAppointments,
                      teamSlotsMaxAppointments: slot.teamSlotsMaxAppointments,
                    })
                  );
                }
              } else {
                this.initializeDaily(weekdayIndex, j, weekday);
              }

              j += 1;
            }
          }
        } else {
          //initial slots
          let j = 0;
          for (const advisor of this.team.advisors) {
            this.dailyFormArray(weekdayIndex).push(
              this.fb.group({
                day: [weekday.day],
                show: [show],
                advisorUuid: [advisor.uuid],
                advisorName: [advisor.name],
                maxAppointments: [null],
                slots: this.fb.array([]),
              })
            );
            show = false;
            this.initializeDaily(weekdayIndex, j, weekday);
            
            j += 1;
          }
        }
        this.step2 = true;
        weekdayIndex += 1;
      }
    } else {
      this.weekDaysForm();
    }
  }

  initializeDaily(weekdayIndex: number, j: number, weekday: IBranches.IWeekDays): void {
    let slotDuration = 30;
    if (this.form.value.slotDuration) {
      slotDuration = +this.form.value.slotDuration;
    }
    let x = {
      slotInterval: slotDuration,
      startTime: weekday.startTime,
      endTime: weekday.endTime,
    };
    let startTime = moment(x.startTime, 'HH:mm');
    let maxTime = moment('23:50', 'HH:mm');
    let endTime = moment(x.endTime, 'HH:mm');
    let endOfShift = moment(x.startTime, 'HH:mm');
    endOfShift.add(x.slotInterval, 'minutes');
    while (startTime <= endTime && endTime <= maxTime) {
      this.slots(weekdayIndex, j).push(
        this.fb.group({
          startTime: [startTime.format('HH:mm')],
          endTime: [endOfShift.format('HH:mm')],
          numberOfAppointments: [],
          teamSlotsMaxAppointments: [],
        })
      );
      startTime.add(x.slotInterval, 'minutes');
      endOfShift.add(x.slotInterval, 'minutes');
    }
  }
}
