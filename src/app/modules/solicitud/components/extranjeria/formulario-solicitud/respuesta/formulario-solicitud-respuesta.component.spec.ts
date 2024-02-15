import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioSolicitudRespuestaComponent } from './formulario-solicitud-respuesta.component';

describe('FormularioSolicitudRespuestaComponent', () => {
  let component: FormularioSolicitudRespuestaComponent;
  let fixture: ComponentFixture<FormularioSolicitudRespuestaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormularioSolicitudRespuestaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormularioSolicitudRespuestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
