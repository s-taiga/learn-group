import { Component, OnInit } from '@angular/core';
import { CalcChangeService } from '../calc-change.service';
import { RecogUnitStringService } from '../recog-unit-string.service';

@Component({
  selector: 'app-calc-all',
  templateUrl: './calc-all.component.html',
  styleUrls: ['./calc-all.component.css']
})
export class CalcAllComponent implements OnInit {

  ngOnInit(): void {
  }
  displayedColumns = ['origin', 'affected'];

  constructor(public service: CalcChangeService,
              public recogUnit: RecogUnitStringService){
  }

  // 置換文字列入力処理
  // エンターキーを叩いたときに計算・画面反映させる
  onEnter(value: string){
    this.service.regenerate(this.recogUnit.reshapeUnitString(value, this.service.size));
  }

  // 作用の向きボタン
  changeAffectDirection(value: string){
    this.service.changeCalcDirection(value);
  }

  // 置換のサイズ変更
  changeUnitSize(value: number){
    this.service.changeUnitSize(value);
  }
}
