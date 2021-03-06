import { Injectable, OnDestroy, NgZone, ElementRef } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three-orbitcontrols-ts';
import { PhysicsService } from './physics.service';
import { CalcChangeService } from './calc-change.service';
import { RecogUnitStringService } from './recog-unit-string.service';

/**
 * OrbitControlsについて、そのままのソースではスクロールによるzoomが出来ないのでdollyinとdollyoutの関数のif文の条件式を以下のように変更する
 * before: this.object instanceof THREE.PerspectiveCamera
 * after : this.object.type === "PerspectiveCamera"
 * ざっくりだがどうもTHREE.PerspectiveCameraについて別ものとして判断されているッぽい
 * https://github.com/nicolaspanel/three-orbitcontrols-ts/issues/1
 */
@Injectable({
  providedIn: 'root'
})
export class ThreeEngineService {
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private light: THREE.AmbientLight;
  private controls: OrbitControls;
  private raycaster: THREE.Raycaster;
  private mouse: THREE.Vector2;

  private textMesh: THREE.Mesh[];
  private selectedMesh: THREE.Mesh[];
  private textMeshes: THREE.Group[];
  private textGeometry: THREE.TextGeometry[];
  private textMaterial: THREE.MeshStandardMaterial[][];
  private selectedBoxesGeometry: THREE.BoxGeometry[];
  private selectedBoxesMaterial: THREE.MeshPhongMaterial;
  private coord: number[][];
  private velocity: number[][];
  private attractiveCoef: number[];
  private relationCoef: number[][];
  private movableCoef: number[];
  private fontloader: THREE.FontLoader;
  private font: THREE.Font;
  private clickedMesh: THREE.Mesh;
  private arrow: THREE.ArrowHelper[][];

  private frameId: number = null;
  public meshOrder: Object = {};

  private floatingFontSize: 0.5;

  public constructor(private ngZone: NgZone, 
                     private physics: PhysicsService,
                     private service: CalcChangeService) {}

