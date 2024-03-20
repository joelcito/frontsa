import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignacionSolicitudDependenciaComponent } from './asignacion-solicitud-dependencia.component';

describe('AsignacionSolicitudDependenciaComponent', () => {
  let component: AsignacionSolicitudDependenciaComponent;
  let fixture: ComponentFixture<AsignacionSolicitudDependenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AsignacionSolicitudDependenciaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AsignacionSolicitudDependenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
