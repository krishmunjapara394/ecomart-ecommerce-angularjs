import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sidebar.component.html',
  styles: ``,
})
export class SidebarComponent {
  @Input() userInfo: any;

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/home';
  }
}
