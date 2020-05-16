import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calc-each',
  templateUrl: './calc-each.component.html',
  styleUrls: ['./calc-each.component.css']
})
export class CalcEachComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  calc(left: string, right: string){
    console.log("left"+left+"right"+ right);
  }

}
