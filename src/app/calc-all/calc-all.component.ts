import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CalcChangeService } from '../calc-change.service';
import { RecogUnitStringService } from '../recog-unit-string.service';
import { ThreeEngineService } from '../three-engine.service';

@Component({
  selector: 'app-calc-all',
  templateUrl: './calc-all.component.html',
  styleUrls: ['./calc-all.component.css']
})
export class CalcAllComponent implements OnInit {
  @ViewChild('rendererCanvas', {static: true})
  public rendererCanvas: ElementRef<HTMLCanvasElement>;

  ngOnInit(): void {
    this.engServ.createScene(this.rendererCanvas);
    this.engServ.animate();
  }
  displayedColumns = ['origin', 'affected'];

  constructor(public service: CalcChangeService,
              public engServ: ThreeEngineService){
  }

  // 置換文字列入力処理
  // エンターキーを叩いたときに計算・画面反映させる
  onEnter(value: string){
    this.service.regenerate(RecogUnitStringService.reshapeUnitString(value, this.service.size));
    this.engServ.genarateArrow();
  }

  // 作用の向きボタン
  changeAffectDirection(value: string){
    this.service.changeCalcDirection(value);
    this.engServ.genarateArrow();
  }

  // 置換のサイズ変更
  changeUnitSize(value: number){
    this.service.changeUnitSize(value);
    this.engServ.recreateMeshes();
  }
}
