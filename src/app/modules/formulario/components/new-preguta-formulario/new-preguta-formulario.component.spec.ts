import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPregutaFormularioComponent } from './new-preguta-formulario.component';

describe('NewPregutaFormularioComponent', () => {
  let component: NewPregutaFormularioComponent;
  let fixture: ComponentFixture<NewPregutaFormularioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewPregutaFormularioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewPregutaFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
