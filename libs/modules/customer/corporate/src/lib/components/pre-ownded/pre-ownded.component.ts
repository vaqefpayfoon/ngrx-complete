import {
  Component,
  ChangeDetectionStrategy,
  AfterViewInit,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

import {
  FormGroup,
  FormBuilder,
  FormGroupDirective,
  FormArray,
  Validators,
} from '@angular/forms';

import { ICorporates, IPreOwned, CorporateEnum } from '../../models';

// Bank JSON
import banksJson from '@nerv/banks';

import { MatSelectChange } from '@angular/material/select';
import { FormControl, AbstractControl } from '@angular/forms';
import { MaxRangeValidators } from './max-range-validation';

@Component({
  selector: 'neural-pre-ownded',
  templateUrl: './pre-ownded.component.html',
  styleUrls: [
    './pre-ownded.component.scss',
    '../corporate-configuration/corporate-configuration.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreOwndedComponent implements OnChanges, AfterViewInit {
  @Input() preOwned!: IPreOwned.IAppFeaturePreOwned;

  form!: FormGroup;

  showIntegrationSection = false;
  showLeaseGeniusSection = false;
  showAdtorqueSection = false;

  constructor(private fb: FormBuilder, private parentForm: FormGroupDirective) {
    this.form = this.initialForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.preOwned && changes.preOwned.currentValue) {
      this.form.patchValue(this.preOwned);

      // urls

      this.emptyURL();

      if (this.preOwned?.stream?.active) {
        this.showIntegrationSection = true;
      }

      if (this.preOwned?.stream?.integrationType?.leaseGenius?.active) {
        this.showLeaseGeniusSection = true;
      }

      if (this.preOwned?.stream?.integrationType?.adtorque?.active) {
        this.showAdtorqueSection = true;
      }

      if (this.preOwned?.stream?.integrationType?.adtorque?.urls) {
        for (const url of this.preOwned.stream.integrationType?.adtorque
          ?.urls) {
          this.addURL(url);
        }
      }

      // banks

      this.emptyBank();

      if (this.preOwned?.banks) {
        for (const bank of this.preOwned.banks) {
          this.addBank(bank);
        }
      }

      // Filters Prices Elements
      this.emptyFilterPriceElement();

      if (this.preOwned?.filter?.price?.elements) {
        for (const element of this.preOwned?.filter?.price?.elements) {
          this.addFilterPriceElement(element);
        }
      }

      // Filter Age Elements
      this.emptyFilterAgeElement();

      if (this.preOwned?.filter?.age?.elements) {
        for (const element of this.preOwned?.filter?.age?.elements) {
          this.addFilterAgeElement(element);
        }
      }
    }
  }

  ngAfterViewInit(): void {
    this.parentForm.form.enable();
    this.appFeatures.addControl('preOwned', this.form);
    this.parentForm.form.disable();
  }

  get configuration() {
    return this.parentForm.form.get('configuration') as FormGroup;
  }
  get appFeatures() {
    return this.configuration.get('appFeatures') as FormGroup;
  }

  private initialForm(): FormGroup {
    return this.fb.group({
      stream: this.fb.group({
        active: [false],
        integrationType: this.fb.group({
          leaseGenius: this.fb.group({
            active: [false],
            apiKey: [''],
            url: [''],
          }),
          adtorque: this.fb.group({
            username: [],
            password: [],
            source: [],
            active: [false],
            urls: this.fb.array([
              this.fb.group({
                version: [''],
                set: this.fb.group({
                  listPreOwnedVehicles: [''],
                  getAvailableFilters: [''],
                  getVehicleDetails: [''],
                  getVehicleSpecification: [''],
                }),
              }),
            ]),
          }),
        }),
      }),
      testDrive: this.fb.group({
        active: [false],
        cancelAppointment: [false],
        rescheduleAppointment: [false],
      }),
      sales: this.fb.group({
        active: [false],
      }),
      soldVehicle: this.fb.group({
        active: [false],
        displayDays: [''],
      }),
      registrationDate: this.fb.group({
        active: [false],
      }),
      finance: this.fb.group({
        active: [false],
      }),
      checkpoint: this.fb.group({
        active: [false],
      }),
      filter: this.fb.group({
        active: [false],
        price: this.fb.group({
          increment: [false],
          elements: this.fb.array([]),
        }),
        age: this.fb.group({
          active: [false],
          increment: [false],
          elements: this.fb.array([]),
        }),
        vehicleMake: this.fb.group({
          active: [false],
        }),
        vehicleModel: this.fb.group({
          active: [false],
        }),
        sortBy: this.fb.group({
          active: [false],
        }),
        quickFilter: this.fb.group({
          active: [true],
          monthlyInstallment: this.fb.group(
            {
              active: [true],
              maxRange: ['', [Validators.min(1), Validators.max(999999999999)]],
            },
            // {
            //   validator: MaxRangeValidators.MatchValidator(
            //     'active',
            //     'maxRange'
            //   ),
            // }
          ),
          bodyType: this.fb.group({
            active: [false],
          }),
          branch: this.fb.group({
            active: [false],
          }),
        }),
      }),
      banks: this.fb.array([]),
    });
  }

  private createBank(): FormGroup {
    return this.fb.group({
      name: [''],
      uuid: [''],
      logo: [''],
      interestRate: [''],
      isDefault: [false],
      downPayment: this.fb.group({
        type: [''],
        amount: [''],
      }),
      period: this.fb.group({
        min: [''],
        max: [''],
      }),
    });
  }

  private emptyBank(): void {
    while (this.banks.controls.length) {
      this.banks.removeAt(0);
    }
  }

  addBank(bank?: IPreOwned.IPreOwnedBanks): void {
    const item = this.createBank();

    if (bank) {
      item.patchValue(bank);
    }

    return this.banks.push(item);
  }
  get streamSource() {
    return IPreOwned.PreOwnedStreamSource;
  }
  removeBank(index: number): void {
    this.banks.removeAt(index);
  }

  onChangeRate(value: number, formCtrl: AbstractControl | FormControl) {
    formCtrl.patchValue(value / 100);
    formCtrl.updateValueAndValidity();
  }

  bankCompareFn(
    bank1: ICorporates.IBankScheme,
    bank2: ICorporates.IBankScheme
  ) {
    return bank1 && bank2 ? bank1.uuid === bank2.uuid : bank1 === bank2;
  }

  private createURL(): FormGroup {
    return this.fb.group({
      version: [''],
      set: this.fb.group({
        listPreOwnedVehicles: [''],
        getAvailableFilters: [''],
        getVehicleDetails: [''],
        getVehicleSpecification: [''],
      }),
    });
  }

  private emptyURL(): void {
    while (this.urls.controls.length) {
      this.urls.removeAt(0);
    }
  }

  addURL(streamUrl?: IPreOwned.IPreOwnedStreamUrls): void {
    const item = this.createURL();

    if (streamUrl) {
      item.patchValue(streamUrl);
    }

    return this.urls.push(item);
  }

  removeURL(index: number): void {
    this.urls.removeAt(index);
  }

  private createFilterElement(): FormGroup {
    return this.fb.group({
      title: [''],
      max: [''],
      min: [''],
    });
  }

  private emptyFilterPriceElement(): void {
    while (this.priceElements.controls.length) {
      this.priceElements.removeAt(0);
    }
  }

  addFilterPriceElement(streamUrl?: IPreOwned.IPreOwnedFilterElements): void {
    const item = this.createFilterElement();

    if (streamUrl) {
      item.patchValue(streamUrl);
    }

    return this.priceElements.push(item);
  }

  removeFilterPriceElement(index: number): void {
    this.priceElements.removeAt(index);
  }

  private emptyFilterAgeElement(): void {
    while (this.ageElements.controls.length) {
      this.ageElements.removeAt(0);
    }
  }

  addFilterAgeElement(streamUrl?: IPreOwned.IPreOwnedFilterElements): void {
    const item = this.createFilterElement();

    if (streamUrl) {
      item.patchValue(streamUrl);
    }

    return this.ageElements.push(item);
  }

  removeFilterAgeElement(index: number): void {
    this.ageElements.removeAt(index);
  }

  onSelect(event: MatSelectChange, index: number) {
    const { value } = event;

    const selectedBank = this.banksList.find((x) => x.uuid === value);

    const bank = this.banks.controls[index] as FormGroup;

    bank.patchValue({
      ...selectedBank,
      interestRate: selectedBank.interestRate / 100,
    });
  }

  changeAdtorqueToggle(event) {
    if (event.checked) {
      this.showAdtorqueSection = true;
      this.showLeaseGeniusSection = false;
      this.leaseGeniusActive.patchValue(false);
    } else {
      this.showAdtorqueSection = false;
    }
  }

  changeleaseGeniusToggle(event) {
    if (event.checked) {
      this.showLeaseGeniusSection = true;
      this.showAdtorqueSection = false;
      this.adtorqueActive.patchValue(false);
    } else {
      this.showLeaseGeniusSection = false;
    }
  }

  changeStreamToggle(event) {
    if (event.checked) {
      this.showIntegrationSection = true;
    } else {
      this.showIntegrationSection = false;
      this.leaseGenius.reset();
      this.adtorque.reset();
    }
  }

  typeCtrl(formGroup: FormGroup | AbstractControl | FormControl): FormControl {
    return formGroup.get('type') as FormControl;
  }

  amountCtrl(
    formGroup: FormGroup | AbstractControl | FormControl
  ): FormControl {
    return formGroup.get('amount') as FormControl;
  }

  get stream(): FormGroup {
    return this.form.get('stream') as FormGroup;
  }

  get integrationType(): FormGroup {
    return this.stream.get('integrationType') as FormGroup;
  }

  get adtorque(): FormGroup {
    return this.integrationType.get('adtorque') as FormGroup;
  }

  get leaseGenius(): FormGroup {
    return this.integrationType.get('leaseGenius') as FormGroup;
  }

  get leaseGeniusActive(): FormControl {
    return this.leaseGenius.get('active') as FormControl;
  }

  get adtorqueActive(): FormControl {
    return this.adtorque.get('active') as FormControl;
  }

  get urls(): FormArray {
    return this.adtorque.get('urls') as FormArray;
  }

  get filter(): FormGroup {
    return this.form.get('filter') as FormGroup;
  }

  get price(): FormGroup {
    return this.filter.get('price') as FormGroup;
  }

  get priceElements(): FormArray {
    return this.price.get('elements') as FormArray;
  }

  get age(): FormGroup {
    return this.filter.get('age') as FormGroup;
  }

  get ageElements(): FormArray {
    return this.age.get('elements') as FormArray;
  }

  get banks(): FormArray {
    return this.form.get('banks') as FormArray;
  }

  get formDisabled(): boolean {
    return this.form.disabled;
  }

  get soldVehicle(): FormGroup {
    return this.form.get('soldVehicle') as FormGroup;
  }

  get banksList(): ICorporates.IBankScheme[] {
    return banksJson.bankLists;
  }

  get downPaymentType() {
    return CorporateEnum.DownPaymentType;
  }
}
