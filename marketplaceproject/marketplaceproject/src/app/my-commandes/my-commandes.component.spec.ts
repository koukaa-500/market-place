import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCommandesComponent } from './my-commandes.component';

describe('MyCommandesComponent', () => {
  let component: MyCommandesComponent;
  let fixture: ComponentFixture<MyCommandesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyCommandesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyCommandesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
