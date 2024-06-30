import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisionNotesComponent } from './revision-notes.component';

describe('RevisionNotesComponent', () => {
  let component: RevisionNotesComponent;
  let fixture: ComponentFixture<RevisionNotesComponent>;

  beforeEach(() => {
    console.log('Before each block executed.');

    TestBed.configureTestingModule({
      declarations: [RevisionNotesComponent]
    });
    fixture = TestBed.createComponent(RevisionNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    console.log('Test case "should create" executed.');
    expect(component).toBeTruthy();
  });
});
