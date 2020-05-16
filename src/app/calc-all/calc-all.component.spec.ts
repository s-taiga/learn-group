import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalcAllComponent } from './calc-all.component';

describe('CalcAllComponent', () => {
  let component: CalcAllComponent;
  let fixture: ComponentFixture<CalcAllComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalcAllComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalcAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
