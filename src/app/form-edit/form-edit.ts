import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LuggageService } from './../services/luggage-service';
import { ChangeDetectorRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-form-edit',
  standalone: false,
  templateUrl: './form-edit.html',
  styleUrl: './form-edit.scss'
})
export class FormEdit implements OnInit {
travelForm: FormGroup;
recordId: string = '1';
travelDetails: any;
isSubmitting: boolean = false;

  flightServices = ['Singapore Airlines', 'Qantas', 'Emirates', 'Etihad'];

  constructor(private fb: FormBuilder,
    private dialogRef: MatDialogRef<FormEdit>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private luggageService: LuggageService,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {
    this.travelForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      from: ['', Validators.required],
      dot: ['', Validators.required],
      to: ['', Validators.required],
      flightService: ['', Validators.required],
      hasLayover: [false],
      layoverFrom: [''],
      layoverTo: [''],
      layoverTime: [''],
      email: ['', [Validators.required, Validators.email]],
      contactNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],
      luggage: this.fb.array([])
    });

    // Dynamically add validation when layover is checked
    this.travelForm.get('hasLayover')?.valueChanges.subscribe((checked) => {
      if (checked) {
        this.travelForm.get('layoverFrom')?.setValidators([Validators.required]);
        this.travelForm.get('layoverTo')?.setValidators([Validators.required]);
        this.travelForm.get('layoverTime')?.setValidators([Validators.required, Validators.min(1)]);
      } else {
        this.travelForm.get('layoverFrom')?.clearValidators();
        this.travelForm.get('layoverTo')?.clearValidators();
        this.travelForm.get('layoverTime')?.clearValidators();
      }

      this.travelForm.get('layoverFrom')?.updateValueAndValidity();
      this.travelForm.get('layoverTo')?.updateValueAndValidity();
      this.travelForm.get('layoverTime')?.updateValueAndValidity();
    });
  }

  // Get the luggage FormArray
get luggageArray(): FormArray {
  return this.travelForm.get('luggage') as FormArray;
}

      // Create a single luggage FormGroup
 createLuggageGroup(): FormGroup {
  return this.fb.group({
    luggageNumber: ['', Validators.required],
    weight: ['', [Validators.required, Validators.min(1)]],
    type: ['', Validators.required],
    info: ['', Validators.required]
  });
}

    // Add new luggage item
addLuggage(event: Event): void {
  event.preventDefault();
  this.luggageArray.push(this.createLuggageGroup());
}

// Remove luggage item
removeLuggage(index: number, event: Event): void {
  event.preventDefault();
  this.luggageArray.removeAt(index);
}

onSubmit() {
    if (this.travelForm.valid) {
      // Set loading state
      this.isSubmitting = true;
      
      const payload = this.travelForm.value;

      this.luggageService.updateRecord(this.recordId, payload).subscribe({
        next: (updated) => {
          this.isSubmitting = false; // Reset loading state
          
          this.snackBar.open('Travel details updated successfully!', 'Close', {
            duration: 5000,
            panelClass: ['success-snackbar']
          });
          
          console.log('✅ Travel Details Submitted:', this.travelForm.value);
          console.log('Success:', updated);
          
          this.dialogRef.close(this.travelForm.value);
        },
        error: (err) => {
          this.isSubmitting = false; // Reset loading state
          
          this.snackBar.open('Failed to update travel details. Please try again.', 'Close', {
            duration: 7000,
            panelClass: ['error-snackbar']
          });
          
          console.error('Error:', err);
        }
      });
    } else {
      this.travelForm.markAllAsTouched();
      this.snackBar.open('Please fill in all required fields correctly.', 'Close', {
        duration: 4000,
        panelClass: ['warning-snackbar']
      });
    }
  }

  // convenience getter for template
  get f() {
    return this.travelForm.controls;
  }

  ngOnInit(): void {
      this.luggageService.getById('1').subscribe({
      next: (data) => {
        this.travelDetails = data;   // ✅ assign actual data here
        this.patchFormWithData(data);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading record:', err)
      });
  }

  patchFormWithData(data: any): void {
  // Patch regular form controls
  this.travelForm.patchValue({
    firstName: data.firstName || '',
    lastName: data.lastName || '',
    from: data.from || '',
    to: data.to || '',
    flightService: data.flightService || '',
    hasLayover: data.hasLayover || false,
    layoverFrom: data.layoverFrom || '',
    layoverTo: data.layoverTo || '',
    layoverTime: data.layoverTime || '',
    contactNumber: data.contactNumber || '',
    dot: data.dot || '',
    email: data.email || '',
  });

  // Handle FormArray separately
  this.patchLuggageArray(data);
}

patchLuggageArray(data: any): void {
   // Handle luggage FormArray
    const luggageArray = this.travelForm.get('luggage') as FormArray;
    luggageArray.clear();
    
    if (data.luggage?.length > 0) {
      data.luggage.forEach((item: any) => {
        luggageArray.push(this.fb.group({
          luggageNumber: [item.luggageNumber || '', Validators.required],
          weight: [item.weight || '', [Validators.required, Validators.min(1)]],
          type: [item.type || '', Validators.required],
          info: [item.info || '', Validators.required]
        }));
      });
    } else {
    }
  }

}
