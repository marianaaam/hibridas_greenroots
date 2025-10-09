import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly USER_KEY = 'userData';

  async register(email: string, password: string): Promise<boolean> {
    try {
      // Si el email tiene parte antes de @, úsala como nombre
      const nombre = email.split('@')[0] || 'Usuario';
      const userData = { email, password, nombre };
      localStorage.setItem(this.USER_KEY, JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error('Error al registrar:', error);
      return false;
    }
  }

  async login(email: string, password: string): Promise<boolean> {
    const savedUser = localStorage.getItem(this.USER_KEY);
    if (!savedUser) return false;

    const userData = JSON.parse(savedUser);
    const isValid = userData.email === email && userData.password === password;
    if (isValid) {
      // Si no tiene nombre, lo agregamos y actualizamos el storage
      if (!userData.nombre) {
        userData.nombre = email.split('@')[0] || 'Usuario';
        localStorage.setItem(this.USER_KEY, JSON.stringify(userData));
      }
    }
    return isValid;
  }

  logout() {
    // No borra el usuario, solo podrías marcar un flag de sesión si lo necesitas
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.USER_KEY);
  }
}
