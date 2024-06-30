import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDetailsHudComponent } from './edit-details-hud.component';

describe('EditDetailsHudComponent', () => {
  let component: EditDetailsHudComponent;
  let fixture: ComponentFixture<EditDetailsHudComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditDetailsHudComponent]
    });
    fixture = TestBed.createComponent(EditDetailsHudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
