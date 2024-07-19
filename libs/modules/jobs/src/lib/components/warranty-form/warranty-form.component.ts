import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';

// Angular forms
import {
  FormBuilder,
  Validators,
  FormControl,
  FormGroup
} from '@angular/forms';

// Models
import { IWarranties } from '../../models';

// RxJS
import {
  map,
  filter,
  delay,
  distinctUntilChanged,
  switchMap
} from 'rxjs/operators';
import { fromEvent, of } from 'rxjs';

// permission tags
import { permissionTags } from '@neural/shared/data';

// Auth
import { Auth } from '@neural/auth';

@Component({
  selector: 'neural-warranty-form',
  templateUrl: './warranty-form.component.html',
  styleUrls: ['./warranty-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WarrantyFormComponent implements AfterViewInit, OnChanges {
  @Input() warranty: IWarranties.IDocument;

  @Input() vehicle: IWarranties.IDocumentVin;

  @Input() selectedBranch: Auth.IBranch;

  @Input() error: any;

  @Input() loading: boolean;

  @Input() permissions: any;

  @Output() branchChange = new EventEmitter();

  @ViewChild('input') input: ElementRef;

  @Output()
  vinChange: EventEmitter<string> = new EventEmitter<string>();

  @Output() loaded: EventEmitter<IWarranties.IDocument> = new EventEmitter<
    IWarranties.IDocument
  >();

  @Output()
  create: EventEmitter<{
    warranty: IWarranties.ICreate;
    entity: IWarranties.IDocumentVin;
  }> = new EventEmitter<{
    warranty: IWarranties.ICreate;
    entity: IWarranties.IDocumentVin;
  }>();

  form = this.fb.group({
    accountVehicleUuid: ['', Validators.compose([Validators.required])]
  });

  constructor(private fb: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedBranch && !changes.selectedBranch.firstChange) {
      this.branchChange.emit(true);
    }

    if (changes.vehicle && changes.vehicle.currentValue) {
      const patchValue: IWarranties.ICreate = {
        accountVehicleUuid: this.vehicle.accountVehicle.uuid
      };

      this.form.patchValue(patchValue);
    }

    if (changes.warranty && changes.warranty.currentValue) {
      this.loaded.emit(this.warranty);
    }
  }

  ngAfterViewInit() {
    // server-side search
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        map((event: any) => {
          const input = event.target as HTMLTextAreaElement;
          return input.value;
        }),
        filter(value => value.length > 2),
        switchMap(search => of(search).pipe(delay(500))),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.vinChange.emit(value);
      });
  }

  get account() {
    return this.vehicle ? this.vehicle.account : null;
  }

  get accountVehicle() {
    return this.vehicle ? this.vehicle.accountVehicle : null;
  }

  get vehicleReference() {
    return this.accountVehicle ? this.accountVehicle.vehicleReference : null;
  }

  get unit() {
    return this.vehicleReference ? this.vehicleReference.unit : null;
  }

  get unitName() {
    return this.unit
      ? `${this.unit.brand} ${this.unit.model.display} ${
          this.unit.variant.display
        }`
      : null;
  }

  get accountVehicleW() {
    return this.warranty ? this.warranty.accountVehicle : null;
  }

  get vehicleReferenceW() {
    return this.accountVehicleW ? this.accountVehicleW.vehicleReference : null;
  }

  get unitW() {
    return this.vehicleReferenceW ? this.vehicleReferenceW.unit : null;
  }

  get unitNameW() {
    return this.unitW
      ? `${this.unitW.brand} ${this.unitW.model.display} ${
          this.unitW.variant.display
        }`
      : null;
  }

  createWarranty(form: FormGroup) {
    const { value, valid } = form;
    if (valid && this.createPermission) {
      this.create.emit({
        warranty: value,
        entity: this.vehicle
      });
      form.disable();
    }
  }

  get createPermission() {
    if (
      this.permissions &&
      this.permissions[permissionTags.ServiceRecall.CREATE_SERVICE_RECALL]
    ) {
      return true;
    }
    return false;
  }
}
