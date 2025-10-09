import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) {}

  // Guardar usuario en localStorage
  registerUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Obtener usuario guardado
  getUser() {
    const data = localStorage.getItem('user');
    return data ? JSON.parse(data) : null;
  }

  // Verificar credenciales al iniciar sesión
  login(email: string, password: string): boolean {
    const user = this.getUser();
    if (user && user.email === email && user.password === password) {
      return true;
    }
    return false;
  }

  // Cerrar sesión
  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