  public ngOnDestroy() {
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId);
    }
  }

  createScene(canvas: ElementRef<HTMLCanvasElement>): void{
    this.canvas = canvas.nativeElement;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      40, window.innerWidth / window.innerHeight, 0.1, 1000
    );
    this.camera.position.z = 25;
    this.camera.position.x = 25;
    this.camera.position.y = 15;
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.scene.add(this.camera);

    // 環境光源
    this.light = new THREE.AmbientLight( 0xffffff );
    this.light.position.z = 10;
    this.scene.add(this.light);

    // 目盛り線
    const gridHelper = new THREE.GridHelper(20, 10, 0xdddddd, 0xdddddd);
    this.scene.add(gridHelper);

    this.textMaterial = [];

    this.selectedBoxesMaterial =  new THREE.MeshPhongMaterial( {
      color: 0x00ffff, 
      opacity: 0, 
      transparent: true 
    });

    this.coord = [[0, 0, 0]];
    this.velocity = [];
    this.relationCoef = [];
    this.textMeshes = [];
    this.textMesh = [];
    this.selectedMesh = [];
    this.textGeometry = [];
    this.selectedBoxesGeometry = [];
    this.arrow = [];

    this.fontloader = new THREE.FontLoader();
    this.fontloader.load('http://localhost:4200/assets/helvetiker_regular.typeface.json', font => {
      this.font = font;
      this.createTextMesh(font);

      this.physics.setCoord(this.coord);
      this.attractiveCoef = new Array(this.coord.length).fill(1);
      this.attractiveCoef[0] = -1;
      this.movableCoef = new Array(this.coord.length).fill(1);
      this.movableCoef[0] = 0;
      for (const _ of this.coord) {
        this.relationCoef.push(new Array(this.coord.length).fill(0));
        this.velocity.push(new Array(3).fill(0));
      }
  
      this.physics.setVelocity(this.velocity);
      this.physics.setAttractiveCoefficient(this.attractiveCoef);
      this.physics.setRelationCoefficient(this.relationCoef);
      this.physics.setMovable(this.movableCoef);
      this.physics.setForceCoefficient();

      this.physics.calc();
  
    });

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableZoom = true;
    this.controls.autoRotate = false;
    this.controls.minDistance = 0;
    this.controls.maxDistance = Infinity;
    this.controls.minZoom = 0;
    this.controls.maxZoom = Infinity;
    this.controls.enabled = true;

    this.raycaster = new THREE.Raycaster();

    this.mouse = new THREE.Vector2();

    this.canvas.addEventListener('mousemove', event => {
      // 型指定しないとoffsetLeftがないと思われてしまう
      const element: HTMLElement = event.currentTarget as HTMLElement;
      const x = event.clientX - element.offsetLeft;
      const y = event.clientY - element.offsetTop;
      const w = element.offsetWidth;
      const h = element.offsetHeight;
      this.mouse.x = (x / w) * 2 - 1;
      this.mouse.y = -(y / h) * 2 + 1;
    });

    this.scene.fog = new THREE.Fog(0xffffff, 5, 100);

  }

  recreateMeshes(): void{
    for(let i=0; i < this.textMeshes.length; i++){
      this.scene.remove(this.textMeshes[i]);
      this.textGeometry[i].dispose();
      this.selectedBoxesGeometry[i].dispose();
      this.textMaterial[i][0].dispose();
      this.textMaterial[i][1].dispose();
    }
    this.textMeshes.length = 0;
    this.textMesh.length = 0;
    this.selectedMesh.length = 0;
    this.textGeometry.length = 0;
    this.selectedBoxesGeometry.length = 0;
    this.textMaterial.length = 0;

    this.coord = [[0, 0, 0]];
    this.velocity = [];
    this.relationCoef = [];

    this.createTextMesh(this.font);

    this.physics.setCoord(this.coord);
    this.attractiveCoef = new Array(this.coord.length).fill(1);
    this.attractiveCoef[0] = -1;
    this.movableCoef = new Array(this.coord.length).fill(1);
    this.movableCoef[0] = 0;
    for (const _ of this.coord) {
      this.relationCoef.push(new Array(this.coord.length).fill(0));
      this.velocity.push(new Array(3).fill(0));
    }

    this.physics.setVelocity(this.velocity);
    this.physics.setAttractiveCoefficient(this.attractiveCoef);
    this.physics.setRelationCoefficient(this.relationCoef);
    this.physics.setMovable(this.movableCoef);
    this.physics.setForceCoefficient();

    this.physics.calc();

  }

  private createTextMesh(font: THREE.Font): void{
    for (let i = 0; i < this.service.all_list.length; i++) {
      const disp_string = RecogUnitStringService.unit2string(this.service.all_list[i].origin);
      this.textGeometry.push(new THREE.TextGeometry(disp_string, {
        font: font,
        size: 0.8,
        height: 0,
        curveSegments: 12
      }));

      this.meshOrder[disp_string] = i;

      this.textMaterial.push([
        new THREE.MeshStandardMaterial({ color: 0x000000 }),
        new THREE.MeshStandardMaterial({ color: 0x000000 })  
      ]);

      this.textMesh.push(new THREE.Mesh(this.textGeometry[i], this.textMaterial[i]));
      this.textMeshes.push(new THREE.Group());
      this.textMeshes[i].add(this.textMesh[i]);

      const box = new THREE.Box3().setFromObject(this.textMesh[i]);
      let target: THREE.Vector3 = new THREE.Vector3();
      let center: THREE.Vector3 = new THREE.Vector3();
      box.getSize(target);
      box.getCenter(center);

      this.selectedBoxesGeometry.push(new THREE.BoxGeometry(target.x+0.5, target.y+0.5, 0.1));
      this.selectedMesh.push(new THREE.Mesh(this.selectedBoxesGeometry[i], this.selectedBoxesMaterial));
      this.selectedMesh[i].position.set(center.x, center.y, center.z);

      this.textMeshes[i].add(this.selectedMesh[i]);
      this.scene.add(this.textMeshes[i]);

      const origin_box = new THREE.Box3().setFromObject(this.textMeshes[i]);
      let set_rotate_center = new THREE.Vector3();
      origin_box.getCenter(set_rotate_center);
      this.textGeometry[i].translate(-set_rotate_center.x, -set_rotate_center.y, -set_rotate_center.z);
      this.selectedBoxesGeometry[i].translate(-set_rotate_center.x, -set_rotate_center.y, -set_rotate_center.z);

      this.textMeshes[i].position.x = (Math.random() - 0.5) * 20;
      this.textMeshes[i].position.y = (Math.random() - 0.5) * 20;
      this.textMeshes[i].position.z = (Math.random() - 0.5) * 20;

      this.coord.push([this.textMeshes[i].position.x, this.textMeshes[i].position.y, this.textMeshes[i].position.z]);
    }
  }

  genarateArrow(): void{
    let box = new THREE.Box3();
    let from_arrow = new THREE.Vector3();
    let to_arrow = new THREE.Vector3();
    const history_idx = this.service.history.length - 1;
    this.arrow.push([]);
    const arrow_idx = this.arrow.length - 1;

    for(let i=0; i<this.service.all_list.length; i++){
      box.setFromObject(this.textMeshes[this.meshOrder[RecogUnitStringService.unit2string(this.service.all_list[i].origin)]]).getCenter(from_arrow);
      box.setFromObject(this.textMeshes[this.meshOrder[RecogUnitStringService.unit2string(this.service.history[history_idx].pointer2affected_string[i])]]).getCenter(to_arrow);
      
      const direction_arrow = to_arrow.clone().sub(from_arrow);
      // Vector3.normalize()は正規化したベクトルを返しつつ、自身を正規化してしまうので長さを先に保持しておく必要がある
      const direction_length = direction_arrow.length();
      this.arrow[arrow_idx].push(
        new THREE.ArrowHelper(direction_arrow.normalize(), from_arrow, direction_length, 0x000000, 1, 0.5)
      );
      this.scene.add(this.arrow[arrow_idx][i]);
    }
  }

  private normalAngle(camera_pos: THREE.Vector3, char_pos: THREE.Vector3): number{
    let tmpV = new THREE.Vector3();
    tmpV.copy(camera_pos);
    tmpV.sub(char_pos);
    tmpV.normalize();

    return Math.atan2(tmpV.x, tmpV.z);
  }

  animate():void{
    this.ngZone.runOutsideAngular(()=>{
      this.render();
    });

    window.addEventListener('resize', () => {
      this.resize();
    });
  }

  render(){
    this.frameId = requestAnimationFrame(() => {
      this.render();
    });

    this.raycaster.setFromCamera(this.mouse, this.camera);

    const intersect = this.raycaster.intersectObjects(this.selectedMesh);
    for (let index = 0; index < this.selectedMesh.length; index++) {
      if( intersect.length > 0 && this.selectedMesh[index] == intersect[0].object){
        this.textMesh[index].material[0].color.setHex(0xff0000);
        this.textMesh[index].material[1].color.setHex(0xff0000);
        this.clickedMesh = this.textMesh[index];
      } else {
        this.textMesh[index].material[0].color.setHex(0x000000);
        this.textMesh[index].material[1].color.setHex(0x000000);
      }
  
      this.textMeshes[index].rotation.y = this.normalAngle(this.camera.position, this.textMeshes[index].position);
    }
    if (intersect.length == 0){
      this.clickedMesh = null;
    }

    this.controls.update();
    this.physics.calc();
    this.physics.getCoord().then((arr: number[][]) => {
      for (let index = 1; index < arr.length; index++) {
        this.textMeshes[index-1].position.x = arr[index][0];
        this.textMeshes[index-1].position.y = arr[index][1];
        this.textMeshes[index-1].position.z = arr[index][2];        
      }

      let box = new THREE.Box3();
      let from_arrow = new THREE.Vector3();
      let to_arrow = new THREE.Vector3();
      
      for(let j=0; j<this.arrow.length; j++){
        for(let i=0; i<this.service.all_list.length; i++){
          box.setFromObject(this.textMeshes[this.meshOrder[RecogUnitStringService.unit2string(this.service.all_list[i].origin)]]).getCenter(from_arrow);
          box.setFromObject(this.textMeshes[this.meshOrder[RecogUnitStringService.unit2string(this.service.history[j].pointer2affected_string[i])]]).getCenter(to_arrow);
          
          this.arrow[j][i].position.set(from_arrow.x, from_arrow.y, from_arrow.z);
          const direction_arrow = to_arrow.clone().sub(from_arrow);
          // Vector3.normalize()は正規化したベクトルを返しつつ、自身を正規化してしまうので長さを先に保持しておく必要がある
          const direction_length = direction_arrow.length();
          this.arrow[j][i].setDirection(direction_arrow.normalize());
          this.arrow[j][i].setLength(direction_length);
        }
      }
    });

    this.renderer.render(this.scene, this.camera);
  }

  setArrowOpacity(): void{
    for(let j=0; j<this.arrow.length; j++){
      for(let i=0; i<this.service.all_list.length; i++){
        // 表示するかどうかの変数を見て透過度を変更
        (this.arrow[j][i].line.material as THREE.LineBasicMaterial).opacity = this.service.history[j].is_show ? 1 : 0;
        (this.arrow[j][i].cone.material as THREE.LineBasicMaterial).opacity = this.service.history[j].is_show ? 1 : 0;
        (this.arrow[j][i].line.material as THREE.LineBasicMaterial).transparent = true;
        (this.arrow[j][i].cone.material as THREE.LineBasicMaterial).transparent = true;
      }
    }
  }

  resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.controls.update();

    this.renderer.setSize( width, height );
  }

}
