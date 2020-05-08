import { Component } from '@angular/core';
import { CalcChangeService } from './calc-change.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'forGroupLearn';

  constructor(public service: CalcChangeService){}
}
