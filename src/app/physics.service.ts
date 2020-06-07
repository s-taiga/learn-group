import { Injectable } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
/**
 * tensorflowjsを使う際にはtsconfig.jsonでskipLibCheckをtrueにしないとコンパイルが通らない
 */
@Injectable({
  providedIn: 'root'
})
export class PhysicsService {
  // 座標
  private coord: tf.Variable;
  // 引力と斥力係数、負の数が引力、分母に来るので絶対値が小さいほど大きい力
  private attractive_coefficient: tf.Variable;
  // 引力を発生する関係があるかどうか
  private relation_coefficient: tf.Variable;
  // 動かすかどうか
  private movable: tf.Variable;
  // 力の係数
  private force_coefficient: tf.Variable;
  // 現在の速度
  private veloc: tf.Variable;
  // dt、FPS依存にするべきだがめんどいので決め打ち
  private dt: number = 0.01;
  // 減衰係数、速度に比例させる
  private decay_rate: number = 0.7;
  // 引力を反転させる係数
  private attractive_radius: number = 2;

  setCoord(new_coord: number[][]){
    if (this.coord == null) {
      this.coord = tf.variable(tf.tensor(new_coord));
    } else {
      this.coord.dispose();
      this.coord = tf.variable(tf.tensor(new_coord));
    }
  }

  setVelocity(new_velocity: number[][]){
    if (this.veloc == null){
      this.veloc = tf.variable(tf.tensor(new_velocity));
    } else {
      this.veloc.dispose();
      this.veloc = tf.variable(tf.tensor(new_velocity));
    }
  }

  setMovable(new_coef: number[]){
    if (this.movable == null){
      this.movable = tf.variable(tf.tensor(new_coef).as2D(1, -1).tile([new_coef.length, 1]));
    } else {
      this.movable.dispose();
      this.movable = tf.variable(tf.tensor(new_coef).as2D(1, -1).tile([new_coef.length, 1]));
    }
  }

  setAttractiveCoefficient(new_coef: number[]){
    if (this.attractive_coefficient == null){
      this.attractive_coefficient = tf.variable(tf.tensor(new_coef));
    } else {
      this.attractive_coefficient.dispose();
      this.attractive_coefficient = tf.variable(tf.tensor(new_coef));
    }
  }

  setRelationCoefficient(new_coef: number[][]){
    if (this.relation_coefficient == null){
      this.relation_coefficient = tf.variable(tf.tensor(new_coef));
    } else {
      this.relation_coefficient.dispose();
      this.relation_coefficient = tf.variable(tf.tensor(new_coef));
    }
  }

  setForceCoefficient(){
    tf.tidy(() => {
      // 2を掛けて引いているのは基本斥力としているところで引力がある場合には
      const temp_tensor = tf.dot(this.attractive_coefficient.as2D(-1, 1), this.attractive_coefficient.as2D(1, -1))
        .sub(tf.mul(2, this.relation_coefficient))
      if (this.force_coefficient == null){
        this.force_coefficient = tf.variable(temp_tensor);
      } else {
        this.force_coefficient.dispose();
        this.force_coefficient = tf.variable(temp_tensor);
      }
    });
  }

  getCoord(){
    //this.coord.print();
    return this.coord.array();
  }

  calc(){
    tf.tidy(() => {
      const tiled_coord = this.coord.as3D(1, -1, 3).tile([this.coord.shape[0], 1, 1]);
      // 各座標のそれぞれから距離
      const disctances = tiled_coord.sub(tiled_coord.transpose([1, 0, 2]));
      // 力の計算のベース、引力について位置が同じになったときに発散とかするとまずいのでそれっぽい処理に変換
      const force_base = tf.mul(disctances.square().sum(2).sqrt(), this.force_coefficient).mul(this.movable);
      //force_base.print();
      // 力計算
      const force = force_base.mul(-0.1).exp().mul(force_base).mul(0.1).add(0.2)
        .as3D(disctances.shape[0], disctances.shape[1], 1).tile([1, 1, 3]);
      //force.print();
      // 加速度
      const each_force = disctances.mul(force).sum(0).sub(this.veloc.mul(this.decay_rate)).mul(this.dt);
      //each_force.print();
      // 速度を更新
      this.veloc.assign(this.veloc.add(each_force));
      // 座標を更新
      this.coord.assign(this.coord.add(this.veloc.mul(this.dt)));
    })
  }

  constructor() { }

  ngOnDestroy(){
    this.coord.dispose();
    this.attractive_coefficient.dispose();
    this.relation_coefficient.dispose();
    this.veloc.dispose();
    this.force_coefficient.dispose();
    this.movable.dispose();
  }
}
