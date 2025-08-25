import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LuggageService {
  private readonly baseUrl = 'https://68ab7cac7a0bbe92cbb7a261.mockapi.io/api/1/Luggage'; // capital L

  constructor(private http: HttpClient) {}

  updateRecord(id: string, data: any): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.put(url, data, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

    getById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }
}