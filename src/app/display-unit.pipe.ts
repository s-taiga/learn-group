import { Pipe, PipeTransform } from '@angular/core';
import { ChangeUnit } from './change.class';

@Pipe({
  name: 'displayUnit'
})
export class DisplayUnitPipe implements PipeTransform {

  transform(value: ChangeUnit): string {
    let base: boolean[] = Array(value.size).fill(true);
    let base_return: string = '$';
    let idx: number = 0;
    // 全ての要素を走査し終わるまで
    while(base.reduce((pre, cur)=>pre||cur, false) && idx < value.size){
      // もうすでに追加済みであるかどうか
      if(base[idx]){
        base[idx] = false;
        // 変換位置が同じ（移動しない）時でない場合
        if(value.pos[idx] != idx){
          base_return += `(${idx+1}`;
          let current_idx: number = idx;
          // もとの添え字に戻るまで変換先をたどる
          while(value.pos[idx] != current_idx){
            idx = value.pos[idx];
            base[idx] = false;
            base_return += `\\: ${idx+1}`;
          }
          base_return += ')';
          idx = current_idx;
        }
      }
      idx++;
    }
    base_return += '$';
    // 何も追加されない時は恒等置換なのでeを返す
    return base_return.length == 2 ? '$e$' : base_return;
  }

}
