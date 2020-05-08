import { Injectable } from '@angular/core';
import { ChangeUnit, ShowUnit } from './change.class'

@Injectable({
  providedIn: 'root'
})
export class CalcChangeService {
  // 変換対象のリスト（有限群）
  public all_list: ShowUnit[];
  // 入れ替える文字数
  public size: number = 4;
  // 作用
  public g: ChangeUnit;

  // リスト初期化
  constructor() {
    this.g = {size: this.size, pos: [...Array(this.size).keys()]};
    this.all_list = this.make_all_list(this.size).map(v=>{return {origin: v, affected: this.calc(this.g, v)}});
  }

  // 置換計算
  // 左からの作用を考えるので右にある置換先を左にある置換で入れ替えていく
  private calc(left: ChangeUnit, right: ChangeUnit): ChangeUnit{
    for(let i = left.size; i < left.size; i++){
      right.pos[right.pos.findIndex(v=>v==i)] = left.pos[i];
    }
    return right;
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
