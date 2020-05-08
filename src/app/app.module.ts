import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DisplayUnitPipe } from './display-unit.pipe';
import { DisplayMathDirective } from './display-math.directive';
import { MathModule } from './math/math.module';

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
    FormsModule
  ],
  providers: [DisplayUnitPipe],
  bootstrap: [AppComponent]
})
export class AppModule {}
