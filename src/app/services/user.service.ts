import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {concat, forkJoin, Observable, switchAll, switchMap} from "rxjs";
import {User} from "../models/user";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/users';
  constructor(private http: HttpClient) { }
  // Récupérer tous les utilisateurs
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }
  // Ajouter un utilisateur
  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }
  // Mettre à jour un utilisateur par son identifiant
  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${user.id}`, user);
  }
  // Supprimer un utilisateur par son identifiant
  deleteUser(id: number | any): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  // Supprimer tous les utilisateurs
  deleteAllUsers(): Observable<void[]> {
    return this.getUsers().pipe(
      switchMap(users => {
        const batchSize = 5; // Taille du lot de requêtes
        const batches = [];
        for (let i = 0; i < users.length; i += batchSize) {
          const batch = users.slice(i, i + batchSize).map(user => this.deleteUser(user.id));
          batches.push(forkJoin(batch));
        }
        return concat(...batches);
      })
    );
  }


}
