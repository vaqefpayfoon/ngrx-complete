import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

export class ScheduleValidators {
  static MatchValidator(
    active: string,
    startTime: string,
    endTime: string,
    maxAppointments: string
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const activeCtrl = control.get(active);
      const startTimeCtrl = control.get(startTime);
      const endTimeCtrl = control.get(endTime);
      const maxAppointmentsCtrl = control.get(maxAppointments);

      const now = new Date();
      const dtStart = (now.getMonth()+1) + "/" + now.getDate() + "/" + now.getFullYear() + " " + startTimeCtrl.value;
      const dtEnd = (now.getMonth()+1) + "/" + now.getDate() + "/" + now.getFullYear() + " " + endTimeCtrl.value;

      return (activeCtrl.value) &&
        (!startTimeCtrl.value ||
        !endTimeCtrl.value ||
        !maxAppointmentsCtrl.value ||
        maxAppointmentsCtrl.value < 1 ||
        !Number.isInteger(maxAppointmentsCtrl.value) ||
        Date.parse(dtStart) >= Date.parse(dtEnd))
        ? { mismatch: true }
        : null;
    };
  }
}


export class OffDaysValidators {
  static MatchValidator(
    startTime: string,
    endTime: string,
    onLeave: string
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const startTimeCtrl = control.get(startTime);
      const endTimeCtrl = control.get(endTime);
      const onLeaveCtrl = control.get(onLeave);

      const now = new Date();
      const dtStart = (now.getMonth()+1) + "/" + now.getDate() + "/" + now.getFullYear() + " " + startTimeCtrl.value;
      const dtEnd = (now.getMonth()+1) + "/" + now.getDate() + "/" + now.getFullYear() + " " + endTimeCtrl.value;
      if(onLeaveCtrl.value) return null;
      return (!startTimeCtrl.value ||
        !endTimeCtrl.value ||
        Date.parse(dtStart) >= Date.parse(dtEnd))
        ? { mismatch: true }
        : null;
    };
  }

}


