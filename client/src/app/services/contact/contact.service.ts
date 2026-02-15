import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private apiUrl = 'http://localhost:3000/api/contacts';

  constructor(private http: HttpClient) {}

  // Public — submit a contact form
  submitContact(data: {
    name: string;
    email: string;
    category: string;
    message: string;
  }): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  // Admin — get all contacts
  getAllContacts(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Admin — get single contact
  getContact(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Admin — update contact status
  updateStatus(id: string, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/status`, { status });
  }

  // Admin — delete a contact
  deleteContact(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Admin — reply to a contact
  replyToContact(id: string, replyMessage: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/reply`, { replyMessage });
  }
}
