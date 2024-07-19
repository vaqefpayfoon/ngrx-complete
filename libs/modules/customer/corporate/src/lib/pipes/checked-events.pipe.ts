import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'checkedEvents',
})
export class CheckedEventsPipe implements PipeTransform {
  transform(value: string[], title: string) {
    return value && value.length ? value.some((x) => x === title) : false;
  }
}
