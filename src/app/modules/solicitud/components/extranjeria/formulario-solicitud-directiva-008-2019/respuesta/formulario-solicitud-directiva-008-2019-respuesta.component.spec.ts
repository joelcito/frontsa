import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioSolicitudDirectiva0082019RespuestaComponent } from './formulario-solicitud-directiva-008-2019-respuesta.component';

describe('FormularioSolicitudDirectiva0082019RespuestaComponent', () => {
  let component: FormularioSolicitudDirectiva0082019RespuestaComponent;
  let fixture: ComponentFixture<FormularioSolicitudDirectiva0082019RespuestaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormularioSolicitudDirectiva0082019RespuestaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormularioSolicitudDirectiva0082019RespuestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
