import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstructionStepComponent } from './construction-step.component';

describe('ConstructionStepComponent', () => {
  let component: ConstructionStepComponent;
  let fixture: ComponentFixture<ConstructionStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConstructionStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConstructionStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
