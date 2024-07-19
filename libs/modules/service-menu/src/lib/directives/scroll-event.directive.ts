import { Directive, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

export interface IAutoCompleteScrollEvent {
  autoComplete: MatAutocomplete;
  scrollEvent: Event;
}

@Directive({
  selector: 'mat-autocomplete[optionsScroll]'
})
export class OptionsScrollDirective implements OnDestroy {

  @Input() thresholdPercent = .8;
  @Output('optionsScroll') scroll = new EventEmitter<IAutoCompleteScrollEvent>();
  _onDestroy = new Subject();

  constructor(public autoComplete: MatAutocomplete) {
    this.autoComplete.opened.pipe(
      tap(() => {
        setTimeout(() => {
          this.removeScrollEventListener();
          this.autoComplete.panel.nativeElement
            .addEventListener('scroll', this.onScroll.bind(this))
        });
      }),
      takeUntil(this._onDestroy)).subscribe();

    this.autoComplete.closed.pipe(
      tap(() => this.removeScrollEventListener()),
      takeUntil(this._onDestroy)).subscribe();
  }

  private removeScrollEventListener() {
    if(this.autoComplete && this.autoComplete.panel && this.autoComplete.panel.nativeElement) {
      this.autoComplete.panel.nativeElement
      .removeEventListener('scroll', this.onScroll);
    }
  }

  onScroll(event: any) {
    if (this.thresholdPercent === undefined) {
      this.scroll.next({ autoComplete: this.autoComplete, scrollEvent: event });
    } else {
      const threshold = this.thresholdPercent * 100 * event.target.scrollHeight / 100;
      const current = event.target.scrollTop + event.target.clientHeight;
      // console.log('scrollHeight' + event.target.scrollHeight);
      // console.log('clientHeight : ' + event.target.clientHeight);
      // console.log('threshold : ' + threshold);
      // console.log('current : ' + current)
      if (current > threshold) {
        this.scroll.next({ autoComplete: this.autoComplete, scrollEvent: event });
        console.log('end')
      }
    }
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
    this.removeScrollEventListener();
  }
}