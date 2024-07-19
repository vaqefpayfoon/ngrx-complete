import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Auth } from '@neural/auth';
import { ICorporates, ICountry, ILead, ILeadTestDrive, IWishList, leadPurchaseQuotes } from '../../models';

@Component({
  selector: 'neural-lead-form',
  templateUrl: './lead-form.component.html',
  styleUrls: ['./lead-form.component.scss']
})
export class LeadFormComponent implements OnChanges {
  @Input() lead: ILead.IDocument;
  @Input() wishList: IWishList.IData;
  @Input() purchaseQuotes: leadPurchaseQuotes.IData;
  @Input() testDrives: ILeadTestDrive.IData;
  @Input() permissions;
  @Input() selectedCorporate: Auth.ICorporates;
  @Input() selectedBranch: Auth.IBranch;
  @Input() brands: string[];
  @Input() corporates: Auth.ICorporates[];
  @Input() isSuperAdmin;
  @Input() account: Auth.AccountClass;
  @Output() branchChange = new EventEmitter();
  @Output() loaded = new EventEmitter<
    ILead.IDocument
  >();
  @Output() countryChange = new EventEmitter<string>();
  @Output() updated = new EventEmitter<{
    changes: ILead.IUpdate;
    lead: ILead.IDocument;
  }>();
  @Output() allBadgesChanges = new EventEmitter<string>();

  constructor(
    private snackBar: MatSnackBar
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    // if (changes.lead && changes.lead.currentValue) {
    //   this.loaded.emit(this.lead);
    // }
    if (changes.selectedCorporate && !changes.selectedCorporate.firstChange) {
      this.branchChange.emit(true);
    }
  }
  onUpdate(changes: ILead.IUpdate) {
    const lead: ILead.IDocument = this.lead;
    this.updated.emit({
      changes,
      lead,
    });
  }
  toggleSnackbar(message: string) {
    return this.snackBar.open(message, '', {
      duration: 5000,
      verticalPosition: 'top',
      panelClass: ['snackbar--lead'],
    });
  }
}
