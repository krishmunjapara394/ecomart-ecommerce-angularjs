import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { UserServiceService } from '../../services/user/user-service.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styles: ``,
  providers: [UserServiceService],
})
export class SignupComponent {
  signupForm: FormGroup;
  signupError = '';
  constructor(
    private fb: FormBuilder,
    private userService: UserServiceService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      passwordConfirm: ['', Validators.required],
    });
  }
  onSubmit(): void {
    if (this.signupForm.valid) {
      this.signupError = '';
      const formData = this.signupForm.value;
      this.userService.signup(formData).subscribe({
        next: (response) => {
          console.log('Signup successful:', response);
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.log('signup failed:', error);
          this.signupError = error?.error?.message || 'Registration failed. Please try again.';
        },
      });
    }
  }
}
