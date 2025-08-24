import { Component, inject } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent
} from '@angular/material/dialog';
import { FormEdit } from './form-edit/form-edit';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss'
})
export class App {
  protected title = 'Flight-Luggage-Tracker-App';
  travelDetails: any = {
    firstName: 'Kumaravel',
    lastName: 'Shanmugam',
    from: 'Bengaluru',
    to: 'Singapore',
    flightService: 'Singapore Airlines',
    hasLayover: true,
    layoverFrom: 'Singapore',
    layoverTo: 'Sydney',
    layoverTime: '12hrs',
    contactNumber: '+919945729262'
  };

  constructor(private dialog: MatDialog, private cdr: ChangeDetectorRef) {}

  openDialog() {
    const dialogRef = this.dialog.open(FormEdit, {
      width: '500px',
      data: this.travelDetails
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        console.log(`Dialog result: ${result}`);
        this.travelDetails = result;
        this.cdr.detectChanges();
      }
      
    });
  }
}
