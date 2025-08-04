import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OvervieuwDashComponent } from './overvieuw-dash.component';

describe('OvervieuwDashComponent', () => {
  let component: OvervieuwDashComponent;
  let fixture: ComponentFixture<OvervieuwDashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OvervieuwDashComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OvervieuwDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
