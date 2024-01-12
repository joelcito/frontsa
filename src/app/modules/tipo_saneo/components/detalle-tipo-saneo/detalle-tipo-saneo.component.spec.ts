import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleTipoSaneoComponent } from './detalle-tipo-saneo.component';

describe('DetalleTipoSaneoComponent', () => {
  let component: DetalleTipoSaneoComponent;
  let fixture: ComponentFixture<DetalleTipoSaneoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetalleTipoSaneoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetalleTipoSaneoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
