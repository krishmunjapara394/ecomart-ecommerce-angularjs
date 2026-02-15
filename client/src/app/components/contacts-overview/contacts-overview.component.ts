import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../services/contact/contact.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contacts-overview',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contacts-overview.component.html',
})
export class ContactsOverviewComponent implements OnInit {
  allContacts: any[] = [];
  filteredContacts: any[] = [];
  displayedContacts: any[] = [];
  currentPage = 0;
  pageSize = 8;
  searchTerm = '';
  statusFilter = '';
  selectedContact: any = null;
  isLoading = true;
  replyText = '';
  replySending = false;
  showReplyBox = false;

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts(): void {
    this.isLoading = true;
    this.contactService.getAllContacts().subscribe({
      next: (response: any) => {
        this.allContacts = response.data;
        this.applyFilter();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading contacts:', error);
        this.isLoading = false;
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

  onStatusFilter(): void {
    this.currentPage = 0;
    this.applyFilter();
  }

  applyFilter(): void {
    let filtered = [...this.allContacts];

    // Status filter
    if (this.statusFilter) {
      filtered = filtered.filter((c) => c.status === this.statusFilter);
    }

    // Search filter
    if (this.searchTerm && this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (c) =>
          (c.name && c.name.toLowerCase().includes(term)) ||
          (c.email && c.email.toLowerCase().includes(term)) ||
          (c.category && c.category.toLowerCase().includes(term)) ||
          (c.message && c.message.toLowerCase().includes(term))
      );
    }

    this.filteredContacts = filtered;
    this.updateDisplayed();
  }

  updateDisplayed(): void {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.displayedContacts = this.filteredContacts.slice(start, end);
  }

  nextPage(): void {
    if ((this.currentPage + 1) * this.pageSize < this.filteredContacts.length) {
      this.currentPage++;
      this.updateDisplayed();
    }
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updateDisplayed();
    }
  }

  openDetail(contact: any): void {
    this.selectedContact = contact;
    this.replyText = '';
    this.showReplyBox = false;
    // Mark as read if new
    if (contact.status === 'new') {
      this.contactService.updateStatus(contact._id, 'read').subscribe({
        next: () => {
          contact.status = 'read';
        },
      });
    }
  }

  closeDetail(): void {
    this.selectedContact = null;
    this.replyText = '';
    this.showReplyBox = false;
  }

  toggleReplyBox(): void {
    this.showReplyBox = !this.showReplyBox;
    if (this.showReplyBox) {
      this.replyText = '';
    }
  }

  sendReply(): void {
    if (!this.replyText || !this.replyText.trim()) return;

    this.replySending = true;
    this.contactService.replyToContact(this.selectedContact._id, this.replyText.trim()).subscribe({
      next: (response: any) => {
        this.replySending = false;
        this.selectedContact.adminReply = this.replyText.trim();
        this.selectedContact.repliedAt = new Date().toISOString();
        this.selectedContact.status = 'replied';
        this.replyText = '';
        this.showReplyBox = false;
        Swal.fire({
          icon: 'success',
          title: 'Reply Sent!',
          text: `Email reply sent to ${this.selectedContact.email}`,
          timer: 2000,
          showConfirmButton: false,
        });
      },
      error: (err) => {
        this.replySending = false;
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: err?.error?.message || 'Failed to send reply. Please try again.',
        });
      },
    });
  }

  updateStatus(contact: any, status: string): void {
    this.contactService.updateStatus(contact._id, status).subscribe({
      next: () => {
        contact.status = status;
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: `Status changed to ${status}`,
          timer: 1500,
          showConfirmButton: false,
        });
      },
      error: (err) => {
        console.error('Error updating status:', err);
      },
    });
  }

  deleteContact(contact: any): void {
    Swal.fire({
      title: 'Delete Message?',
      text: `Delete contact from ${contact.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete',
    }).then((result) => {
      if (result.isConfirmed) {
        this.contactService.deleteContact(contact._id).subscribe({
          next: () => {
            this.allContacts = this.allContacts.filter(
              (c) => c._id !== contact._id
            );
            this.applyFilter();
            if (this.selectedContact?._id === contact._id) {
              this.selectedContact = null;
            }
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Message deleted successfully',
              timer: 1500,
              showConfirmButton: false,
            });
          },
          error: (err) => {
            console.error('Error deleting contact:', err);
          },
        });
      }
    });
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      new: 'bg-blue-100 text-blue-700',
      read: 'bg-amber-100 text-amber-700',
      replied: 'bg-emerald-100 text-emerald-700',
      archived: 'bg-slate-100 text-slate-700',
    };
    return colors[status] || 'bg-slate-100 text-slate-700';
  }

  getStatusDot(status: string): string {
    const dots: { [key: string]: string } = {
      new: 'bg-blue-500',
      read: 'bg-amber-500',
      replied: 'bg-emerald-500',
      archived: 'bg-slate-500',
    };
    return dots[status] || 'bg-slate-500';
  }

  getCategoryLabel(category: string): string {
    const labels: { [key: string]: string } = {
      delivery: 'Delivery & Shipping',
      support: 'Product Support',
      orders: 'Orders & Returns',
      careers: 'Careers',
      partnership: 'Partnership & Business',
      feedback: 'Feedback & Suggestions',
      other: 'Other',
    };
    return labels[category] || category;
  }

  getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      delivery: 'local_shipping',
      support: 'support_agent',
      orders: 'receipt_long',
      careers: 'work',
      partnership: 'handshake',
      feedback: 'rate_review',
      other: 'help_outline',
    };
    return icons[category] || 'mail';
  }

  get newCount(): number {
    return this.allContacts.filter((c) => c.status === 'new').length;
  }
}
