import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanetsQuestionsComponent } from './planets-questions.component';

describe('PlanetsQuestionsComponent', () => {
  let component: PlanetsQuestionsComponent;
  let fixture: ComponentFixture<PlanetsQuestionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlanetsQuestionsComponent]
    });
    fixture = TestBed.createComponent(PlanetsQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
