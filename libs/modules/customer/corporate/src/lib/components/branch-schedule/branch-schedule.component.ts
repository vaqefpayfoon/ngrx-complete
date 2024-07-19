import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { IBranches } from '../../models';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ScheduleModalComponent } from '../schedule-modal/schedule-modal.component';
import { IAccount } from '@neural/modules/administration';

@Component({
  selector: 'neural-branch-schedule',
  templateUrl: './branch-schedule.component.html',
  styleUrls: ['./branch-schedule.component.scss'],
})
export class BranchScheduleComponent implements OnInit, OnChanges {
  @Input() permissions: any;

  @Input() parent: FormGroup;

  @Input() branch: IBranches.IDocument;

  @Input() exists: boolean;

  @Input() currencies: IBranches.IGetCountry;

  @Output() added = new EventEmitter<any>();

  @Output() selectedMethod = new EventEmitter<any>();

  @Output() removed = new EventEmitter<any>();

  @Output() cancelled = new EventEmitter<any>();

  @Output() typeEvent = new EventEmitter<string>();

  @Input() brands: string[];

  @Input() accounts: IAccount.IDocument[];

  ngOnInit(): void {
    if (this.branch.schedules && this.branch.schedules.length) {
      for (const value of this.branch.schedules) {
        let teamsCntl = [];
        for (const team of value.teams) {
          let weekdays = [];
          let advisors = [];
          if (team?.weekdays && team?.weekdays.length) {
            for(const weekDay of team?.weekdays) {
              weekdays.push(this.fb.group({
                active: [weekDay.active],
                day: [weekDay.day],
                startTime: [weekDay.startTime],
                endTime: [weekDay.endTime],
                maxAppointments: [weekDay.maxAppointments]
              }))
            }
          }
          if (team?.advisors && team?.advisors.length) {
            for(const advisor of team?.advisors) {
              advisors.push(this.fb.group({
                uuid: [advisor.uuid],
                name: [advisor.name],
              }))
            } 
          }
          teamsCntl.push(
            this.fb.group({
              name: [team.name, Validators.required],
              slotDuration: [team.slotDuration],
              bookingLeadTime:[team.bookingLeadTime],
              brands: [team.brands],
              weekdays: this.fb.array(weekdays),
              advisors: this.fb.array(advisors),
            })
          );
        }
        const schedule = this.fb.group({
          name: [value.name, Validators.required],
          type: [value.type, Validators.required],
          weeks: this.fb.group({
            teams: this.fb.array(teamsCntl),
          }),
        });
        this.schedules.push(schedule);
      }
    }
  }

  constructor(private fb: FormBuilder, public dialog: MatDialog) {}

  ngOnChanges(changes: SimpleChanges): void {

  }

  addSchedule(): void {
    const schedule = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      weeks: this.fb.group({
        teams: this.fb.array([
          this.fb.group({
            name: ['', Validators.required],
            slotDuration: [''],
            bookingLeadTime:[''],
            brands: [''],
            weekdays: this.fb.array([]),
            advisors: this.fb.array([]),
          }),
        ]),
      }),
    });

    this.schedules.push(schedule);
  }

  addTeam(index: number): void {
    const team = this.fb.group({
      name: ['', Validators.required],
      slotDuration: [''],
      bookingLeadTime: [''],
      brands: [],
      weekdays: this.fb.array([]),
      advisors: this.fb.array([]),
    });
    this.teams(index).push(team);
  }

  get formDisabled() {
    return this.parent.disabled;
  }

  removeSchedule(index: number) {
    this.schedules.removeAt(index);
  }

  onCancel() {
    this.cancelled.emit();
  }

  get schedules(): FormArray {
    return this.parent.get('schedules') as FormArray;
  }

  get schedulesItems(): AbstractControl[] {
    return (this.parent.get('schedules') as FormArray).controls;
  }

  teams(i: number): FormArray {
    return this.weeks(i).get('teams') as FormArray;
  }

  teamsItem(i: number): AbstractControl[] {
    return (this.weeks(i).get('teams') as FormArray).controls;
  }

  weeks(index: number): FormControl {
    return this.schedules.controls[index].get('weeks') as FormControl;
  }
  
  weekDays(i: number, j: number) {
    return this.teams(i).controls[j].get('weekdays') as FormArray;
  }

  advisors(i: number, j: number) {
    return this.teams(i).controls[j].get('advisors') as FormArray;
  }

  get ScheduleType() {
    return IBranches.SchedulesType;
  }

  removeTeam(i: number, j: number): void {
    this.teams(i).removeAt(j);
  }

  onSelectionChange(value: string): void {
    const result = value == 'SALES' ? 'SALES_ADVISOR' : 'SERVICE_ADVISOR';
    // this.typeEvent.emit(result);
  }

  onDetails(i: number, j: number): void {
    const result = this.schedules.controls[i].value;
    if(result) {
      const typeData = result.type == 'SALES' ? 'SALES_ADVISOR' : 'SERVICE_ADVISOR';
      const data = { teams: this.teamsItem(i)[j].value, brands: this.brands, accounts: this.accounts.filter(x => x.permissions.operationRole == typeData)};
      this.dialog
        .open(ScheduleModalComponent, {
          width: '850px',
          data,
        })
        .afterClosed()
        .subscribe((result) => {
          if (result?.confirm) {
            while(this.weekDays(i, j).length !== 0) {
              this.weekDays(i, j).removeAt(0);
            }
            while(this.advisors(i, j).length !== 0) {
              this.advisors(i, j).removeAt(0);
            }
            for(const weekDay of result?.value?.weekdays) {
              this.weekDays(i, j).push(this.fb.group({
                active: [weekDay.active],
                day: [weekDay.day],
                startTime: [weekDay.startTime],
                endTime: [weekDay.endTime],
                maxAppointments: [weekDay.maxAppointments]
              }))
            }
            for(const advisor of result?.value?.advisors) {
              this.advisors(i, j).push(this.fb.group({
                uuid: [advisor.uuid],
                name: [advisor.name]
              }))
            }
            this.teamsItem(i)[j].patchValue({
              slotDuration: result.value.slotDuration,
              brands: result.value?.brands
            });
          } else {
          }
          this.parent.patchValue({schedules: this.schedules.value})
        });
    }
  }
  
}
