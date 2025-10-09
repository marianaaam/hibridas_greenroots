import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonRouterOutlet,
  IonIcon
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
  IonMenu,
  IonHeader,
  IonToolbar,
  IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonRouterOutlet,
    IonIcon
  ],
})
export class MenuComponent implements OnInit {
  usuario: any = null;

  ngOnInit() {
    let usuarioSeguro = { nombre: 'Usuario', email: '' };
    try {
      const datos = localStorage.getItem('userData');
      if (datos) {
        const parsed = JSON.parse(datos);
        usuarioSeguro = {
          nombre: parsed.nombre || (parsed.email ? parsed.email.split('@')[0] : 'Usuario'),
          email: parsed.email || ''
        };
      }
    } catch (e) {
    }
    this.usuario = usuarioSeguro;
  }

  logout() {
    window.location.href = '/login';
  }
}
