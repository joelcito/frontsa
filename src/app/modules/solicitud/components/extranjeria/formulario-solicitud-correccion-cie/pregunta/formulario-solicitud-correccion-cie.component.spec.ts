import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioSolicitudCorreccionCieComponent } from './formulario-solicitud-correccion-cie.component';

describe('FormularioSolicitudCorreccionCieComponent', () => {
  let component: FormularioSolicitudCorreccionCieComponent;
  let fixture: ComponentFixture<FormularioSolicitudCorreccionCieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormularioSolicitudCorreccionCieComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormularioSolicitudCorreccionCieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
