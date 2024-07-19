import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Auth } from '@neural/auth';
import { ISalesAdvisor } from '@neural/modules/administration';
import { permissionTags, traverseAndRemove } from '@neural/shared/data';
import { Observable } from 'rxjs';
import {
  ICorporates,
  ICountry,
  ILead,
  ILeadTestDrive,
  IWishList,
  leadPurchaseQuotes,
} from '../../models';
// Moment
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment } from 'moment';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import { IModels } from '@neural/modules/models';
import { CorporatesFacade, LeadFacade } from '../../+state';
import { MatDialog } from '@angular/material/dialog';
import { LeadNoteComponent } from '../lead-note/lead-note.component';
import { ISaveNote, SortedText } from '../../models/lead-note.interface';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { delay, map, startWith } from 'rxjs/operators';
import countriesJSON from '@nerv/countries';
import { CountryClass } from '../../models/country.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

const moment = _rollupMoment || _moment;

// Format date picker
const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'neural-lead-details',
  templateUrl: './lead-details.component.html',
  styleUrls: ['./lead-details.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class LeadDetailsComponent implements OnInit {
  @Input() lead: ILead.IDocument;
  @Input() permissions;
  @Input() wishList: IWishList.IData;
  @Input() purchaseQuotes: leadPurchaseQuotes.IData;
  @Input() selectedCorporate: Auth.ICorporates;
  @Input() selectedBranch: Auth.IBranch;
  @Input() brands: string[];
  @Input() corporates: Auth.ICorporates[];
  @Input() isSuperAdmin;
  @Input() testDrives: ILeadTestDrive.IData;
  @Output() update = new EventEmitter<ILead.IUpdate>();
  @Output() modelBrandSeriesChanges = new EventEmitter<IModels.IVariant>();
  @Input() account: Auth.AccountClass;
  corporate$: Observable<ICorporates.IDocument>;
  filteredCountries: Observable<CountryClass[]>;
  isSelect: boolean;
  filteredOptions: Observable<ISalesAdvisor.ISADocument[]>;
  form: FormGroup;
  assignForm: FormGroup;
  leadDetail = true;
  salesAdvisorDetail = true;
  exists = false;
  editmode = false;
  errorMessage: string | null;
  monthlyIncomes: string[] = [];
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  myControl = new FormControl();
  // countryClass: CountryClass[] = [];
  constructor(
    private fb: FormBuilder,
    route: ActivatedRoute,
    private leadFacade: LeadFacade,
    private corporatesFacade: CorporatesFacade,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {
    route.params.subscribe((params) => {
      if (params.uuid) {
        this.editmode = true;
      }
    });
  }
  get updateLeadPermission() {
    if (this.permissions && this.permissions[permissionTags.Lead.UPDATE_LEAD]) {
      return true;
    }
    return false;
  }
  get updateNotePermission() {
    if (this.permissions && this.permissions[permissionTags.Lead.EDIT_NOTE]) {
      return true;
    }
    return false;
  }
  get createNotePermission() {
    if (this.permissions && this.permissions[permissionTags.Lead.CREATE_NOTE]) {
      return true;
    }
    return false;
  }
  get deleteNotePermission() {
    if (this.permissions && this.permissions[permissionTags.Lead.DELETE_NOTE]) {
      return true;
    }
    return false;
  }
  get salesAdvisorPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.Lead.SALES_ADVISOR_ALLOW]
    ) {
      return true;
    }
    return false;
  }
  ownerOfNote(from: string): boolean {
    if (this.account?.identity?.fullName == from) {
      return true;
    }
    return false;
  }
  get countryClass(): CountryClass[] {
    return Object.keys(countriesJSON).map((country) => {
      return {
        country,
        alfa2: countriesJSON[country].codes.alpha2,
        currency: countriesJSON[country].codes.currency,
      };
    });
  }
  ngOnInit(): void {
    this.corporate$ = this.corporatesFacade.corporate$;
    this.corporatesFacade.getCorporate(this.selectedCorporate.uuid);
    this.form = this.fb.group({
      salesAdvisorUuid: [''],
      dateOfBirth: [''],
      monthlyIncome: [''],
    });
    this.assignForm = this.fb.group({
      salesAdvisorUuid: ['', Validators.required],
      branchUuid: [''],
      brandUuid: [''],
    });
    if (this.lead.nationality) {
      this.myControl.patchValue(this.lead.nationality);
    }
    this.exists = true;
    this.form.patchValue(this.lead);
    this.filteredCountries = this.myControl.valueChanges.pipe(      
      delay(500),
      map((value: string) => {
        if(value.length > 1) {
          return this._filter(value)
        }
      })
    );
    this.findCurrencyFromCorporate();
  }
  private _filter(value: string): CountryClass[] {
    const filterValue = value.toLowerCase();
    return this.countryClass.filter(
      (country) => country.country.toLowerCase().indexOf(filterValue) === 0
    );
  }
  get saleAdvisorUuid(): FormControl {
    return this.assignForm.get('saleAdvisorUuid') as FormControl;
  }
  get leadPriority() {
    return ILead.Priority;
  }

  onUpdate(form: FormGroup): void {
    const country = this.myControl.value;
    if(country) {
      if(!this.countryClass.some(x => x.country == country)) {
        this.toggleSnackbar('The country is invalid.');
        return;
      }
    }
    const { value, valid } = form;
    value.nationality = country;
    value.salesAdvisorUuid = this.lead?.salesAdvisor?.uuid;
    if (valid) {
      traverseAndRemove(value);
      this.leadDetail = true;
      this.update.emit(value);
      this.exists = false;
    }
  }
  toggleSnackbar(message: string) {
    return this.snackBar.open(message, '', {
      duration: 5000,
      verticalPosition: 'top',
      panelClass: ['snackbar--custom'],
    });
  }
  onAssign(form: FormGroup): void {
    const { value, valid } = form;
    if (valid) {
      traverseAndRemove(value);
      this.salesAdvisorDetail = true;
      this.update.emit(value);
      this.exists = false;
      this.assignForm.reset();
    }
  }
  onReset() {
    this.saleAdvisorUuid.patchValue('');
    this.saleAdvisorUuid.updateValueAndValidity();
    this.errorMessage = null;
  }
  displayFn(account: ISalesAdvisor.ISADocument): string {
    return account && account?.identity?.fullName
      ? `${account?.identity?.salutation} ${account?.identity?.fullName}`
      : '';
  }
  onBranchChanged() {
    this.assignForm.patchValue({ salesAdvisorUuid: '' });
    this.assignForm.patchValue({ brandUuid: '' });
    this.errorMessage = null;
    this.leadFacade.onResetSalesAdvisor();
    if (!this.selectedCorporate || !this.assignForm.value.branchUuid) {
      this.errorMessage = 'invalid branch';
      return;
    }
    this.filteredOptions = this.leadFacade.salesAdvisors$;
    const sa: ILead.SA = {
      corporate: this.selectedCorporate.uuid,
      branch: this.assignForm.value.branchUuid,
    };
    this.leadFacade.onLoadSalesAdvisor(sa);
  }
  onSalesAdvisorChanged(brand) {
    this.assignForm.patchValue({ salesAdvisorUuid: '' });
    this.errorMessage = null;
    this.leadFacade.onResetSalesAdvisor();
    if (!this.selectedCorporate || !this.assignForm.value.branchUuid) {
      this.errorMessage = 'invalid branch';
      return;
    }
    this.filteredOptions = this.leadFacade.salesAdvisors$;
    const sa: ILead.SA = {
      corporate: this.selectedCorporate.uuid,
      branch: this.assignForm.value.branchUuid,
      brand,
    };
    this.leadFacade.onLoadSalesAdvisor(sa);
  }
  branches(): Auth.IBranch[] {
    if (this.selectedCorporate) {
      return this.corporates.find(
        (corporate) => corporate?.uuid === this.selectedCorporate.uuid
      )?.branches;
    } else {
      const arr: Auth.IBranch[] = [];
      return arr;
    }
  }
  changeDateOfBirth({ value }: MatDatepickerInputEvent<Date>) {
    this.dateOfBirth.patchValue(moment(value).toISOString());
  }
  get dateOfBirth(): FormControl {
    return this.form.get('dateOfBirth') as FormControl;
  }
  noteState(i: number): void {
    let data;
    let editmode = false;
    const sortedText = this.sortNotes;
    if (i === -1) {
      data = {
        value: '',
        noteUuid: null,
        uuid: this.lead.uuid,
      };
    } else {
      data = {
        value: sortedText[i].value,
        noteUuid: sortedText[i].uuid,
        uuid: this.lead.uuid,
      };
      editmode = true;
    }
    const dialogRef = this.dialog.open(LeadNoteComponent, {
      width: '450px',
      data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (!editmode) {
          const note: ISaveNote = {
            note: result.note,
            uuid: result.uuid,
          };
          this.leadFacade.createNote(note);
        } else {
          const note: ISaveNote = {
            note: result.note,
            uuid: result.uuid,
          };
          this.leadFacade.updateNote(note, result.noteUuid);
        }
      }
    });
  }
  deleteNote(i: number): void {
    const sortedText = this.sortNotes;
    const noteUuid = sortedText[i].uuid;
    const uuid = this.lead?.uuid;
    if (uuid && noteUuid) {
      const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
        width: '300px',
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.leadFacade.deleteNote(uuid, noteUuid);
        }
      });
    }
  }
  changePriority(event): void {
    const update: ILead.IUpdate = {
      priority: event,
      salesAdvisorUuid: this.lead?.salesAdvisor?.uuid,
    };
    this.leadFacade.update({ changes: update, lead: this.lead });
  }
  onSendEmail(): void {
    this.leadFacade.sendManualInvitation(this.lead.uuid);
    if (this.lead?.reminder) {
      this.lead.reminder.isManuallyInvited = false;
    }
  }
  findCurrencyFromCorporate(): void {
    // this.corporate$.subscribe(res => {
    //   let currency = '';
    //   if(res?.configuration?.locale?.countryCode) {
    //     const countryCode = res.configuration?.locale?.countryCode;
    //     for (const code of this.countryClass) {
    //       if (code.alfa2 == countryCode) {
    //         currency = code.currency;
    //         break;
    //       }
    //     }
    //     this.monthlyIncomes = [];
    //     this.monthlyIncomes = [
    //       `Below ${currency} 10,000`,
    //       `${currency} 10,000 - ${currency} 20,000`,
    //       `${currency} 20,000 - ${currency} 50,000`,
    //       `Above ${currency} 50,000`,
    //     ];
    //   }
    // });
    this.monthlyIncomes = [
      `Below 10,000`,
      `10,000 - 20,000`,
      `20,000 - 50,000`,
      `Above 50,000`,
    ];
  }
  get sortNotes(): SortedText[] {
    if (!this.lead?.notes) {
      return [];
    }
    const notes: SortedText[] = [];
    for (const frm of this.lead?.notes) {
      for (const note of frm?.texts) {
        notes.push({
          accountUuid: frm?.from?.accountUuid,
          fullName: frm?.from?.identity?.fullName,
          salutation: frm?.from?.identity?.salutation,
          dateAndTime: note?.dateAndTime,
          isEdited: note?.isEdited,
          uuid: note?.uuid,
          value: note?.value,
        });
      }
    }
    notes.sort((a, b) => {
      return +new Date(b.dateAndTime) - +new Date(a.dateAndTime);
    });
    return notes;
  }
  getPriorityText(priority: ILead.Priority): string {
    let text = '';
    switch (priority) {
      case ILead.Priority.HIGH:
        text = 'High';
        break;
      case priority[ILead.Priority.HIGH]:
        text = 'High';
        break;
      case ILead.Priority.LOW:
        text = 'Low';
        break;
      case priority[ILead.Priority.LOW]:
        text = 'Low';
        break;
      case ILead.Priority.MEDIUM:
        text = 'Medium';
        break;
      case priority[ILead.Priority.MEDIUM]:
        text = 'Medium';
        break;
      case ILead.Priority.NO_PRIORITY:
        text = 'No Priority';
        break;
      case priority[ILead.Priority.NO_PRIORITY]:
        text = 'No Priority';
        break;
    }
    return text;
  }
  get getRole() {
    if(this.account?.permissions?.operationRole) {
      return this.account?.permissions?.operationRole == 'SALES_ADVISOR' ? false : true
    }
    return true
  }
}
