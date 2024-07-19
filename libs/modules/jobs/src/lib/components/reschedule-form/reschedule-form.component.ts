import {
  Component,
  ChangeDetectionStrategy,
  Input,
  EventEmitter,
  Output,
} from '@angular/core';

// Angular forms
import {
  FormBuilder,
  Validators,
  FormControl,
  FormGroup,
} from '@angular/forms';

// Models
import { ICalendar, IReservations } from '../../models';

// Permission Tags
import { permissionTags } from '@neural/shared/data';

@Component({
  selector: 'neural-reschedule-form',
  templateUrl: './reschedule-form.component.html',
  styleUrls: ['./reschedule-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RescheduleFormComponent {
  @Input() timeZone: string;

  @Input() calendar: ICalendar.IDocument[];

  @Input() reservation: IReservations.IDocument;

  @Input() permissions: any;

  @Output()
  create: EventEmitter<IReservations.IReschedule> = new EventEmitter<
    IReservations.IReschedule
  >();

  disableSaveButton=false

  form = this.fb.group({
    slot: ['', Validators.compose([Validators.required])],
  });

  constructor(private fb: FormBuilder) {}

  get createPermission() {
    if (
      this.permissions &&
      (this.permissions[
        permissionTags.Reservation.RESCHEDULE_MOBILE_RESERVATION
      ] ||
        this.permissions[
          permissionTags.Reservation.RESCHEDULE_SERVICE_CENTER_RESERVATION
        ])
    ) {
      return true;
    }
    return false;
  }

  get slot() {
    return this.form.get('slot') as FormControl;
  }

  rescheduleReservation(form: FormGroup) {
    const { valid, value } = form;

    if (valid) {
      this.disableSaveButton=true;
      this.create.emit({
        ...value,
        reservation: { ...this.reservation },
      });
    }
  }

  onSelect(iso: string, available: boolean) {
    if (available) {
      this.slot.patchValue(iso);
    }
  }

  validateDate(item: ICalendar.IDocument): boolean {
    if (new Date(item.day).getDate() >= new Date().getDate()) {
      return true;
    } else {
      return false;
    }
  }
}
