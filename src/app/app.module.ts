import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DisplayUnitPipe } from './display-unit.pipe';
import { DisplayMathDirective } from './display-math.directive';
import { MathModule } from './math/math.module';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalcAllComponent } from './calc-all/calc-all.component';
import { CalcEachComponent } from './calc-each/calc-each.component';

@NgModule({
  declarations: [
    AppComponent,
    DisplayUnitPipe,
    DisplayMathDirective,
    CalcAllComponent,
    CalcEachComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MathModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSelectModule,
    MatTabsModule,
    DragDropModule
  ],
  providers: [DisplayUnitPipe],
  bootstrap: [AppComponent]
})
export class AppModule {}
