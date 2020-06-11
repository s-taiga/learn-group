import { Injectable } from '@angular/core';
import { ChangeUnit, ShowUnit, HistoryUnit } from './change.class'
/**
 * 置換作成・計算関係まとめサービス
 * Util的な処理と状態保持が混じった形になっているが大して大きいクラスでも無いのでこれでよしとする
 */
@Injectable({
  providedIn: 'root'
})
export class CalcChangeService {
  // 入れ替える文字数
  public size: number = 3;
  // 変換対象のリスト（有限群）
  public all_list: ShowUnit[] = [{origin: {size: this.size, pos: []}, affected: {size: this.size, pos: []}}];
  // 作用
  public g: ChangeUnit;
  // 作用する向き
  private calcDirection: string = 'left';
  // 計算履歴
  public history: HistoryUnit[] = [];

  // リスト初期化
  constructor() {
    this.g = {size: this.size, pos: [...Array(this.size).keys()]};
    this.all_list = this.make_all_list(this.size).map(v=>{return {origin: v, affected: this.calcMain(this.g, v)}});
  }

  // リスト再計算
  public regenerate(new_g: number[]){
    this.g.pos = new_g;
    this.calcAllUnit();
  }

  // 作用の向きを変更し再計算
  public changeCalcDirection(value: string){
    this.calcDirection = value;
    this.calcAllUnit();
  }

  // リスト再計算
  private calcAllUnit(): void{
    for(let i = 0; i < this.all_list.length; i++){
      this.all_list[i].affected = this.calcMain(this.g, this.all_list[i].origin);
    }
    // まだ履歴に登録済みでない場合は履歴に追加していく
    if(this.history.findIndex(v=>JSON.stringify(v.affect_unit)===JSON.stringify(this.g) && v.affect_direction == this.calcDirection) == -1){
      let new_history: HistoryUnit = {affect_unit:{size: this.g.size, pos: [].concat(this.g.pos)},
                                      affect_direction: this.calcDirection, is_show: true, pointer2affected_index:[]};
      for(let i = 0; i < this.all_list.length; i++){
        new_history.pointer2affected_index[i] = this.all_list.findIndex(
          v=>JSON.stringify(v.affected)===JSON.stringify(this.all_list[i].origin));
      }
      this.history.push(new_history);
    }
  }

  // 置換のサイズ変更及び再計算
  public changeUnitSize(new_size: number){
    this.size = Number(new_size);
    this.g = {size: this.size, pos: [...Array(this.size).keys()]};
    this.all_list = this.make_all_list(this.size).map(v=>{return {origin: v, affected: this.calcMain(this.g, v)}});
    // 履歴もクリアしてしまう
    this.history.length = 0;
  }

  // 置換計算ラッパー処理
  // 左作用、右作用、共役計算を分ける
  private calcMain(left: ChangeUnit, right: ChangeUnit): ChangeUnit{
    switch (this.calcDirection) {
      case 'left':
        return this.calc(left, right);
      case 'right':
        return this.calc(right, left);
      case 'conjugate':
        return this.calc(left, this.calc(right, this.inverse(left)));
      default:
        break;
    }
  }

  // 置換計算
  // 左からの作用を考えるので右にある置換先を左にある置換で入れ替えていく
  private calc(left: ChangeUnit, right: ChangeUnit): ChangeUnit{
    let return_unit: ChangeUnit = JSON.parse(JSON.stringify(right));
    for(let i = 0; i < left.size; i++){
      return_unit.pos[right.pos.findIndex(v=>v==i)] = left.pos[i];
    }
    return return_unit;
  }

  // 逆置換要素作成
  private inverse(unit: ChangeUnit): ChangeUnit{
    let return_unit: ChangeUnit = {size: unit.size, pos:[]};

    for (let index = 0; index < unit.size; index++) {
      return_unit.pos.push(unit.pos.findIndex(v=>v==index));
    }
    return return_unit;
  }

  // リストを作成する
  private make_all_list(size: number): ChangeUnit[]{
    let base: number[] = [...Array(size).keys()]
    return this.make_change_unit(base, [], []);
  }

  // 置換作成処理
  // やっていることはn個のすべての並べかえを作っている(n!個)
  // 本当はsrcが空になるまでやらなくても良いはずなので多分効率悪いけど見た目が奇麗なのでこのまま
  private make_change_unit(src: number[], cndt: number[], list: ChangeUnit[]): ChangeUnit[]{
    if(src.length == 0){
      list.push({size: cndt.length, pos: cndt})
    }else{
      for (let i = 0; i < src.length; i++) {
        this.make_change_unit(src.filter((v, idx)=>idx!=i), cndt.concat([src[i]]), list)
      }
    }
    return list;
  }
}
