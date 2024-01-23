import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PregutaFormularioComponent } from './preguta-formulario.component';

describe('PregutaFormularioComponent', () => {
  let component: PregutaFormularioComponent;
  let fixture: ComponentFixture<PregutaFormularioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PregutaFormularioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PregutaFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
