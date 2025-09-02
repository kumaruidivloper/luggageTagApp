import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LuggageService {
  //bsbkumarmax https://mockapi.io/
  private readonly baseUrl = 'https://68b65070e5dc090291b15920.mockapi.io/luggage'; 

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