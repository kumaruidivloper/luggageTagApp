import { Component, inject } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent
} from '@angular/material/dialog';
import { FormEdit } from './form-edit/form-edit';
import { ChangeDetectorRef } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0, transform: 'scale(0.95)' }))
      ])
    ])
  ]
})
export class App {
  protected title = 'Flight-Luggage-Tracker-App';
  isEditEnabled: boolean = false;
  isEditing: boolean = false;
  passcode: string = 'lavakusa';
  value: string = 'Enter Passcode to enable edit';
  isInvalidPasscode: string = '';
  isPasscodetrue: boolean = false;

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
      width: '950px',
    maxWidth: '95vw', // Responsive max width
    height: '600px',   // Optional height
    panelClass: 'custom-dialog-container', // Optional custom CSS class
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


  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  getPassCodeValue(value: string) {
     if (this.passcode === value) {
         this.isPasscodetrue = true;
         this.isInvalidPasscode = '';
        setTimeout(() => {
          this.openDialog();
          this.isPasscodetrue = false;
        }, 1500);
     } else if(value == ''){
        this.isInvalidPasscode = ''
     } else {
        this.isInvalidPasscode = 'Incorrect Passcode'
     }
  }
}
