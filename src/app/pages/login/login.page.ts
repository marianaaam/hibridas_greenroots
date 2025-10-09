import { Component } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth'; // ✅ Cambia esta importación

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class LoginPage {
  goToRecover() {
    this.router.navigate(['/recover']);
  }
  goToRegister() {
    this.router.navigate(['/register']);
  }
  email = '';
  password = '';
  isLoading = false;

  constructor(
    private authService: AuthService, // ✅ Ahora usa el servicio correcto
    private toastCtrl: ToastController,
    private router: Router
  ) {}

  async showToast(message: string, color: string = 'danger') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2500,
      position: 'bottom',
      color,
    });
    await toast.present();
  }

  async onLogin() {
    if (!this.email || !this.password) {
      this.showToast('⚠️ Por favor completa todos los campos');
      return;
    }

    this.isLoading = true;

    try {
      // ✅ Ahora usa el mismo servicio que el registro
      const success = await this.authService.login(this.email, this.password);

      if (success) {
        this.showToast('Inicio de sesión exitoso', 'success');
        this.router.navigateByUrl('/productos', { replaceUrl: true });
      } else {
        this.showToast('Credenciales incorrectas');
      }
    } catch (error) {
      console.error('Error en login:', error);
      this.showToast('Error al iniciar sesión');
    } finally {
      this.isLoading = false;
    }
  }
}