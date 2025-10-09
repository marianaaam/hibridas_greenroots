import { Component } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth'; 

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
})
export class RegisterPage {
  formData = {
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
    tipoDocumento: '',
    numeroDocumento: '',
    password: '',
    confirmPassword: ''
  };

  constructor(
    private toastCtrl: ToastController,
    private authService: AuthService, 
    private router: Router
  ) {}

  async showToast(message: string, color: string = 'danger') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2500,
      position: 'bottom',
      color,
      cssClass: 'custom-toast'
    });
    await toast.present();
  }

  private isValidEmail(email: string): boolean {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  }

  private isValidPhone(phone: string): boolean {
    return /^[0-9]{7,10}$/.test(phone);
  }

  private isStrongPassword(password: string): boolean {
    const pattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    return pattern.test(password);
  }

  async onRegister() {
    const f = this.formData;

    // Validaciones (se mantienen igual)
    if (
      !f.nombre || !f.apellido || !f.telefono || !f.email ||
      !f.tipoDocumento || !f.numeroDocumento || !f.password || !f.confirmPassword
    ) {
      this.showToast('Por favor completa todos los campos');
      return;
    }

    if (!this.isValidEmail(f.email)) {
      this.showToast('Ingresa un correo válido');
      return;
    }

    if (!this.isValidPhone(f.telefono)) {
      this.showToast('Ingresa un número de teléfono válido (7 a 10 dígitos)');
      return;
    }

    if (!this.isStrongPassword(f.password)) {
      this.showToast('La contraseña debe tener al menos 6 caracteres y un número');
      return;
    }

    if (f.password !== f.confirmPassword) {
      this.showToast('Las contraseñas no coinciden');
      return;
    }

    // ✅ Ahora usa el método correcto del servicio unificado
    const userData = {
      nombre: f.nombre + ' ' + f.apellido, // Combina nombre y apellido
      email: f.email,
      password: f.password,
      telefono: f.telefono
      // Puedes agregar más campos si los necesitas
    };

    try {
  const registroExitoso = await this.authService.register(userData.email, userData.password);
      
      if (registroExitoso) {
        this.showToast('Registro exitoso', 'success');
        this.router.navigate(['/login']);
      } else {
        this.showToast('El email ya está registrado');
      }
    } catch (error) {
      console.error('Error en registro:', error);
      this.showToast('Error en el registro');
    }
  }
}