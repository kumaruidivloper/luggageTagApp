import { Component, inject , OnInit} from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent
} from '@angular/material/dialog';
import { FormEdit } from './form-edit/form-edit';
import { ChangeDetectorRef } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { LuggageService } from './services/luggage-service'

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
export class App implements OnInit {
  protected title = 'Flight-Luggage-Tracker-App';
  isEditEnabled: boolean = false;
  isEditing: boolean = false;
  passcode: string = 'lavakusa';
  value: string = 'Enter Passcode to enable edit';
  isInvalidPasscode: string = '';
  isPasscodetrue: boolean = false;
  cabinWeight: number = 0;
  checkinWeight: number = 0;

  travelDetails: any;

  constructor(private dialog: MatDialog, private cdr: ChangeDetectorRef, private luggageService: LuggageService) {}

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
        this.getLuggageWeight(result);
        this.cdr.detectChanges();
      }
    });
  }

  ngOnInit(): void {
    this.luggageService.getById('1').subscribe({
    next: (data) => {
      this.travelDetails = data;   // ✅ assign actual data here
      this.getLuggageWeight(data);
      this.cdr.detectChanges();
    },
    error: (err) => console.error('Error loading record:', err)
  });
  }
  
  getLuggageIcon(type: string): string {
  const icons: { [key: string]: string } = {
    'checked': 'card_travel',
    'carry-on': 'card_travel',
    'personal': 'card_travel',
    'oversized': 'card_travel'
  };
  return icons[type] || 'card_travel';
}

//  getDetailIcon(detail) {
//             const icons = {
//                 'number': 'fas fa-hashtag',
//                 'weight': 'fas fa-weight-hanging'
//             };
//             return icons[detail] || 'fas fa-info';
//         }


  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  getLuggageWeight(data: any) {
     this.cabinWeight = 0;
     this.checkinWeight = 0;
     data.luggage.forEach((item: any) => {
        switch(item.type) {
          case 'carry-on':
          this.cabinWeight += item.weight;
          break;
          default:
          this.checkinWeight += item.weight;
        }
          
     });
  }

  getPassCodeValue(value: string) {
     if (this.passcode === value) {
         this.isPasscodetrue = true;
         this.isInvalidPasscode = '';
        setTimeout(() => {
          this.cdr.detectChanges();
        }, 1500);
     } else if(value == ''){
        this.isInvalidPasscode = ''
        this.isPasscodetrue = false;
     } else {
        this.isInvalidPasscode = 'Incorrect Passcode'
     }
  }

  openForm(event: Event) {
    event.preventDefault();
    this.openDialog();
    this.isPasscodetrue = false;
  }
  
}
