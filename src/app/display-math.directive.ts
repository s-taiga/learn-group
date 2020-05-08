import { Directive, OnInit, OnChanges, OnDestroy, Input, ElementRef, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { DisplayService } from './display.service';
import { takeUntil, take } from 'rxjs/operators';

@Directive({
  selector: '[appDisplayMath]'
})
export class DisplayMathDirective implements OnInit, OnChanges, OnDestroy {
  private alive$ = new Subject<boolean>();

  @Input()
  private appDisplayMath: string;
  private readonly _el: HTMLElement;

  constructor(private service: DisplayService,
              private el: ElementRef) {
    this._el = el.nativeElement as HTMLElement;
  }

  ngOnInit(): void {
    this.service
      .ready()
      .pipe(
        take(1),
        takeUntil(this.alive$)
      ).subscribe(res => {
        this.service.render(this._el, this.appDisplayMath);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  ngOnDestroy(): void {
    this.alive$.next(false);
  }
}
