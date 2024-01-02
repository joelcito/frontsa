import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTipoSaneoComponent } from './new-tipo-saneo.component';

describe('NewTipoSaneoComponent', () => {
  let component: NewTipoSaneoComponent;
  let fixture: ComponentFixture<NewTipoSaneoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewTipoSaneoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewTipoSaneoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
