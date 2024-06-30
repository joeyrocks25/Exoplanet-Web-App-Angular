import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanetsHudComponent } from './planets-hud.component';

describe('PlanetsHudComponent', () => {
  let component: PlanetsHudComponent;
  let fixture: ComponentFixture<PlanetsHudComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlanetsHudComponent]
    });
    fixture = TestBed.createComponent(PlanetsHudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
