import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioBajaOrpeNaturalizacionRespuestaComponent } from './formulario-baja-orpe-naturalizacion-respuesta.component';

describe('FormularioBajaOrpeNaturalizacionRespuestaComponent', () => {
  let component: FormularioBajaOrpeNaturalizacionRespuestaComponent;
  let fixture: ComponentFixture<FormularioBajaOrpeNaturalizacionRespuestaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormularioBajaOrpeNaturalizacionRespuestaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormularioBajaOrpeNaturalizacionRespuestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
