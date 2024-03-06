import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioBajaOrpeNaturalizacionComponent } from './formulario-baja-orpe-naturalizacion.component';

describe('FormularioBajaOrpeNaturalizacionComponent', () => {
  let component: FormularioBajaOrpeNaturalizacionComponent;
  let fixture: ComponentFixture<FormularioBajaOrpeNaturalizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormularioBajaOrpeNaturalizacionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormularioBajaOrpeNaturalizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
