import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CalcAllComponent } from './calc-all/calc-all.component';
import { CalcEachComponent } from './calc-each/calc-each.component';


const routes: Routes = [
  {path: 'calc-all', component: CalcAllComponent},
  {path: 'calc-each', component: CalcEachComponent},
  {path: '', redirectTo: '/calc-all', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
