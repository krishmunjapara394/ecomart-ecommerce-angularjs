import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ContactService } from '../../services/contact/contact.service';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact-us.component.html',
  styles: ``
})
export class ContactUsComponent {
  contactForm: FormGroup;
  submitted = false;
  sending = false;
  success = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private contactService: ContactService) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      category: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]],
      terms: [false, Validators.requiredTrue],
    });
  }

  get f() {
    return this.contactForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = '';
    if (this.contactForm.invalid) return;

    this.sending = true;

    const { name, email, category, message } = this.contactForm.value;

    this.contactService.submitContact({ name, email, category, message }).subscribe({
      next: () => {
        this.sending = false;
        this.success = true;
        this.contactForm.reset();
        this.submitted = false;

        setTimeout(() => {
          this.success = false;
        }, 5000);
      },
      error: (err) => {
        this.sending = false;
        this.errorMessage = err?.error?.message || 'Something went wrong. Please try again.';

        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
      },
    });
  }
}
