import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanetCommentsComponent } from './planet-comments.component';

describe('PlanetCommentsComponent', () => {
  let component: PlanetCommentsComponent;
  let fixture: ComponentFixture<PlanetCommentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlanetCommentsComponent]
    });
    fixture = TestBed.createComponent(PlanetCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
