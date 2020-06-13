import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CalcChangeService } from '../calc-change.service';
import { RecogUnitStringService } from '../recog-unit-string.service';
import { ThreeEngineService } from '../three-engine.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeUnit } from '../change.class';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'app-calc-all',
  templateUrl: './calc-all.component.html',
  styleUrls: ['./calc-all.component.css']
})
export class CalcAllComponent implements OnInit {
  @ViewChild('rendererCanvas', {static: true})
  public rendererCanvas: ElementRef<HTMLCanvasElement>;

  @ViewChild('calc_result') table: MatTable<ChangeUnit[]>;

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

  // 履歴制御ボタン
  OnChangeHistDisp(){
    this.engServ.setArrowOpacity();
  }

  // 置換のサイズ変更
  changeUnitSize(value: number){
    this.service.changeUnitSize(value);
    this.engServ.recreateMeshes();
  }

  // テーブル要素移動
  dropTable(event: CdkDragDrop<ChangeUnit[]>){
    const prevIndex = this.service.all_list.findIndex(d=>d===event.item.data);
    moveItemInArray(this.service.all_list, prevIndex, event.currentIndex);
    for(let i=0; i<this.service.history.length; i++){
      moveItemInArray(this.service.history[i].pointer2affected_string, prevIndex, event.currentIndex);
    }
    this.table.renderRows();
  }
}
