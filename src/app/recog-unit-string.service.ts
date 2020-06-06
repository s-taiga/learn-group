import { Injectable } from '@angular/core';
import { ChangeUnit } from './change.class';
/**
 * 置換表現を配列に変換
 * display-unit.pipe.tsと真逆の処理
 */
@Injectable({
  providedIn: 'root'
})
export class RecogUnitStringService {

  constructor() { }

  // 置換表現を配列に変換する
  // 本当なら文法チェックを行うべきだが、多分間違えないだろうとしてチェックしない
  // 最低限おかしい数字のみが来ている時のみ弾く
  static reshapeUnitString(base_sentence: string, size: number): number[]{
    let return_array: number[] = [...Array(size).keys()];

    // 受け取った文字列がeだった場合には恒等置換なのでreturn_arrayをそのまま返す
    if (base_sentence == 'e'){
      return return_array;
    }

    // 文字列中の左カッコと一番最後の右カッコを消してから個別の置換に分割
    // さらに個別の置換を分割して数値にキャストしてから1引く（添え字として用いるため）
    let change_units: number[][] = base_sentence.replace(/\(|\)$/g, '')
                                                .split(')')
                                                .map(
                                                  v=>v.split(' ')
                                                      .map(v_=>Number(v_)-1)
                                                );
    for (const each_unit of change_units) {
      let ref_array: number[] = [...return_array];
      // 一つでも配列外の数もしくはNaNがあった場合には恒等置換を返す
      if(each_unit.reduce((pre, cur)=>pre||(cur>=size || cur<0 || Number.isNaN(cur)), false)){
        return [...Array(size).keys()];
      }

      // return_arrayの要素を置換していく
      for(let i = 1; i < each_unit.length; i++){
        return_array[ref_array.findIndex(v=>v==each_unit[i-1])] = each_unit[i];
      }
      return_array[ref_array.findIndex(v=>v==each_unit[each_unit.length-1])] = each_unit[0];
    }

    return return_array;
  }

  static unit2string(unit: ChangeUnit): string{
    let base: boolean[] = Array(unit.size).fill(true);
    let base_return: string = '';
    let idx: number = 0;
    // 全ての要素を走査し終わるまで
    while(base.reduce((pre, cur)=>pre||cur, false) && idx < unit.size){
      // もうすでに追加済みであるかどうか
      if(base[idx]){
        base[idx] = false;
        // 変換位置が同じ（移動しない）時でない場合
        if(unit.pos[idx] != idx){
          base_return += `(${idx+1}`;
          let current_idx: number = idx;
          // もとの添え字に戻るまで変換先をたどる
          while(unit.pos[idx] != current_idx){
            idx = unit.pos[idx];
            base[idx] = false;
            base_return += ` ${idx+1}`;
          }
          base_return += ')';
          idx = current_idx;
        }
      }
      idx++;
    }
    base_return += '';
    // 何も追加されない時は恒等置換なのでeを返す
    return base_return.length == 0 ? 'e' : base_return;
  }
  
}
