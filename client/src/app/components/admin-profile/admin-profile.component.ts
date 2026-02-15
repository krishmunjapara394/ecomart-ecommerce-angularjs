import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProfileService } from '../../services/profile/profile.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [ProfileService],
  templateUrl: './admin-profile.component.html',
})
export class AdminProfileComponent implements OnInit {
  adminInfo: any = {};
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  activeTab: 'profile' | 'security' | 'activity' = 'profile';
  isEditing = false;
  isLoading = true;
  isSaving = false;
  isChangingPassword = false;
  imagePreview: string | null = null;

  constructor(
    private profileService: ProfileService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForms();
    this.loadProfile();
  }

  initForms(): void {
    this.profileForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      country: [''],
      city: [''],
      state: [''],
      street1: [''],
      street2: [''],
      zip: [''],
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirm: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  loadProfile(): void {
    this.isLoading = true;
    this.profileService.getProfile().subscribe({
      next: (response: any) => {
        this.adminInfo = response.user || response;
        if (this.adminInfo.image && !this.adminInfo.image.includes('http')) {
          this.adminInfo.image =
            'data:image/png;base64,' + this.adminInfo.image;
        }
        this.populateForm();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  populateForm(): void {
    const addr =
      this.adminInfo.address && this.adminInfo.address.length > 0
        ? this.adminInfo.address[0]
        : {};
    this.profileForm.patchValue({
      fullName: this.adminInfo.fullName || '',
      email: this.adminInfo.email || '',
      phone: this.adminInfo.phone || '',
      country: addr.country || '',
      city: addr.city || '',
      state: addr.state || '',
      street1: addr.street1 || '',
      street2: addr.street2 || '',
      zip: addr.zip || '',
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.populateForm();
    }
  }

  saveProfile(): void {
    if (this.profileForm.invalid) return;
    this.isSaving = true;

    const val = this.profileForm.value;
    const data: any = {
      fullName: val.fullName,
      email: val.email,
      phone: val.phone,
      address: [
        {
          country: val.country,
          city: val.city,
          state: val.state,
          street1: val.street1,
          street2: val.street2,
          zip: val.zip,
        },
      ],
    };

    this.profileService.updateProfile(data).subscribe({
      next: () => {
        this.isSaving = false;
        this.isEditing = false;
        this.loadProfile();
        Swal.fire({
          icon: 'success',
          title: 'Profile Updated',
          text: 'Your profile has been updated successfully.',
          timer: 2000,
          showConfirmButton: false,
        });
      },
      error: () => {
        this.isSaving = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to update profile.',
        });
      },
    });
  }

  changePassword(): void {
    if (this.passwordForm.invalid) return;
    const val = this.passwordForm.value;
    if (val.password !== val.passwordConfirm) {
      Swal.fire({
        icon: 'error',
        title: 'Mismatch',
        text: 'New password and confirmation do not match.',
      });
      return;
    }

    this.isChangingPassword = true;
    this.profileService.updatePassword(val).subscribe({
      next: () => {
        this.isChangingPassword = false;
        this.passwordForm.reset();
        Swal.fire({
          icon: 'success',
          title: 'Password Changed',
          text: 'Your password has been changed successfully.',
          timer: 2000,
          showConfirmButton: false,
        });
      },
      error: (err: any) => {
        this.isChangingPassword = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.error?.message || 'Failed to change password.',
        });
      },
    });
  }

  onImageChange(event: any): void {
    const file = event.target.files?.[0];
    if (file) {
      this.imagePreview = URL.createObjectURL(file);
      this.profileService.updateImage(file).subscribe({
        next: () => {
          this.loadProfile();
          Swal.fire({
            icon: 'success',
            title: 'Image Updated',
            text: 'Profile image has been updated.',
            timer: 2000,
            showConfirmButton: false,
          });
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to update image.',
          });
        },
      });
    }
  }

  getInitials(): string {
    const name = this.adminInfo.fullName || 'A';
    const parts = name.split(' ');
    return parts.length > 1
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : name.charAt(0).toUpperCase();
  }

  getMemberSince(): string {
    if (!this.adminInfo.createdAt) return 'N/A';
    return new Date(this.adminInfo.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  }
}
