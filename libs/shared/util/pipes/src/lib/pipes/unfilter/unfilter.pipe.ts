import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'unfilter'
})
export class UnfilterPipe implements PipeTransform {
  static filter(
    items: Array<{ [key: string]: any }>,
    term: string
    ): Array<{ [key: string]: any }> {
    
    const toCompare = term.toLowerCase();

    return items.filter(function(item: any) {
      if (typeof item === 'object') {
        for (const property in item) {
          if (item[property] === null || item[property] === undefined) {
            continue;
          }

          if (
            item[property]
              .toString()
              .toLowerCase()
              .includes(toCompare)
          ) {
            return false;
          }
        }
      }

      if (typeof item === 'string') {
        if (
          (item !== null || item !== undefined) &&
          item
            .toString()
            .toLowerCase()
            .includes(toCompare)
        ) {
          return false;
        }
      }

      return true;
    });
  }

  transform(items: any, term: string): any {
    if (!term || !items) {
      return items;
    }

    return UnfilterPipe.filter(items, term);
  }
}
