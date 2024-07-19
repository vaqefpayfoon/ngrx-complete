import { Component, ElementRef, Inject, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ScheduleValidators } from '../../functions/schedule-validation';

@Component({
  selector: 'neural-schedule-modal',
  templateUrl: './schedule-modal.component.html',
  styleUrls: ['./schedule-modal.component.scss']
})
export class ScheduleModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ScheduleModalComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA)
    public data: any
  ) {}

  durations: number[] = [5, 10, 15, 20, 30, 60];

  brands: string[] = [];

  @ViewChild('brandInput') brandInput: ElementRef<HTMLInputElement>;

  separatorKeysCodes: number[] = [ENTER, COMMA];

  filteredBrands: Observable<string[]>;

  myBrands: string[] = [];

  brandCtrl = new FormControl('');

  onModelChange: any = () => {};
  
  onTouch: any = () => {};

  defaultValue = 'All Brands';
  customeValidation = { validator: ScheduleValidators.MatchValidator('active', 'startTime', 'endTime', 'maxAppointments')}

  parent: FormGroup = this.fb.group({
    slotDuration: [''],
    brands: [''],
    weekdays: this.fb.array([]),
    advisors: this.fb.array([])
  })
  
  ngOnInit(): void {
    if(this.data?.teams) {
      this.parent.patchValue({slotDuration: this.data.teams.slotDuration})
      if(this.data?.teams?.brands && this.data?.teams?.brands.length) {
        this.parent.patchValue({brands: this.data.teams.brands});
        this.myBrands = [...this.data.teams.brands]
      }
      if(this.data?.teams?.weekdays && this.data?.teams?.weekdays?.length) {
        while(this.weekDays.length !== 0) {
          this.weekDays.removeAt(0);
        }
        let index = 0;
        for(const weekday of this.data?.teams?.weekdays) {
          this.weekDays.push(this.fb.group({
            active: [weekday.active],
            day: [weekday.day],
            startTime: [weekday.startTime],
            endTime: [weekday.endTime],
            maxAppointments: [weekday.maxAppointments]
          }, this.customeValidation))
          this.onActive(index);
          index+=1;
        }
      } else {
        this.weekDaysForm();
      }
      if(this.data?.teams?.advisors && this.data?.teams?.advisors?.length) {
        while(this.advisors.length !== 0) {
          this.advisors.removeAt(0);
        }
        for(const advisor of this.data?.teams?.advisors) {
          this.advisors.push(this.fb.group({
            uuid: [advisor.uuid, Validators.required],
            name: [advisor.name],
          }))
        }
      }
    }
    
    if(this.data?.brands) {
      this.brands = this.data.brands;
      this.brands = [this.defaultValue, ...this.brands]
    }
  }

  onClose(): void {
    this.dialogRef.close({
      confirm: false,
      value: null
    });
  }
  onConfirm(): void {
    if (this.myBrands && this.myBrands.length) {
      this.parent.patchValue({brands: this.myBrands})
    } else {
      this.parent.patchValue({brands: [this.defaultValue]})
    }
    this.dialogRef.close({
      confirm: true,
      value: this.parent.value
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
    const index = this.myBrands.findIndex(x => x == brand);

    if (index >= 0 && this.myBrands && this.myBrands.length) {
      this.myBrands.splice(index, 1);

      this.onTouch();
      this.onModelChange(this.myBrands);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const brands = this.myBrands ? this.myBrands : [];

    this.myBrands = [...brands, event.option.viewValue];

    this.brandInput.nativeElement.value = '';
    this.brandCtrl.setValue(null);

    this.onTouch();
    this.onModelChange(this.myBrands);
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

  get weekDays(): FormArray {
    return this.parent.get('weekdays') as FormArray;
  }

  get weekDaysItems(): AbstractControl[] {
    return (this.parent.get('weekdays') as FormArray).controls;
  }

  get advisors(): FormArray {
    return this.parent.get('advisors') as FormArray;
  }

  get advisorsItems(): AbstractControl[] {
    return (this.parent.get('advisors') as FormArray).controls;
  }

  weekDaysForm(): void {
    this.weekDays.push(
      this.fb.group({
        active: [true],
        day: ['Monday'],
        startTime: ['', Validators.required],
        endTime: ['', Validators.required],
        maxAppointments: [0, Validators.min(1)]
      }, this.customeValidation));
      this.weekDays.push(this.fb.group({
        active: [true],
        day: ['Tuesday'],
        startTime: ['', Validators.required],
        endTime: ['', Validators.required],
        maxAppointments: [0, Validators.min(1)]
      }, this.customeValidation));
      this.weekDays.push(this.fb.group({
        active: [true],
        day: ['Wednesday'],
        startTime: ['', Validators.required],
        endTime: ['', Validators.required],
        maxAppointments: [0, Validators.min(1)]
      }, this.customeValidation));
      this.weekDays.push(this.fb.group({
        active: [true],
        day: ['Thursday'],
        startTime: ['', Validators.required],
        endTime: ['', Validators.required],
        maxAppointments: [0, Validators.min(1)]
      }, this.customeValidation));
      this.weekDays.push(this.fb.group({
        active: [true],
        day: ['Friday'],
        startTime: ['', Validators.required],
        endTime: ['', Validators.required],
        maxAppointments: [0, Validators.min(1)]
      }, this.customeValidation));
      this.weekDays.push(this.fb.group({
        active: [true],
        day: ['Saturday'],
        startTime: ['', Validators.required],
        endTime: ['', Validators.required],
        maxAppointments: [0, Validators.min(1)]
      }, this.customeValidation));
      this.weekDays.push(this.fb.group({
        active: [true],
        day: ['Sunday'],
        startTime: ['', Validators.required],
        endTime: ['', Validators.required],
        maxAppointments: [0, Validators.min(1)]
      }, this.customeValidation));
  }

  activeTmp(index: number) {
    return this.weekDays.controls[index].value.active
  }

  onActive(index: number): void {
    const row = this.weekDays.controls[index].value;
    if(row?.active) {
      this.weekDays.controls[index].get('startTime').setValidators(Validators.compose([Validators.required]));
      this.weekDays.controls[index].get('endTime').setValidators(Validators.compose([Validators.required]));
      this.weekDays.controls[index].get('maxAppointments').setValidators(Validators.compose([Validators.min(1)]));
      this.weekDays.controls[index].get('startTime').updateValueAndValidity();
      this.weekDays.controls[index].get('endTime').updateValueAndValidity();
      this.weekDays.controls[index].get('maxAppointments').updateValueAndValidity();
    } else {
      this.weekDays.controls[index].get('startTime').clearValidators();
      this.weekDays.controls[index].get('startTime').updateValueAndValidity();
      this.weekDays.controls[index].get('endTime').clearValidators();
      this.weekDays.controls[index].get('endTime').updateValueAndValidity();
      this.weekDays.controls[index].get('maxAppointments').clearValidators();
      this.weekDays.controls[index].get('maxAppointments').updateValueAndValidity();
    }
  }

  addAdvisor(): void {
    const advisor = this.fb.group({
      uuid: ['', Validators.required],
      name: ['']
    });
    this.advisors.push(advisor);
  }

  removeAdvisor(index: number): void {
    this.advisors.removeAt(index);
  }

  isExist(uuid: string): boolean {
    const result = this.advisors.value?.find(x => x.uuid == uuid);
    if (result) {
      return true;
    }
    return false;
  }

}
