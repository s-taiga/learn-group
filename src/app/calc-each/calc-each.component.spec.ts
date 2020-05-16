import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalcEachComponent } from './calc-each.component';

describe('CalcEachComponent', () => {
  let component: CalcEachComponent;
  let fixture: ComponentFixture<CalcEachComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalcEachComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalcEachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
