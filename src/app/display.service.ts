import { Injectable } from '@angular/core';
import { Observer, ReplaySubject, Observable } from 'rxjs';
/**
 * MathJax表示用サービス
 * 動的な変更ができなかったのと妙に表示に時間がかかるのでひとまず使わないで放置
 * このページを参考にしました
 * https://stackoverflow.com/questions/55125544/mathjax-in-angular-6
 */
declare global {
  interface Window {
    hubReady: Observer<boolean>;
  }
}

export interface MathService {
  ready(): Observable<boolean>;

  render(element: HTMLElement, math?: string): void;
}

@Injectable({
  providedIn: 'root'
})
export class DisplayService implements MathService {
  private readonly notifier: ReplaySubject<boolean>;

  constructor() {
    this.notifier = new ReplaySubject<boolean>();
    window.hubReady = this.notifier; // as said, bind to window object
  }

  ready(): Observable<boolean> {
    return this.notifier;
  }

  render(element: HTMLElement, math?: string): void {
    if(math){
      element.innerHTML = math;
    }

    MathJax.Hub.Queue(['Typeset', MathJax.Hub, element]);
  }
}
