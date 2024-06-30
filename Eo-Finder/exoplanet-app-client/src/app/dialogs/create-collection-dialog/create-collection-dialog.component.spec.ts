import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCollectionDialogComponent } from './create-collection-dialog.component';

describe('CreateCollectionDialogComponent', () => {
  let component: CreateCollectionDialogComponent;
  let fixture: ComponentFixture<CreateCollectionDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateCollectionDialogComponent]
    });
    fixture = TestBed.createComponent(CreateCollectionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
