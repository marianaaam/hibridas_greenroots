import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from './storage';

export interface Usuario {
  nombre: string;
  email: string;
  password: string;
  telefono?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usuarioActual: Usuario | null = null;

  constructor(
    private storageService: StorageService,
    private router: Router
  ) { }

  async registrar(usuario: Usuario): Promise<boolean> {
    try {
      const usuarios = await this.storageService.get('usuarios') || [];
      
      const existe = usuarios.find((u: Usuario) => u.email === usuario.email);
      if (existe) {
        return false;
      }

      usuarios.push(usuario);
      await this.storageService.set('usuarios', usuarios);
      return true;
    } catch (error) {
      console.error('Error al registrar:', error);
      return false;
    }
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      const usuarios = await this.storageService.get('usuarios') || [];
      const usuario = usuarios.find((u: Usuario) => 
        u.email === email && u.password === password
      );

      if (usuario) {
        this.usuarioActual = usuario;
        await this.storageService.set('usuarioActual', usuario);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      return false;
    }
  }

  async logout() {
    this.usuarioActual = null;
    await this.storageService.remove('usuarioActual');
    this.router.navigate(['/bienvenida']);
  }

  async estaAutenticado(): Promise<boolean> {
    const usuario = await this.storageService.get('usuarioActual');
    return usuario !== null;
  }

  async obtenerUsuarioActual(): Promise<Usuario | null> {
    if (!this.usuarioActual) {
      this.usuarioActual = await this.storageService.get('usuarioActual');
    }
    return this.usuarioActual;
  }
}