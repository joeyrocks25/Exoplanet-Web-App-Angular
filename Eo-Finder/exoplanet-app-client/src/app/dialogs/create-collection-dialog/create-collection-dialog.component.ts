import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeckService } from 'src/app/services/deck.services';
import { MatSnackBar } from '@angular/material/snack-bar';  // Added import for MatSnackBar

@Component({
  selector: 'app-create-collection-dialog',
  templateUrl: './create-collection-dialog.component.html',
  styleUrls: ['./create-collection-dialog.component.css']
})
export class CreateCollectionDialogComponent {
  collectionForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<CreateCollectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { [key: string]: any },
    private formBuilder: FormBuilder,
    private deckService: DeckService,
    private snackBar: MatSnackBar  // Added MatSnackBar to the constructor
  ) {

    // Initialize the form with validation
    this.collectionForm = this.formBuilder.group({
      collectionName: ['', Validators.required]
    });
  }

  // Getter to easily access form controls in the template
  get formControls() {
    return this.collectionForm.controls;
  }

  // Close the dialog without taking any action
  onNoClick(): void {
    this.dialogRef.close();
  }

  // Method to create a deck when the form is submitted
  createDeck(): void {
    if (this.collectionForm.valid) {
      const collectionName = this.formControls['collectionName'].value;

      this.deckService.createDeck(collectionName).subscribe(() => {
        this.showSnackbar('Collection created successfully', 'success');
        this.dialogRef.close(collectionName);
      }, (error) => {
        console.error('Error creating collection:', error);
        this.showSnackbar('Error creating collection. Please try again.', 'error');
      });
    }
  }

  // Function to show a snackbar with the given message and styling
  private showSnackbar(message: string, panelClass: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: [panelClass],
    });
  }
}
