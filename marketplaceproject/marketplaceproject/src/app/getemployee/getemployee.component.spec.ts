import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetemployeeComponent } from './getemployee.component';

describe('GetemployeeComponent', () => {
  let component: GetemployeeComponent;
  let fixture: ComponentFixture<GetemployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetemployeeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetemployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
