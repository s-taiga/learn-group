import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {MatButtonToggleModule} from '@angular/material/button-toggle';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DisplayUnitPipe } from './display-unit.pipe';
import { DisplayMathDirective } from './display-math.directive';
import { MathModule } from './math/math.module';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    DisplayUnitPipe,
    DisplayMathDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MathModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatButtonToggleModule
  ],
  providers: [DisplayUnitPipe],
  bootstrap: [AppComponent]
})
export class AppModule {}
