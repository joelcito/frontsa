import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentoDetalleTipoSaneoComponent } from './documento-detalle-tipo-saneo.component';

describe('DocumentoDetalleTipoSaneoComponent', () => {
  let component: DocumentoDetalleTipoSaneoComponent;
  let fixture: ComponentFixture<DocumentoDetalleTipoSaneoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentoDetalleTipoSaneoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DocumentoDetalleTipoSaneoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
