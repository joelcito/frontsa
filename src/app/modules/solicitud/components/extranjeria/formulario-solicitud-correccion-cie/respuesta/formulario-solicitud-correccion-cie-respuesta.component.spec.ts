import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioSolicitudCorreccionCieRespuestaComponent } from './formulario-solicitud-correccion-cie-respuesta.component';

describe('FormularioSolicitudCorreccionCieRespuestaComponent', () => {
  let component: FormularioSolicitudCorreccionCieRespuestaComponent;
  let fixture: ComponentFixture<FormularioSolicitudCorreccionCieRespuestaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormularioSolicitudCorreccionCieRespuestaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormularioSolicitudCorreccionCieRespuestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
