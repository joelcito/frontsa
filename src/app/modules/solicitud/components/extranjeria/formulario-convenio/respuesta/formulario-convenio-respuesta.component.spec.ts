import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioConvenioRespuestaComponent } from './formulario-convenio-respuesta.component';

describe('FormularioConvenioRespuestaComponent', () => {
  let component: FormularioConvenioRespuestaComponent;
  let fixture: ComponentFixture<FormularioConvenioRespuestaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormularioConvenioRespuestaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormularioConvenioRespuestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
