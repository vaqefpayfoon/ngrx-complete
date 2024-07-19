import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
  ElementRef,
  ViewChild,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';

// Angular forms
import {
  FormGroup,
  FormArray,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';

// Models
import { IBranches, ICorporates, CorporateEnum } from '../../models';

// permission tags
import { permissionTags } from '@neural/shared/data';

// Mat Select
import { MatSelectChange, MatSelect } from '@angular/material/select';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

// RxJS
import {
  map,
  filter,
  delay,
  distinctUntilChanged,
  switchMap,
} from 'rxjs/operators';
import { fromEvent, of, Subscription } from 'rxjs';

import { FulfillmentFileEditorComponent } from '../fulfillment-file-editor/fulfillment-file-editor.component';
import { MatDialog } from '@angular/material/dialog';

// Check status of mat toglge
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

// Bank JSON
import banksJson from '@nerv/banks';
import { Auth } from '@neural/auth';
import {
  addRequiredValidation,
  removeRequiredValidation,
} from '../../functions';

@Component({
  selector: 'neural-corporate-configuration',
  templateUrl: './corporate-configuration.component.html',
  styleUrls: [
    '../corporate-form/corporate-form.component.scss',
    './corporate-configuration.component.scss',
    '../corporate-form/corporate-form.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CorporateConfigurationComponent
  implements OnChanges, AfterViewInit, OnDestroy {
  @Input() parent: FormGroup;

  @Input() countries: any[] = [];

  @Input() isSuperAdmin: boolean;

  @Input() corporate: ICorporates.IDocument;

  @Input() corporateBranches: IBranches.IDocument[];

  @Input() permissions: any;

  @Input() appImages: {
    [file: string]: string;
  };

  @Input() watermarkImage: string;

  @Input() operations: Auth.IAccount[];

  @Output() addedVehicleCoverage = new EventEmitter<any>();
  @Output() removedVehicleCoverage = new EventEmitter<any>();

  @Output() addedModule = new EventEmitter<any>();
  @Output() removedModule = new EventEmitter<any>();

  @Output() addedModuleOption = new EventEmitter<{
    value: string;
    index: number;
  }>();

  @Output() action = new EventEmitter<string>();
  @Output() actionModule = new EventEmitter<string>();

  @Output() added = new EventEmitter<any>();
  @Output() removed = new EventEmitter<{
    index: number;
    j: number;
  }>();
  @Output() created = new EventEmitter<boolean>();
  @Output() updated = new EventEmitter<boolean>();
  @Output() countryChange = new EventEmitter<string>();

  @Output() addBranchSchema = new EventEmitter();
  @Output() removedBranchSchema = new EventEmitter<any>();

  @Output() addCalendarService = new EventEmitter();
  @Output() removedCalendarService = new EventEmitter<any>();

  @Output() addListItem = new EventEmitter<any>();
  @Output() removeListItem = new EventEmitter<any>();
  @Output() uploadFeatureImage = new EventEmitter<{
    key: string;
    file: File;
  }>();
  @Output() uploadWatermarkImage = new EventEmitter<{
    file: File;
  }>();

  @Output() addNewBank = new EventEmitter();
  @Output() removedNewBank = new EventEmitter<number>();

  @Output() addUsedBank = new EventEmitter();
  @Output() removedUsedBank = new EventEmitter<number>();

  @Output() addWidget = new EventEmitter();
  @Output() removedWidget = new EventEmitter<number>();

  @Output() addVehicleWidget = new EventEmitter();
  @Output() removedVehicleWidget = new EventEmitter<number>();

  @Output() addWebHookVersion = new EventEmitter();
  @Output() removeWebHookVersion = new EventEmitter<number>();

  @Output() addKeyValue = new EventEmitter();
  @Output() removeKeyValue = new EventEmitter<number>();

  divisions: any[] = [];
  topics: any[] = [];
  salutations: any[] = [];
  ncdEntitlements: any[] = [];
  sources: any[] = [];
  names: any[] = [];
  includedTypes: any[] = [];

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  showEnhanceAddVehicle = false;

  types = ICorporates.TradeInFormType;

  listNames = ICorporates.VehicleDetailsList;

  subscription: Subscription;
  showExclusionList = false;
  showInvoiceAutoDispatch = false;
  showWhatsApp = false;

  @ViewChild('input', { static: true }) input: ElementRef;

  @ViewChild('countrySelection', { static: true }) mySelector: MatSelect;

  constructor(private dialog: MatDialog, private cd: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes.corporate &&
      changes.corporate.currentValue &&
      this.corporate &&
      this.corporate.uuid
    ) {
      for (const key in this.corporate?.configuration?.appFeatures?.home
        ?.helpCenter.enquiry?.divisions) {
        if (key) {
          this.divisions.push(
            this.corporate.configuration.appFeatures.home.helpCenter.enquiry
              .divisions[key]
          );
        }
      }

      for (const key in this.corporate?.configuration?.appFeatures?.home
        ?.helpCenter?.enquiry?.topics) {
        if (key) {
          this.topics.push(
            this.corporate.configuration.appFeatures.home.helpCenter.enquiry
              .topics[key]
          );
        }
      }

      for (const key in this.corporate.configuration.appFeatures.account
        .salutations) {
        if (key) {
          this.salutations.push(
            this.corporate.configuration.appFeatures.account.salutations[key]
          );
        }
      }

      for (const key in this.corporate?.configuration?.appFeatures?.home
        ?.insuranceEnquiry?.ncdEntitlement) {
        if (key) {
          this.ncdEntitlements.push(
            this.corporate?.configuration?.appFeatures?.home?.insuranceEnquiry
              ?.ncdEntitlement[key]
          );
        }
      }

      if (
        this.corporate.configuration.appFeatures.vehicle.profile.vehicleDetails
          .tradeIn &&
        this.corporate.configuration.appFeatures.vehicle.profile.vehicleDetails
          .tradeIn.sources
      ) {
        for (const key in this.corporate.configuration.appFeatures.vehicle
          .profile.vehicleDetails.tradeIn.sources) {
          if (key) {
            this.sources.push(
              this.corporate.configuration.appFeatures.vehicle.profile
                .vehicleDetails.tradeIn.sources[key]
            );
          }
        }
      }

      if (
        this.corporate.configuration.appFeatures.vehicle.profile.vehicleDetails
          .insurance &&
        this.corporate.configuration.appFeatures.vehicle.profile.vehicleDetails
          .insurance.names
      ) {
        for (const key in this.corporate.configuration.appFeatures.vehicle
          .profile.vehicleDetails.insurance.names) {
          if (key) {
            this.names.push(
              this.corporate.configuration.appFeatures.vehicle.profile
                .vehicleDetails.insurance.names[key]
            );
          }
        }
      }

      if (!!this.corporate.configuration.calendar?.services) {
        this.corporate.configuration.calendar?.services.map((_, index) =>
          this.includedTypes.push(
            this.corporate.configuration.calendar?.services[index]
              ?.includedTypes ?? []
          )
        );
      }

      if (
        this.corporate?.configuration?.appFeatures?.home?.helpCenter?.whatsApp
          ?.active
      ) {
        this._whatsAppFormValidation(
          this.corporate?.configuration?.appFeatures?.home?.helpCenter?.whatsApp
            ?.active
        );
      }
    }

    if (
      this.corporate.configuration?.appFeatures?.vehicle?.register
        ?.enhanceAddVehicle?.active
    ) {
      this.showEnhanceAddVehicle = true;
    } else {
      this.showEnhanceAddVehicle = false;
    }

    if (
      this.corporate.configuration?.appFeatures?.service?.digitalInvoice
        ?.autoDispatch?.active
    ) {
      this.showExclusionList = true;
    } else {
      this.showExclusionList = false;
    }

    if (
      this.corporate.configuration?.appFeatures?.service?.digitalInvoice?.active
    ) {
      this.showInvoiceAutoDispatch = true;
    } else {
      this.showInvoiceAutoDispatch = false;
    }

    if (
      this.corporate.configuration?.appFeatures?.account?.authentication
        ?.whatsapp?.active
    ) {
      this.showWhatsApp = true;

      this.showWhatsApp = true;
      this.changeRequiredValidation(true, this.whatsapp);
    } else {
      this.showWhatsApp = false;
      this.changeRequiredValidation(false, this.whatsapp);
      this.whatsapp.reset();
      this.whatsapp.get('active').setValue(false);
    }

    this.parent.markAsDirty();
    this.parent.markAllAsTouched();

    if (changes.appImages && changes.appImages.currentValue && this.corporate) {
      for (const [_, value] of Object.entries(this.appImages)) {
        if (value) {
          this.cd.detectChanges();
        }
      }
    }

    if (
      changes.watermarkImage &&
      changes.watermarkImage.currentValue &&
      this.corporate
    ) {
      this.image.patchValue(this.watermarkImage);
    }
  }

  ngAfterViewInit() {
    this.subscription = fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        map((event: any) => {
          const input = event.target as HTMLTextAreaElement;
          return input.value;
        }),
        filter((value) => value.length >= 2),
        switchMap((search) => of(search).pipe(delay(500))),
        distinctUntilChanged()
      )
      .subscribe((value) => {
        this.countryChange.emit(value);

        this.mySelector.open();
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onChangeEnhanceAddVehicle(e: MatSlideToggleChange) {
    if (e.checked) {
      this.showEnhanceAddVehicle = true;
      this.numberPlateMandatory.disable();
      this.brandMandatory.disable();
      this.modelMandatory.disable();
      this.registrationCardMandatory.disable();
      this.documentTypeAndIdMandatory.disable();
      this.identificationCardMandatory.disable();
      this.additionalDocumentMandatory.disable();
      this.identificationNumberMandatory.disable();
    } else {
      this.showEnhanceAddVehicle = false;
      this.numberPlateMandatory.reset();
      this.brandActive.reset();
      this.brandMandatory.reset();
      this.modelMandatory.reset();
      this.modelActive.reset();
      this.registrationCardMandatory.reset();
      this.documentTypeAndIdMandatory.reset();
      this.identificationCardMandatory.reset();
      this.additionalDocumentMandatory.reset();
      this.identificationNumberMandatory.reset();
      this.numberPlateActive.reset();
      this.registrationCardActive.reset();
      this.documentTypeAndIdActive.reset();
      this.identificationCardActive.reset();
      this.additionalDocumentActive.reset();
      this.identificationNumberActive.reset();
    }
  }

  onChangeNumberPlateActive(e: MatSlideToggleChange) {
    if (!e.checked) {
      this.numberPlateMandatory.setValue(false);
      this.numberPlateMandatory.disable();
    } else {
      this.numberPlateMandatory.enable();
    }
  }

  onChangeBrandActive(e) {
    if (!e.checked) {
      this.brandMandatory.setValue(false);
      this.brandMandatory.disable();
    } else {
      this.brandMandatory.enable();
    }
  }

  onChangeModelActive(e) {
    if (!e.checked) {
      this.modelMandatory.setValue(false);
      this.modelMandatory.disable();
    } else {
      this.modelMandatory.enable();
    }
  }

  onChangeIdentificationNoActive(e: MatSlideToggleChange) {
    if (!e.checked) {
      this.identificationNumberMandatory.setValue(false);
      this.identificationNumberMandatory.disable();
    } else {
      this.identificationNumberMandatory.enable();
    }
  }

  onChangeDocumentTypeAndIdActive(e: MatSlideToggleChange) {
    if (!e.checked) {
      this.documentTypeAndIdMandatory.setValue(false);
      this.documentTypeAndIdMandatory.disable();
    } else {
      this.documentTypeAndIdMandatory.enable();
    }
  }

  onChangeIdentificationCardActive(e: MatSlideToggleChange) {
    if (!e.checked) {
      this.identificationCardMandatory.setValue(false);
      this.identificationCardMandatory.disable();
    } else {
      this.identificationCardMandatory.enable();
    }
  }

  onChangeRegistrationCardActive(e: MatSlideToggleChange) {
    if (!e.checked) {
      this.registrationCardMandatory.setValue(false);
      this.registrationCardMandatory.disable();
    } else {
      this.registrationCardMandatory.enable();
    }
  }

  onChangeAdditionalDocumentActive(e: MatSlideToggleChange) {
    if (!e.checked) {
      this.additionalDocumentMandatory.setValue(false);
      this.additionalDocumentMandatory.disable();
    } else {
      this.additionalDocumentMandatory.enable();
    }
  }

  onChangeInvoiceRetrieval(event) {
    if (event.checked) {
      this.showInvoiceAutoDispatch = true;
    } else {
      this.autoDispatchActive.setValue(false);
      this.autoDispatchExclusion.setValue('');
      this.showInvoiceAutoDispatch = false;
    }
  }

  onChangeWhatsappActive(event) {
    const value = event.checked;

    if (event.checked) {
      this.showWhatsApp = true;
      this.changeRequiredValidation(value, this.whatsapp);
    } else {
      this.showWhatsApp = false;
      this.changeRequiredValidation(value, this.whatsapp);
      this.whatsapp.reset();
      this.whatsapp.get('active').setValue(false);
    }
  }

  private async changeRequiredValidation(
    checked: boolean,
    form
  ): Promise<void> {
    checked
      ? await addRequiredValidation(form)
      : await removeRequiredValidation(form);
  }

  onChangeLeadToggle(e: MatSlideToggleChange, key: string) {
    if (!e.checked) {
      switch (key) {
        case 'lead':
          this.salesLeadActive.patchValue(false);
          this.questionnaireActive.patchValue(false);
          break;
        case 'salesLead':
          this.questionnaireActive.patchValue(false);
          break;

        default:
          break;
      }
    }
  }

  onChangeNextServiceBookingToggle(e: MatSlideToggleChange) {
    if (!e.checked) {
      this.cdkExistingCustomer.patchValue(false);
      this.cdkExistingCustomer.disable({ onlySelf: true });
      this.nextServiceBookingGeneral.patchValue(false);
      this.nextServiceBookingGeneral.disable({ onlySelf: true });
      this.cdkNewCustomer.patchValue(false);
      this.cdkNewCustomer.disable({ onlySelf: true });
      this.customerApp.patchValue(false);
      this.customerApp.disable({ onlySelf: true });
    } else {
      this.cdkExistingCustomer.enable({ onlySelf: true });
      this.nextServiceBookingGeneral.enable({ onlySelf: true });
      this.cdkNewCustomer.enable({ onlySelf: true });
      this.customerApp.enable({ onlySelf: true });
    }
  }

  get appFeatureImages() {
    return ICorporates.AppFeatureImages;
  }

  get calendarType() {
    return ICorporates.CalendarType;
  }

  get subscriptionModulesType() {
    return ICorporates.SubscriptionModules;
  }

  get appFeatureTestDriveLoanTypes() {
    return ICorporates.AppFeatureTestDriveLoanTypes;
  }

  get insuranceFormType() {
    return ICorporates.InsuranceFormType;
  }

  get tradeInFormType() {
    return ICorporates.TradeInFormType;
  }

  add(event: MatChipInputEvent): void {
    const { value, input } = event;

    // Add our divisions
    if ((value || '').trim()) {
      this.divisions.push(value.trim());
      this.divisionsControl(this.divisions);
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(division: string): void {
    const index = this.divisions.indexOf(division);

    if (index >= 0) {
      this.divisions.splice(index, 1);

      this.divisionsControl(this.divisions);
    }
  }

  addTopic(event: MatChipInputEvent): void {
    const { value, input } = event;

    // Add our topic
    if ((value || '').trim()) {
      this.topics.push(value.trim());
      this.topicsControl(this.topics);
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeTopic(topic: string): void {
    const index = this.topics.indexOf(topic);

    if (index >= 0) {
      this.topics.splice(index, 1);

      this.topicsControl(this.topics);
    }
  }

  addSalutation(event: MatChipInputEvent): void {
    const { value, input } = event;

    // Add our divisions
    if ((value || '').trim()) {
      this.salutations.push(value.trim().toUpperCase());
      this.salutationControl(this.salutations);

      this.parent.markAllAsTouched();
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeSalutation(salutation: string): void {
    const index = this.salutations.indexOf(salutation);

    if (index >= 0) {
      this.salutations.splice(index, 1);

      this.salutationControl(this.salutations);

      this.parent.markAllAsTouched();
    }
  }

  removeNcdEntitlement(salutation: string): void {
    const index = this.ncdEntitlements.indexOf(salutation);

    if (index >= 0) {
      this.ncdEntitlements.splice(index, 1);

      this.ncdEntitlementControl(this.ncdEntitlements);

      this.parent.markAllAsTouched();
    }
  }

  addNcdEntitlement(event: MatChipInputEvent): void {
    const { value, input } = event;

    // Add our divisions
    if ((value || '').trim()) {
      this.ncdEntitlements.push(value.trim());
      this.ncdEntitlementControl(this.ncdEntitlements);

      this.parent.markAllAsTouched();
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  addSource(event: MatChipInputEvent): void {
    const { value, input } = event;

    // Add our divisions
    if ((value || '').trim()) {
      this.sources.push(value.trim());
      this.sourceControl(this.sources);
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeSource(source: string): void {
    const index = this.sources.indexOf(source);

    if (index >= 0) {
      this.sources.splice(index, 1);

      this.sourceControl(this.sources);
    }
  }

  addName(event: MatChipInputEvent): void {
    const { value, input } = event;

    // Add our divisions
    if ((value || '').trim()) {
      this.names.push(value.trim());
      this.nameControl(this.names);
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeName(name: string): void {
    const index = this.names.indexOf(name);

    if (index >= 0) {
      this.names.splice(index, 1);

      this.nameControl(this.names);
    }
  }

  onAdd(index: number) {
    if (index !== -1) {
      const service = ((this.modules.controls[index] as FormGroup).get(
        'options'
      ) as FormGroup).get('services') as FormArray;

      if (
        service.controls.length !== -1 &&
        Object.keys(ICorporates.CalendarType).length !== service.controls.length
      ) {
        this.added.emit(index);
      }
    }
  }

  onRemove(index: number, j: number) {
    if (index !== -1) {
      const service = ((this.modules.controls[index] as FormGroup).get(
        'options'
      ) as FormGroup).get('services') as FormArray;

      if (service.controls.length !== -1) {
        this.removed.emit({ index, j });
      }
    }
  }

  onAddWebHookVerion() {
    this.addWebHookVersion.emit();
  }

  onRemoveWebHookVerion(index: number) {
    if (this.versions.controls.length !== -1) {
      this.removeWebHookVersion.emit(index);
    }
  }

  onAddKeyValue() {
    this.addKeyValue.emit();
  }

  onRemoveKeyValue(index: number) {
    if (this.accountProfileDocumentTypes.controls.length !== -1) {
      this.removeKeyValue.emit(index);
    }
  }

  onAddModule() {
    if (
      Object.keys(ICorporates.SubscriptionModules).length !==
      this.modules.controls.length
    ) {
      this.addedModule.emit();
    }
  }

  onAddModuleServicesOption() {
    // this.addedModule.emit();
  }

  onRemoveModule(index: number) {
    if (this.modules.controls.length !== -1) {
      this.removedModule.emit(index);
    }
  }

  onAddSchemaBranch() {
    this.addBranchSchema.emit();
  }

  onRemoveSchemaBranch(index: number) {
    if (this.branches.controls.length !== -1) {
      this.removedBranchSchema.emit(index);
    }
  }

  onAddCalendarService() {
    this.addCalendarService.emit();
  }

  onRemoveCalendarService(index: number) {
    if (this.calendarServices.controls.length !== -1) {
      this.removedCalendarService.emit(index);
    }
  }

  addIncludedTypes(index: number, event: MatChipInputEvent): void {
    const { value, input } = event;

    // Add our includedTypes
    if ((value || '').trim()) {
      const arrayIndex = this.includedTypes.findIndex((_, i) => i === index);

      if (arrayIndex !== -1) {
        this.includedTypes[index] = [
          ...this.includedTypes[index],
          value.trim(),
        ];

        this.includedTypesControl(index, this.includedTypes[index]);
      } else {
        this.includedTypes.push([value.trim()]);
        this.includedTypesControl(index, [value.trim()]);
      }
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeIncludedTypes(index: number, type: string): void {
    if (!!this.includedTypes[index]) {
      const i = this.includedTypes[index].indexOf(type);

      if (i >= 0) {
        this.includedTypes[index].splice(i, 1);

        this.includedTypesControl(index, this.includedTypes[index]);
      }
    }
  }

  private includedTypesControl(index: number, array: string[]) {
    const services = (this.calendar.get('services') as FormArray).controls;

    const includedTypes = <FormControl>services[index].get('includedTypes');

    includedTypes.patchValue([...array]);
  }

  onAddVehicleCoverage() {
    this.addedVehicleCoverage.emit();
  }

  onRemoveVehicleCoverage(index: number) {
    if (this.coverages.length !== 1) {
      this.removedVehicleCoverage.emit(index);
    }
  }

  onSave(form: FormGroup) {
    // Check it've saved
    if (this.corporate && this.corporate.uuid) {
      // create new people In Charges
      if (form.valid) {
        this.updated.emit(form.valid);
      }
    } else {
      // Update new people In Charges
      if (form.valid) {
        this.created.emit(form.valid);
      }
    }
  }

  onChangeAutoDispatch(event) {
    if (event.checked) {
      this.showExclusionList = true;
    } else {
      this.showExclusionList = false;
      this.autoDispatchExclusion.setValue('');
    }
  }

  onAddItem() {
    this.addListItem.emit();
  }

  onRemoveItem(index: number) {
    this.removeListItem.emit(index);
  }

  dropListItem(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.list, event.previousIndex, event.currentIndex);

    this.list.map((_, i) => this.list[i].get('order').patchValue(++i));
  }

  disableSelected(name: string) {
    return this.list.some((item) => item.value.name === name);
  }

  onChangeDRO(event) {
    const value = event.checked;
    if (!value) {
      this.reservationApproval.patchValue(false);
      this.manualReservationApprovalActive.patchValue(false);
      this.retrievalActive.patchValue(false);
      this.rejectionReason.patchValue(false);
      this.autoRoRetrieval.patchValue(false);
      this.termsAndConditionActive.patchValue(false);
      this.disclaimerActive.patchValue(false);
    }
  }

  onChangeTC(event) {
    const value = event.checked;
    if (value) {
      this.termsAndConditionLink.setValidators(
        Validators.compose([Validators.required])
      );
    } else {
      this.termsAndConditionLink.clearValidators();
    }
  }

  onChangeServiceRecommendations(event) {
    const value = event.checked;
    if (!value) {
      this.serviceLinesActive.patchValue(false);
      this.servicePackagesActive.patchValue(false);
    }
  }

  get configuration() {
    return this.parent.get('configuration') as FormGroup;
  }

  get service(): FormGroup {
    return this.appFeatures.get('service') as FormGroup;
  }

  get serviceRecommendation(): FormGroup {
    return this.service.get('serviceRecommendation') as FormGroup;
  }

  get serviceRecommendationActive(): FormControl {
    return this.serviceRecommendation.get('active') as FormControl;
  }

  get serviceLines(): FormGroup {
    return this.serviceRecommendation.get('serviceLines') as FormGroup;
  }

  get serviceLinesActive(): FormControl {
    return this.serviceLines.get('active') as FormControl;
  }

  get servicePackages(): FormGroup {
    return this.serviceRecommendation.get('servicePackages') as FormGroup;
  }

  get servicePackagesActive(): FormControl {
    return this.servicePackages.get('active') as FormControl;
  }

  get digitalRepairOrder(): FormGroup {
    return this.service.get('digitalRepairOrder') as FormGroup;
  }

  get digitalRepairOrderActive(): FormControl {
    return this.digitalRepairOrder.get('active') as FormControl;
  }

  get reservationApproval(): FormControl {
    return this.digitalRepairOrder.get('reservationApproval') as FormControl;
  }

  get manualReservationApproval(): FormGroup {
    return this.digitalRepairOrder.get(
      'manualReservationApproval'
    ) as FormGroup;
  }

  get retrieval(): FormGroup {
    return this.digitalRepairOrder.get('retrieval') as FormGroup;
  }

  get digitalInvoice(): FormGroup {
    return this.service.get('digitalInvoice') as FormGroup;
  }

  get autoDispatch(): FormGroup {
    return this.digitalInvoice.get('autoDispatch') as FormGroup;
  }

  get autoDispatchActive(): FormControl {
    return this.autoDispatch.get('active') as FormControl;
  }

  get autoDispatchExclusion(): FormControl {
    return this.autoDispatch.get('exclusionList') as FormControl;
  }

  get retrievalActive(): FormControl {
    return this.retrieval.get('active') as FormControl;
  }

  get termsAndCondition(): FormGroup {
    return this.digitalRepairOrder.get('termsAndCondition') as FormGroup;
  }

  get termsAndConditionActive(): FormControl {
    return this.termsAndCondition.get('active') as FormControl;
  }

  get termsAndConditionLink(): FormControl {
    return this.termsAndCondition.get('link') as FormControl;
  }

  get disclaimer(): FormGroup {
    return this.digitalRepairOrder.get('disclaimer') as FormGroup;
  }

  get disclaimerActive(): FormControl {
    return this.disclaimer.get('active') as FormControl;
  }

  get manualReservationApprovalActive(): FormControl {
    return this.manualReservationApproval.get('active') as FormControl;
  }

  get rejectionReason(): FormControl {
    return this.digitalRepairOrder.get('rejectionReason') as FormControl;
  }

  get autoRoRetrieval(): FormControl {
    return this.digitalRepairOrder.get('autoRoRetrieval') as FormControl;
  }

  get calendar() {
    return this.configuration.get('calendar') as FormGroup;
  }
  get reminder() {
    return this.configuration.get('reminder') as FormGroup;
  }
  get schema() {
    return this.calendar.get('schema') as FormGroup;
  }

  get calendarServices() {
    return this.calendar.get('services') as FormArray;
  }

  get branches() {
    return this.schema.get('branches') as FormArray;
  }

  get branchesControls() {
    return (this.schema.get('branches') as FormArray).controls;
  }

  get synchronization() {
    return this.configuration.get('synchronization') as FormGroup;
  }

  get reservation() {
    return this.configuration.get('reservation') as FormGroup;
  }

  get repairOrder() {
    return this.reservation.get('repairOrder') as FormGroup;
  }

  get invoice() {
    return this.reservation.get('invoice') as FormGroup;
  }

  get accountSync() {
    return this.synchronization.get('account') as FormGroup;
  }

  get services() {
    return this.configuration.get('services') as FormGroup;
  }

  get reports() {
    return this.configuration.get('reports') as FormGroup;
  }

  get appFeatures() {
    return this.configuration.get('appFeatures') as FormGroup;
  }

  get vehicle() {
    return this.appFeatures.get('vehicle') as FormGroup;
  }

  get register() {
    return this.vehicle.get('register') as FormGroup;
  }

  get enhanceAddVehicle() {
    return this.register.get('enhanceAddVehicle') as FormGroup;
  }

  get enhanceAddVehicleActive() {
    return this.enhanceAddVehicle.get('active') as FormControl;
  }

  get numberPlate() {
    return this.enhanceAddVehicle.get('numberPlate') as FormGroup;
  }

  get numberPlateActive() {
    return this.numberPlate.get('active') as FormControl;
  }

  get numberPlateMandatory() {
    return this.numberPlate.get('mandatory') as FormControl;
  }

  get identificationNumber() {
    return this.enhanceAddVehicle.get('identificationNumber') as FormGroup;
  }

  get identificationNumberActive() {
    return this.identificationNumber.get('active') as FormControl;
  }

  get identificationNumberMandatory() {
    return this.identificationNumber.get('mandatory') as FormControl;
  }

  get brand() {
    return this.enhanceAddVehicle.get('brand') as FormGroup;
  }

  get brandActive() {
    return this.brand.get('active') as FormControl;
  }

  get brandMandatory() {
    return this.brand.get('mandatory') as FormControl;
  }

  get model() {
    return this.enhanceAddVehicle.get('model') as FormGroup;
  }

  get modelActive() {
    return this.model.get('active') as FormControl;
  }

  get modelMandatory() {
    return this.model.get('mandatory') as FormControl;
  }

  get documentTypeAndId() {
    return this.enhanceAddVehicle.get('documentTypeAndId') as FormGroup;
  }

  get documentTypeAndIdActive() {
    return this.documentTypeAndId.get('active') as FormControl;
  }

  get documentTypeAndIdMandatory() {
    return this.documentTypeAndId.get('mandatory') as FormControl;
  }

  get identificationCard() {
    return this.enhanceAddVehicle.get('identificationCard') as FormGroup;
  }

  get identificationCardActive() {
    return this.identificationCard.get('active') as FormControl;
  }

  get identificationCardMandatory() {
    return this.identificationCard.get('mandatory') as FormControl;
  }

  get registrationCard() {
    return this.enhanceAddVehicle.get('registrationCard') as FormGroup;
  }

  get registrationCardActive() {
    return this.registrationCard.get('active') as FormControl;
  }

  get registrationCardMandatory() {
    return this.registrationCard.get('mandatory') as FormControl;
  }

  get additionalDocument() {
    return this.enhanceAddVehicle.get('additionalDocument') as FormGroup;
  }

  get additionalDocumentActive() {
    return this.additionalDocument.get('active') as FormControl;
  }

  get additionalDocumentMandatory() {
    return this.additionalDocument.get('mandatory') as FormControl;
  }

  get pendo() {
    return this.configuration.get('pendo') as FormGroup;
  }

  get postServiceInspection() {
    return this.appFeatures.get('postServiceInspection') as FormGroup;
  }

  get salesforce() {
    return this.configuration.get('salesforce') as FormGroup;
  }

  get fortellis() {
    return this.configuration.get('fortellis') as FormGroup;
  }

  get webHook() {
    return this.salesforce.get('webHook') as FormGroup;
  }

  get versions() {
    return this.webHook.get('versions') as FormArray;
  }

  get account() {
    return this.appFeatures.get('account') as FormGroup;
  }

  get accountProfile() {
    return this.account.get('profile') as FormGroup;
  }

  get accountProfileDocument() {
    return this.accountProfile.get('document') as FormGroup;
  }

  get accountProfileDocumentTypes() {
    return this.accountProfileDocument.get('types') as FormArray;
  }

  get salutation() {
    return this.account.get('salutations') as FormControl;
  }

  get authentication() {
    return this.account.get('authentication') as FormGroup;
  }

  get social() {
    return this.authentication.get('social') as FormGroup;
  }

  get whatsapp() {
    return this.authentication.get('whatsapp') as FormGroup;
  }

  get custom() {
    return this.authentication.get('custom') as FormGroup;
  }

  get home() {
    return this.appFeatures.get('home') as FormGroup;
  }

  get helpCenter() {
    return this.home.get('helpCenter') as FormGroup;
  }

  get insuranceEnquiry() {
    return this.home.get('insuranceEnquiry') as FormGroup;
  }

  get profile() {
    return this.vehicle.get('profile') as FormGroup;
  }

  get vehicleDetails() {
    return this.profile.get('vehicleDetails') as FormGroup;
  }

  get list() {
    return (this.vehicleDetails.get('list') as FormArray).controls;
  }

  get serviceCenters() {
    return (this.services.get('serviceCenter') as FormArray).controls;
  }

  get subscriptions() {
    return this.configuration.get('subscriptions') as FormGroup;
  }

  get locale() {
    return this.configuration.get('locale') as FormGroup;
  }

  get plan() {
    return this.subscriptions.get('plan') as FormGroup;
  }

  get period() {
    return this.plan.get('period') as FormGroup;
  }

  get cost() {
    return this.plan.get('cost') as FormGroup;
  }

  get modules() {
    return this.subscriptions.get('modules') as FormArray;
  }

  get vehicles() {
    return this.configuration.get('vehicles') as FormGroup;
  }

  get coverage() {
    return this.vehicles.get('coverages') as FormArray;
  }

  get coverages() {
    return (this.vehicles.get('coverages') as FormArray).controls;
  }

  get calendarTypeW() {
    return ICorporates.CalendarTypeW;
  }

  get images() {
    return this.appFeatures.get('images') as FormGroup;
  }

  get widgets(): FormArray {
    return this.appFeatures.get('widgets') as FormArray;
  }

  get vehicleWidgets(): FormArray {
    return this.vehicle.get('widgets') as FormArray;
  }

  get vehicleWidgetsTypes() {
    return ICorporates.IAppFeatureVehicleWidgetsTypes;
  }

  get lead(): FormGroup {
    return this.appFeatures.get('lead') as FormGroup;
  }

  get nextService(): FormGroup {
    return this.appFeatures.get('nextService') as FormGroup;
  }

  get nextServiceBooking(): FormGroup {
    return this.nextService.get('nextServiceBooking') as FormGroup;
  }

  get cdkExistingCustomer(): FormControl {
    return this.nextServiceBooking.get('cdkExistingCustomer') as FormControl;
  }

  get customerApp(): FormControl {
    return this.nextServiceBooking.get('customerApp') as FormControl;
  }

  get cdkNewCustomer(): FormControl {
    return this.nextServiceBooking.get('cdkNewCustomer') as FormControl;
  }

  get nextServiceBookingGeneral(): FormControl {
    return this.nextServiceBooking.get('general') as FormControl;
  }

  get nextServiceBookingActive(): FormControl {
    return this.appFeatures.get('active') as FormControl;
  }

  get leadActive(): FormControl {
    return this.lead.get('active') as FormControl;
  }

  get salesLead(): FormGroup {
    return this.lead.get('salesLead') as FormGroup;
  }

  get salesLeadActive(): FormControl {
    return this.salesLead.get('active') as FormControl;
  }

  get questionnaire(): FormGroup {
    return this.salesLead.get('questionnaire') as FormGroup;
  }

  get questionnaireActive(): FormControl {
    return this.questionnaire.get('active') as FormControl;
  }

  get appFeaturesModel(): FormGroup {
    return this.appFeatures.get('model') as FormGroup;
  }

  get sale(): FormGroup {
    return this.appFeaturesModel.get('sale') as FormGroup;
  }

  get bank(): FormGroup {
    return this.sale.get('bank') as FormGroup;
  }

  get newBanks(): FormArray {
    return this.bank.get('new') as FormArray;
  }

  get usedBanks(): FormArray {
    return this.bank.get('used') as FormArray;
  }

  get appFeatureWidgetsTypes() {
    return ICorporates.AppFeatureWidgetsTypes;
  }

  get documentType() {
    return ICorporates.DocumentType;
  }

  get watermark(): FormGroup {
    return this.configuration.get('watermark') as FormGroup;
  }

  get image(): FormControl {
    return this.watermark.get('image') as FormControl;
  }

  validateDownPayment(form: FormGroup | any, ctrl: string): FormControl {
    const downPayment = form.get('downPayment') as FormGroup;
    return downPayment.get(ctrl) as FormControl;
  }

  disableNewBankSelected(uuid: string) {
    return this.newBanks.controls.some((item) => item.value.uuid === uuid);
  }

  disableUsedBankSelected(uuid: string) {
    return this.usedBanks.controls.some((item) => item.value.uuid === uuid);
  }

  onBlurMethod(form: FormControl | AbstractControl) {
    const { value } = form;
    form.clearValidators();

    if (!!value) {
      form.patchValue(value / 100);
      form.setValidators([
        Validators.compose([
          Validators.required,
          Validators.min(0),
          Validators.max(0.1),
        ]),
      ]);
    }

    form.updateValueAndValidity();
  }

  onFocusMethod(form: FormControl | AbstractControl) {
    const { value } = form;
    form.clearValidators();

    if (!!value) {
      form.patchValue(value * 100);
      form.setValidators([
        Validators.compose([
          Validators.required,
          Validators.min(0),
          Validators.max(10),
        ]),
      ]);
    }

    form.updateValueAndValidity();
  }

  onChangeDownPaymentMethod(form: FormGroup | any): void {
    (form.get('amount') as FormControl).patchValue('');
  }

  onBlurDownPaymentAmountMethod(form: FormGroup | any): void {
    const type = form.get('type') as FormControl;
    const amount = form.get('amount') as FormControl;

    if (
      !!amount.value &&
      type.value === CorporateEnum.DownPaymentType.PERCENTAGE
    ) {
      amount.patchValue(amount.value / 100);
      form.updateValueAndValidity();
    }
  }

  onFocusDownPaymentAmountMethod(form: FormGroup | any): void {
    const type = form.get('type') as FormControl;
    const amount = form.get('amount') as FormControl;

    if (
      !!amount.value &&
      type.value === CorporateEnum.DownPaymentType.PERCENTAGE
    ) {
      amount.patchValue(amount.value * 100);
      form.updateValueAndValidity();
    }
  }

  showPreview(event: any, key: ICorporates.AppFeatureImages) {
    const file = (event?.target as HTMLInputElement).files[0];

    this.uploadFeatureImage.emit({
      file,
      key,
    });
  }

  showWaterMarkPreview(event: any) {
    const file = (event?.target as HTMLInputElement).files[0];

    this.uploadWatermarkImage.emit({
      file,
    });
  }

  servicesArray(index: number) {
    if (index !== -1) {
      const module = this.modules.controls[index] as FormGroup;

      const options = module.get('options') as FormGroup;

      return (options.get('services') as FormArray).controls;
    }
  }

  get formDisabled() {
    return false; //this.parent.disabled;`
  }

  get banks(): ICorporates.IBankScheme[] {
    return banksJson.bankLists;
  }

  get downPaymentType() {
    return CorporateEnum.DownPaymentType;
  }

  onSelectBank(form: FormGroup) {
    const uuid: string = (form.get('uuid') as FormControl).value;
    const logoCtrl: FormControl = form.get('logo') as FormControl;
    const nameCtrl: FormControl = form.get('name') as FormControl;

    const { name, logo } = this.banks.find((x) => x.uuid === uuid);

    logoCtrl.patchValue(logo);
    nameCtrl.patchValue(name);

    form.updateValueAndValidity();
  }

  changeIsDefaultNewBank(event: MatSlideToggleChange, index: number) {
    const { checked } = event;
    if (checked) {
      this.newBanks.controls.forEach((_, idx) => {
        if (index !== idx) {
          this.newBanks.controls[idx].get('isDefault').patchValue(false);
        }
      });
    }
  }

  changeIsDefaultUsedBank(event: MatSlideToggleChange, index: number) {
    const { checked } = event;
    if (checked) {
      this.usedBanks.controls.forEach((_, idx) => {
        if (index !== idx) {
          this.usedBanks.controls[idx].get('isDefault').patchValue(false);
        }
      });
    }
  }

  openPanel(trigger: any) {
    if (this.parent.enabled) {
      trigger.openPanel();
    }
  }

  onAction(action: string) {
    if (action === 'cancel') {
      this.input.nativeElement.value = '';
    }

    this.action.emit(action);
  }

  private divisionsControl(array: string[]) {
    const helpCenter = <FormGroup>this.home.get('helpCenter');

    const enquiry = <FormGroup>helpCenter.get('enquiry');

    enquiry.get('divisions').patchValue([...array]);
  }

  private topicsControl(array: string[]) {
    const helpCenter = <FormGroup>this.home.get('helpCenter');

    const enquiry = <FormGroup>helpCenter.get('enquiry');

    enquiry.get('topics').patchValue([...array]);
  }

  private salutationControl(array: string[]) {
    const salutations = <FormControl>this.account.get('salutations');

    salutations.patchValue([...array]);
  }

  private ncdEntitlementControl(array: string[]) {
    const ncdEntitlement = <FormControl>(
      this.insuranceEnquiry.get('ncdEntitlement')
    );

    ncdEntitlement.patchValue([...array]);
  }

  private sourceControl(array: string[]) {
    const tradeIn = <FormGroup>(
      (<FormGroup>(
        (<FormGroup>this.vehicle.get('profile')).get('vehicleDetails')
      )).get('tradeIn')
    );

    const sources = tradeIn.get('sources');

    sources.patchValue([...array]);

    this.parent.updateValueAndValidity();
  }

  private nameControl(array: string[]) {
    const insurance = <FormGroup>(
      (<FormGroup>(
        (<FormGroup>this.vehicle.get('profile')).get('vehicleDetails')
      )).get('insurance')
    );

    const names = insurance.get('names');

    names.patchValue([...array]);

    this.parent.updateValueAndValidity();
  }

  onChangeKey(event: MatSelectChange, index: number) {
    const { value } = event;

    this.addedModuleOption.emit({ value, index });
  }

  openEditor(formGroup: FormGroup) {
    const dialogRef = this.dialog.open(FulfillmentFileEditorComponent, {
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((x) => {
      if (!!x) {
        const position = <FormGroup>(
          (<FormGroup>formGroup.get('signature')).get('position')
        );

        position.patchValue(x?.position);

        this.cd.detectChanges();
      }
    });
  }

  waChange(event: MatSlideToggleChange) {
    const { checked } = event;

    this._whatsAppFormValidation(checked);
  }

  private _whatsAppFormValidation(checked: boolean) {
    const whatsApp = this.helpCenter.get('whatsApp') as FormGroup;

    const phoneNumber = whatsApp.get('phoneNumber') as FormControl;
    const defaultMessage = whatsApp.get('defaultMessage') as FormControl;

    if (checked) {
      phoneNumber.setValidators(Validators.compose([Validators.required]));
      defaultMessage.setValidators(Validators.compose([Validators.required]));
    } else {
      phoneNumber.clearValidators();
      defaultMessage.clearValidators();
    }

    phoneNumber.updateValueAndValidity();
    defaultMessage.updateValueAndValidity();
  }

  onAddWidget() {
    this.addWidget.emit();
  }

  onRemoveWidget(index: number) {
    this.removedWidget.emit(index);
  }

  onAddVehicleWidget() {
    this.addVehicleWidget.emit();
  }

  onRemoveVehicleWidget(index: number) {
    this.removedVehicleWidget.emit(index);
  }


  dropWidgetItem(event: CdkDragDrop<string[]>) {
    const list = this.widgets.controls;

    moveItemInArray(list, event.previousIndex, event.currentIndex);

    list.map((_, i) => list[i].get('order').patchValue(++i));
  }

  dropVehicleWidgetItem(event: CdkDragDrop<string[]>) {
    const list = this.vehicleWidgets.controls;

    moveItemInArray(list, event.previousIndex, event.currentIndex);

    list.map((_, i) => list[i].get('order').patchValue(++i));
  }

  get createPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Corporate.CREATE_CORPORATE]
    ) {
      return true;
    }
    return false;
  }

  get updatePermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Corporate.UPDATE_CORPORATE]
    ) {
      return true;
    }
    return false;
  }

  get accountSynchronizations() {
    return ICorporates.AccountSynchronizations;
  }
}
