import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExoplanetDetailsComponent } from './exoplanet-details.component';

describe('ExoplanetDetailsComponent', () => {
  let component: ExoplanetDetailsComponent;
  let fixture: ComponentFixture<ExoplanetDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExoplanetDetailsComponent]
    });
    fixture = TestBed.createComponent(ExoplanetDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
