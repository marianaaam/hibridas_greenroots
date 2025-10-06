import { Component } from '@angular/core';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

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

  constructor(private toastCtrl: ToastController) {}

  async showToast(message: string, color: string = 'danger') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2500,
      position: 'bottom',
      color, // danger, success, warning, etc.
      cssClass: 'custom-toast'
    });
    await toast.present();
  }

  async onRegister() {
    if (
      !this.formData.nombre ||
      !this.formData.apellido ||
      !this.formData.telefono ||
      !this.formData.email ||
      !this.formData.tipoDocumento ||
      !this.formData.numeroDocumento ||
      !this.formData.password ||
      !this.formData.confirmPassword
    ) {
      this.showToast('⚠️ Por favor completa todos los campos');
      return;
    }

    if (this.formData.password !== this.formData.confirmPassword) {
      this.showToast('❌ Las contraseñas no coinciden');
      return;
    }

    this.showToast('✅ Registro exitoso', 'success');
    console.log('Registro exitoso', this.formData);
  }
}
