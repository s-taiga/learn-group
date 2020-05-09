import { Component } from '@angular/core';
import { CalcChangeService } from './calc-change.service';
import { RecogUnitStringService } from './recog-unit-string.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'forGroupLearn';
  displayedColumns = ['origin', 'affected'];

  constructor(public service: CalcChangeService,
              public recogUnit: RecogUnitStringService){
  }

  onEnter(value: string){
    this.service.regenerate(this.recogUnit.reshapeUnitString(value, this.service.size));
  }

  changeAffectDirection(value: string){
    this.service.changeCalcDirection(value);
  }
}
