import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-form-edit',
  standalone: false,
  templateUrl: './form-edit.html',
  styleUrl: './form-edit.scss'
})
export class FormEdit {
travelForm: FormGroup;

  flightServices = ['Singapore Airlines', 'Qantas', 'Emirates', 'Etihad'];

  constructor(private fb: FormBuilder,
    private dialogRef: MatDialogRef<FormEdit>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.travelForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      from: ['', Validators.required],
      to: ['', Validators.required],
      flightService: ['', Validators.required],
      hasLayover: [false],
      layoverFrom: [''],
      layoverTo: [''],
      layoverTime: [''],
      contactNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]]
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

  onSubmit() {
    if (this.travelForm.valid) {
      this.dialogRef.close(this.travelForm.value);
      console.log('✅ Travel Details Submitted:', this.travelForm.value);
    } else {
      this.travelForm.markAllAsTouched();
    }
  }

  // convenience getter for template
  get f() {
    return this.travelForm.controls;
  }
}
