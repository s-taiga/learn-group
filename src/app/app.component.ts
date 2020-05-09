import { Component } from '@angular/core';
import { CalcChangeService } from './calc-change.service';
import { RecogUnitStringService } from './recog-unit-string.service';
/**
 * メイン表示用スクリプト
 */
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
