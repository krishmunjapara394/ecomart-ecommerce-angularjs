import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../../services/user/user-service.service';
import { UserFormComponent } from '../user-form/user-form.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../user-deletion-confirmation/user-deletion-confirmation.component';
import { ProfileService } from '../../services/profile/profile.service';

@Component({
  selector: 'app-accounts-overview',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [UserServiceService, ProfileService],
  templateUrl: './accounts-overview.component.html',
})
export class AccountsOverviewComponent implements OnInit {
  allUsers: any[] = [];
  filteredUsers: any[] = [];
  displayedUsers: any[] = [];
  currentPage = 0;
  pageSize = 5;
  selectedUser: any = null;
  searchTerm = '';
  constructor(
    private accountService: UserServiceService,
    private profileService: ProfileService,
    public dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.loadUsers();
  }
  openDialog(user: any) {
    this.selectedUser = user; // Store selected user
    const dialogRef = this.dialog.open(UserFormComponent, {
      panelClass: 'mat-dialog-container-large',
      data: { user: this.selectedUser }, // Pass user data to dialog
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'success') {
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'User Profile Updated Successfully',
        });
        this.loadUsers(); // Reload users to reflect changes
      } else {
        this.loadUsers(); // Reload users to reflect changes
      }
    });
  }

  deleteUser(user: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { username: user.username },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.profileService.adminDeleteUser(user.username).subscribe({
          next: (response) => {
            this.loadUsers();
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'User Profile Deleted Successfully',
            });
          },
          error: (error) => {
            console.error('Error deleting user:', error);
          },
        });
      }
    });
  }

  loadUsers(): void {
    this.accountService.getAllUsers().subscribe({
      next: (response: any) => {
        this.allUsers = response.data;
        this.applyFilter();
      },
      error: (error) => {
        console.log('Error:', error);
      },
    });
  }

  onSearch(): void {
    this.currentPage = 0;
    this.applyFilter();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.onSearch();
  }

  applyFilter(): void {
    if (!this.searchTerm || this.searchTerm.trim() === '') {
      this.filteredUsers = [...this.allUsers];
    } else {
      const term = this.searchTerm.toLowerCase().trim();
      this.filteredUsers = this.allUsers.filter(user =>
        (user.fullName && user.fullName.toLowerCase().includes(term)) ||
        (user.username && user.username.toLowerCase().includes(term)) ||
        (user.email && user.email.toLowerCase().includes(term)) ||
        (user.phone && user.phone.toLowerCase().includes(term)) ||
        (user.role && user.role.toLowerCase().includes(term))
      );
    }
    this.updateDisplayedUsers();
  }

  updateDisplayedUsers(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedUsers = this.filteredUsers.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if ((this.currentPage + 1) * this.pageSize < this.filteredUsers.length) {
      this.currentPage++;
      this.updateDisplayedUsers();
    }
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updateDisplayedUsers();
    }
  }

  // totalPages(): number {
  //   return Math.ceil(this.allUsers.length / this.pageSize);
  // }
}
