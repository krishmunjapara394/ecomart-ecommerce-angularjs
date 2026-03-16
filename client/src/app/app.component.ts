import { UserServiceService } from './services/user/user-service.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { ContactUsComponent } from './layouts/contact-us/contact-us.component';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    HeaderComponent,
    NavbarComponent,
    FooterComponent,
    ContactUsComponent,
    FormsModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnDestroy {
  showHeaderFooter: boolean = true;
  title = 'client';

  private routerSub!: Subscription;

  constructor(
    private useLog: UserServiceService,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit(): void {
    // Evaluate immediately on app start
    this.updateVisibility();

    // Re-evaluate on every successful navigation so header/footer never get stuck hidden
    this.routerSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateVisibility();
      });
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }

  private updateVisibility(): void {
    // Use location.path() as it is immediately accurate even before router evaluates
    const currentPath = this.location.path();
    this.showHeaderFooter = !currentPath.startsWith('/admin-dashboard');
  }
}
