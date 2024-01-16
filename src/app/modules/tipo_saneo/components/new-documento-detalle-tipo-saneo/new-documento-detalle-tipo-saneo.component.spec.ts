import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDocumentoDetalleTipoSaneoComponent } from './new-documento-detalle-tipo-saneo.component';

describe('NewDocumentoDetalleTipoSaneoComponent', () => {
  let component: NewDocumentoDetalleTipoSaneoComponent;
  let fixture: ComponentFixture<NewDocumentoDetalleTipoSaneoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewDocumentoDetalleTipoSaneoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewDocumentoDetalleTipoSaneoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
