import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  Output,
  EventEmitter,
  SimpleChanges
} from '@angular/core';

// Models
import { IVehicle } from '../../models';

// Angular Form
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';

// Material event
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'neural-car-tyre-specs',
  templateUrl: './car-tyre-specs.component.html',
  styleUrls: ['./car-tyre-specs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CarTyreSpecsComponent implements OnChanges {
  @Input()
  vehicle: IVehicle.IDocument;

  @Input()
  carTyreSpecs: any;
  
  @Input() tyre: IVehicle.ITyre;

  @Input() rearTyre: IVehicle.ITyre;

  @Input()
  error: any;

  @Output()
  update = new EventEmitter<IVehicle.IUpdate>();

  @Output() aspectRatio = new EventEmitter<{ width: string }>();
  @Output() rim = new EventEmitter<{ width: string; aspectRatio: string }>();

  @Output() rearWidth = new EventEmitter<any>();
  @Output() rearAspectRatio = new EventEmitter<{ width: string }>();
  @Output() rearRim = new EventEmitter<{ width: string; aspectRatio: string }>();

  form = this.fb.group({
    frontLeft: this.fb.group(this.specification),
    frontRight: this.fb.group(this.specification),
    rearLeft: this.fb.group(this.specification),
    rearRight: this.fb.group(this.specification),
    sameTyre: [false, [Validators.required]]
  });

  constructor(private fb: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.carTyreSpecs && changes.carTyreSpecs.currentValue && this.carTyreSpecs) {
      const { frontLeft, rearLeft } = this.carTyreSpecs;

      if (frontLeft.width === rearLeft.width) {
        this.sameTyre.patchValue(true);
        this.setTyreSpecs(frontLeft);
      } else {
        this.setTyreSpecs(frontLeft, rearLeft);
      }

      this.form.disable();
    }

    if (changes && changes.error && !changes.error.firstChange) {
      this.form.enable();
    }
  }

  updateTyreSpecs(form: FormGroup) {
    const { value, valid, touched } = form;

    if (touched && valid) {
      this.update.emit({
        ...this.vehicle,
        carTyreSpecs: {
          front: {
            left: {
              aspectRatio: parseInt(value.frontLeft.aspectRatio, 10),
              rimSize: parseInt(value.frontLeft.rimSize, 10),
              width: parseInt(value.frontLeft.width, 10)
            },
            right: {
              aspectRatio: parseInt(value.frontRight.aspectRatio, 10),
              rimSize: parseInt(value.frontRight.rimSize, 10),
              width: parseInt(value.frontRight.width, 10)
            }
          },
          rear: {
            left: {
              aspectRatio: parseInt(value.rearLeft.aspectRatio, 10),
              rimSize: parseInt(value.rearLeft.rimSize, 10),
              width: parseInt(value.rearLeft.width, 10)
            },
            right: {
              aspectRatio: parseInt(value.rearRight.aspectRatio, 10),
              rimSize: parseInt(value.rearRight.rimSize, 10),
              width: parseInt(value.rearRight.width, 10)
            }
          }
        }
      });

      this.form.disable();
    }
  }

  get specification() {
    return {
      width: ['', Validators.required],
      rimSize: ['', Validators.required],
      aspectRatio: ['', Validators.required]
    };
  }

  sameTyreToggle(event: MatSlideToggleChange) {
    const { checked } = event;
    
    if (checked) {
      this.setTyreSpecs(this.frontLeft.value);
    } else {
      this.rearWidth.emit();
      this.setTyreSpecs(this.frontLeft.value, this.rearLeft.value);
    }
  }

  setTyreSpecs(front: any, rear?: any) {
    this.frontLeft.patchValue(front);
    this.frontRight.patchValue(front);
    this.rearLeft.patchValue(rear ? rear : front);
    this.rearRight.patchValue(rear ? rear : front);
  }

  onSelectWidth(event: MatAutocompleteSelectedEvent, from: FormControl, formControls: FormControl[], isRear: boolean) {
    const { value } = event.option;
    
    !isRear ? this.aspectRatio.emit(value) : this.rearAspectRatio.emit(value);
    
    formControls.forEach(formControl => {
      formControl.patchValue(from.value);
      formControl.get('aspectRatio').reset();
      formControl.get('rimSize').reset();
    });    
  }

  onSelectAspectRatio(event: MatAutocompleteSelectedEvent, from: FormControl, formControls: FormControl[], isRear: boolean) {
    const aspectRatio = event.option.value;
    const width = from.get('width').value;
    
    !isRear? this.rim.emit({ width, aspectRatio }) : this.rearRim.emit({ width, aspectRatio });

    formControls.forEach(formControl => {
      formControl.patchValue(from.value);
      formControl.get('rimSize').reset();
    });
  }

  onSelectRim(from: FormControl, formControls: FormControl[]) {
    formControls.forEach(formControl => formControl.patchValue(from.value));
  }

  get frontLeft(): any {
    return this.form.get('frontLeft') as FormGroup;
  }

  get frontLeftAspectRatio(): any {
    return this.frontLeft.get('aspectRatio') as FormControl;
  }

  get frontLeftRimSize(): any {
    return this.frontLeft.get('rimSize') as FormControl;
  }

  get frontRight(): any {
    return this.form.get('frontRight') as FormGroup;
  }
  
  get rearLeft(): any {
    return this.form.get('rearLeft') as FormGroup;
  }

  get rearLeftAspectRatio(): any {
    return this.rearLeft.get('aspectRatio') as FormControl;
  }

  get rearLeftRimSize(): any {
    return this.rearLeft.get('rimSize') as FormControl;
  }

  get rearRight(): any {
    return this.form.get('rearRight') as FormGroup;
  }

  get sameTyre(): any {
    return this.form.get('sameTyre') as FormGroup;
  }
}
