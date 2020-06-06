import { Pipe, PipeTransform } from '@angular/core';
import { ChangeUnit } from './change.class';
import { RecogUnitStringService } from './recog-unit-string.service';

/**
 * 置換の配列表現を一般的な置換表現に変換
 * recog-unit-string.service.tsと真逆
 * 表示するときだけ必要な処理なのでパイプで実装
 */
@Pipe({
  name: 'displayUnit'
})
export class DisplayUnitPipe implements PipeTransform {

  transform(value: ChangeUnit): string {
    return RecogUnitStringService.unit2string(value);
  }

}
