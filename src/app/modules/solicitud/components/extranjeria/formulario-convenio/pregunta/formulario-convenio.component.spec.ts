import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioConvenioComponent } from './formulario-convenio.component';

describe('FormularioConvenioComponent', () => {
  let component: FormularioConvenioComponent;
  let fixture: ComponentFixture<FormularioConvenioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormularioConvenioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormularioConvenioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
