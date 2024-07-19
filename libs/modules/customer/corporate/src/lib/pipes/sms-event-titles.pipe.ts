import { Pipe, PipeTransform } from '@angular/core';

import { EventSmsTitle, EventTitle } from '../models/email-branches.enum';

@Pipe({
  name: 'smsEventTitles',
})
export class SmsEventTitlesPipe implements PipeTransform {
  transform(_: unknown, title: string) {
    return EventSmsTitle[title];
  }
}
