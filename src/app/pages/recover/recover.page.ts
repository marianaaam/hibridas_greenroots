import { Component } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recover',
  templateUrl: './recover.page.html',
  styleUrls: ['./recover.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class RecoverPage {
  goToLogin() {
    this.router.navigate(['/login']);
  }
  email = '';
  message = '';
  success = false;

  constructor(private toastCtrl: ToastController, private router: Router) {}

  async onSubmit() {
    if (!this.email) {
      this.message = 'Por favor ingresa tu correo.';
      this.success = false;
      return;
    }
    // Simulación: solo valida si el correo está en localStorage
    const userData = localStorage.getItem('userData');
    if (userData && JSON.parse(userData).email === this.email) {
      this.message = 'Te hemos enviado un correo para recuperar tu contraseña.';
      this.success = true;
    } else {
      this.message = 'No se encontró una cuenta con ese correo.';
      this.success = false;
    }
  }
}
