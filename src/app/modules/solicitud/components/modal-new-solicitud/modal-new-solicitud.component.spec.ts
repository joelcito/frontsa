import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNewSolicitudComponent } from './modal-new-solicitud.component';

describe('ModalNewSolicitudComponent', () => {
  let component: ModalNewSolicitudComponent;
  let fixture: ComponentFixture<ModalNewSolicitudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalNewSolicitudComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalNewSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
