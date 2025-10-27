import { Component } from '@angular/core';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonList, IonItem, IonIcon, IonButton, IonChip, IonLabel } from '@ionic/angular/standalone';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonMenuButton,
    IonList,
    IonItem,
    IonIcon,
    IonButton,
    IonChip,
    IonLabel
  ]
})
export class ProfilePage {
  
  constructor() { }

  // Método para manejar la edición del perfil
  onEditProfile() {
    console.log('Editar perfil');
    // Aquí puedes implementar la lógica para editar el perfil
  }

  // Método para cambiar la foto de perfil
  onChangePhoto() {
    console.log('Cambiar foto de perfil');
    // Implementar lógica para cambiar foto
  }
}