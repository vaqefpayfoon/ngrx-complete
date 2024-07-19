import { Pipe, PipeTransform } from '@angular/core';

import { EventTitle } from '../models/email-branches.enum';

@Pipe({
  name: 'eventTitles',
})
export class EventTitlesPipe implements PipeTransform {
  transform(_: unknown, title: string) {
    return EventTitle[title];
  }
}
