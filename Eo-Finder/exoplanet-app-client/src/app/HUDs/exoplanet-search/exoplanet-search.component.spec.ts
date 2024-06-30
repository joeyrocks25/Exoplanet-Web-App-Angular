import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExoplanetSearchComponent } from './exoplanet-search.component';

describe('ExoplanetSearchComponent', () => {
  let component: ExoplanetSearchComponent;
  let fixture: ComponentFixture<ExoplanetSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExoplanetSearchComponent]
    });
    fixture = TestBed.createComponent(ExoplanetSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
