import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-settings.component.html',
})
export class AdminSettingsComponent implements OnInit {
  activeSection = 'general';

  settings = {
    siteName: 'EcoMart',
    siteDescription: 'Your one-stop eco-friendly marketplace',
    currency: 'INR',
    language: 'English',
    timezone: 'Asia/Kolkata',
    emailNotifications: true,
    orderAlerts: true,
    lowStockAlerts: true,
    newUserAlerts: false,
    maintenanceMode: false,
    enableRegistration: true,
    requireEmailVerification: true,
    maxLoginAttempts: 5,
    sessionTimeout: 30,
    itemsPerPage: 10,
    darkMode: false,
    compactView: false,
  };

  sections = [
    { id: 'general', label: 'General', icon: 'tune' },
    { id: 'notifications', label: 'Notifications', icon: 'notifications' },
    { id: 'security', label: 'Security', icon: 'security' },
    { id: 'appearance', label: 'Appearance', icon: 'palette' },
  ];

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    const saved = localStorage.getItem('adminSettings');
    if (saved) {
      this.settings = { ...this.settings, ...JSON.parse(saved) };
    }
  }

  saveSettings(): void {
    localStorage.setItem('adminSettings', JSON.stringify(this.settings));
    Swal.fire({
      icon: 'success',
      title: 'Settings Saved',
      text: 'Your settings have been updated successfully.',
      timer: 2000,
      showConfirmButton: false,
    });
  }

  resetSettings(): void {
    Swal.fire({
      title: 'Reset Settings?',
      text: 'This will restore all settings to default values.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, reset!',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('adminSettings');
        this.ngOnInit();
        Swal.fire({
          icon: 'success',
          title: 'Reset Complete',
          text: 'Settings have been restored to defaults.',
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  }
}
