import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../services/profile/profile.service';
import { Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    LoadingSpinnerComponent,
    RouterModule,
  ],
  providers: [ProfileService],
  templateUrl: './edit-profile.component.html',
})
export class EditProfileComponent implements OnInit {
  userForm: FormGroup;
  fileToUpload: File | null = null;
  userInfo: any = {};
  isLoading = true;
  constructor(
    private profileService: ProfileService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.userForm = this.formBuilder.group({});
    this.profileService.getProfile().subscribe({
      next: (data: any) => {
        if (data.image) {
          if (data.image.startsWith('http')) {
            // keep as-is
          } else {
            data.image = 'data:image/png;base64,' + data.image;
          }
        } else {
          data.image = 'https://cdn-icons-png.freepik.com/256/12225/12225773.png?semt=ais_hybrid';
        }
        this.userInfo = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  ngOnInit() {
    this.userForm = this.formBuilder.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      phone: ['', Validators.required],
      image: [''],
    });

    this.profileService.getProfile().subscribe({
      next: (data) => {
        this.userForm.patchValue(data);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      const updatedUserData = this.userForm.value;
      const formData = new FormData();

      for (const key in updatedUserData) {
        formData.append(key, updatedUserData[key]);
      }

      if (this.fileToUpload) {
        formData.append('image', this.fileToUpload);
      }
      this.profileService.updateProfile(updatedUserData).subscribe({
        next: (response) => {
          console.log('Profile updated successfully:', response);
          this.router.navigate(['/profile/information']);
        },
        error: (error) => {
          console.error('Error updating profile:', error);
        },
      });
    }
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length) {
      this.fileToUpload = event.target.files[0];
      this.profileService.updateImage(this.fileToUpload).subscribe({
        next: (response) => {
          window.location.reload();
        },
        error: (error) => {
          console.error('Error updating image:', error);
        },
      });
    } else {
      this.fileToUpload = null;
    }
  }
}
