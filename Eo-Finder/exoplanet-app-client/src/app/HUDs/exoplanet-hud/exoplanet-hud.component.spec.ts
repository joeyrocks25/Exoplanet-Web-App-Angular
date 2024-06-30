import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExoplanetHUDComponent } from './exoplanet-hud.component';

describe('ExoplanetHudComponent', () => {
  let component: ExoplanetHUDComponent;
  let fixture: ComponentFixture<ExoplanetHUDComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExoplanetHUDComponent]
    });
    fixture = TestBed.createComponent(ExoplanetHUDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
