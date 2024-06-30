// exoplanet-details.component.ts

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-exoplanet-details',
  templateUrl: './exoplanet-details.component.html',
  styleUrls: ['./exoplanet-details.component.css']
})
export class ExoplanetDetailsComponent {
  constructor(
    public dialogRef: MatDialogRef<ExoplanetDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
