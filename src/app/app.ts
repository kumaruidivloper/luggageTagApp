import { Component, ElementRef, inject , OnDestroy, OnInit, ViewChild, HostListener} from '@angular/core';
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
export class App implements OnInit, OnDestroy {
  protected title = 'Flight-Luggage-Tracker-App';
  @ViewChild('passcode') passcode!: ElementRef<HTMLInputElement>;
  @ViewChild('lockdiv') lockdiv!: ElementRef<HTMLInputElement>;
  isEditEnabled: boolean = false;
  isEditing: boolean = false;
  value: string = 'Enter Passcode to enable edit';
  isInvalidPasscode: string = '';
  isPasscodetrue: boolean = false;
  cabinWeight: number = 0;
  checkinWeight: number = 0;
  count: number = 0;
  isLock: boolean = false;
  private shakeInterval: any;
  isLoading: boolean = true;
  tokenValue: string = ''

  travelDetails: any;

  constructor(private dialog: MatDialog, private cdr: ChangeDetectorRef, private luggageService: LuggageService) {
  }

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
    if(sessionStorage.getItem('isLock')) {
      this.isLock = true;
      this.startShakeLoop();
    } else {
      this.isLock = false;
    }
    this.luggageService.getById('1').subscribe({
      next: (data) => {
      this.travelDetails = data;   // ✅ assign actual data here
      this.tokenValue = this.travelDetails?.macMask;
      this.isLoading = false;
      this.getLuggageWeight(data);
      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error('Error loading record:', err);
      this.isLoading = false;
    }   
    });
 }

  startShakeLoop() {
  this.shakeInterval = setInterval(() => {
    this.lockdiv?.nativeElement.classList.add('shake');
    
    // Remove shake after animation completes (500ms based on your CSS)
    setTimeout(() => {
      this.lockdiv?.nativeElement.classList.remove('shake');
    }, 500);
  }, 2000); // Shake every 2 seconds
}

stopShakeLoop() {
  if (this.shakeInterval) {
    clearInterval(this.shakeInterval);
    this.shakeInterval = null;
  }
}


ngOnDestroy(): void {
  this.stopShakeLoop(); // Clean up on component destroy
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
    if(this.passcode) {
      this.passcode.nativeElement.value = '';
    }
    this.isInvalidPasscode = '';
    this.isPasscodetrue = false;

    document.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        this.isEditing = false;
        this.isLock = false
      }
    });
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
     if (this.maskMac(btoa(value)) === this.maskMac(this.rearrangeChars('F2Wt2E', this.tokenValue))) {
         this.isPasscodetrue = true;
         this.count = 0;
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

     if(value.length > 7) {
        this.count++;
        if(this.count > 10) {
           this.isLock = true;
           sessionStorage.setItem('isLock', 'true');
           setInterval(() => {
            this.lockdiv?.nativeElement.classList.add('shake');
            this.lockdiv?.nativeElement.classList.remove('shake');
           },2000)   
        } 
     } 
  }

  private maskMac(value: string) {
      return atob(value);
  }

rearrangeChars(str1: string, str2: string) {
    let allChars = (str1 + str2).split('');
    let rearranged = [allChars[6],allChars[7],allChars[0],allChars[1],allChars[9],allChars[2],allChars[3],allChars[10],allChars[11],allChars[1],allChars[5],allChars[8]].join('');
    return rearranged;
}


  openForm(event: Event) {
    event.preventDefault();
    this.openDialog();
    this.isPasscodetrue = false;
     if(this.passcode) {
      this.passcode.nativeElement.value = '';
    }
    this.isInvalidPasscode = '';
    this.isEditing = !this.isEditing;
  }
  
}
