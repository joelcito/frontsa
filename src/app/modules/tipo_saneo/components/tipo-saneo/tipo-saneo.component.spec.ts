import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoSaneoComponent } from './tipo-saneo.component';

describe('TipoSaneoComponent', () => {
  let component: TipoSaneoComponent;
  let fixture: ComponentFixture<TipoSaneoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TipoSaneoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TipoSaneoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
