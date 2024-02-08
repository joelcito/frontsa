import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioSolicitudDirectiva0082019Component } from './formulario-solicitud-directiva-008-2019.component';

describe('FormularioSolicitudDirectiva0082019Component', () => {
  let component: FormularioSolicitudDirectiva0082019Component;
  let fixture: ComponentFixture<FormularioSolicitudDirectiva0082019Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormularioSolicitudDirectiva0082019Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormularioSolicitudDirectiva0082019Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
