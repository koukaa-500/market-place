import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistreSocieteComponent } from './registre-societe.component';

describe('RegistreSocieteComponent', () => {
  let component: RegistreSocieteComponent;
  let fixture: ComponentFixture<RegistreSocieteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistreSocieteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistreSocieteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
