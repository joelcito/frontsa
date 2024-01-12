import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDetalleTipoSaneoComponent } from './new-detalle-tipo-saneo.component';

describe('NewDetalleTipoSaneoComponent', () => {
  let component: NewDetalleTipoSaneoComponent;
  let fixture: ComponentFixture<NewDetalleTipoSaneoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewDetalleTipoSaneoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewDetalleTipoSaneoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
