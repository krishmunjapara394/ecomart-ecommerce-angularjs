import { Component } from '@angular/core';
import { ProfileService } from '../../services/profile/profile.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-information',
  standalone: true,
  imports: [
    LoadingSpinnerComponent,
    RouterModule,
    CommonModule,
  ],
  providers: [ProfileService],
  templateUrl: './profile-information.component.html',
})
export class ProfileInformationComponent {
  userInfo: any = {};
  isLoading = true;
  constructor(
    public profileService: ProfileService,
    public router: ActivatedRoute
  ) {
    this.profileService.getProfile().subscribe({
      next: (data: any) => {
        if (data.image) {
          if (!data.image.startsWith('http')) {
            data.image = 'data:image/png;base64,' + data.image;
          }
        } else {
          data.image =
            'https://cdn-icons-png.freepik.com/256/12225/12225773.png?semt=ais_hybrid';
        }
        this.userInfo = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
