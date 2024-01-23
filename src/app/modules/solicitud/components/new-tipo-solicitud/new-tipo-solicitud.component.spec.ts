import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTipoSolicitudComponent } from './new-tipo-solicitud.component';

describe('NewTipoSolicitudComponent', () => {
  let component: NewTipoSolicitudComponent;
  let fixture: ComponentFixture<NewTipoSolicitudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewTipoSolicitudComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewTipoSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
