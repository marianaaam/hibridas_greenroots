import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonBackButton, 
  IonButtons,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonThumbnail,
  IonLabel,
  IonText,
  IonNote,
  IonFooter,
  IonGrid,
  IonRow,
  IonCol,
  IonBadge,
  IonSpinner,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  AlertController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  cartOutline, 
  trashOutline, 
  removeOutline, 
  addOutline, 
  storefrontOutline,
  trash
} from 'ionicons/icons';

import { CarritoService, ItemCarrito } from '../../services/carrito';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    // Importar todos los componentes de Ionic que usas
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonBackButton,
    IonButtons,
    IonButton,
    IonIcon,
    IonList,
    IonItem,
    IonThumbnail,
    IonLabel,
    IonText,
    IonNote,
    IonFooter,
    IonGrid,
    IonRow,
    IonCol,
    IonBadge,
    IonSpinner,
    IonItemSliding,
    IonItemOptions,
    IonItemOption
  ]
})
export class CarritoPage implements OnInit {
  carritoItems: ItemCarrito[] = [];
  total: number = 0;
  carritoVacio: boolean = true;
  isLoading: boolean = true;

  constructor(
    private carritoService: CarritoService,
    private alertController: AlertController
  ) {
    // Registrar los íconos que vas a usar
    addIcons({
      'cart-outline': cartOutline,
      'trash-outline': trashOutline,
      'remove-outline': removeOutline,
      'add-outline': addOutline,
      'storefront-outline': storefrontOutline,
      'trash': trash
    });
  }

  async ngOnInit() {
    await this.cargarCarrito();
  }

  ionViewWillEnter() {
    this.cargarCarrito();
  }

  async cargarCarrito() {
    try {
      this.isLoading = true;
      this.carritoItems = await this.carritoService.obtenerCarrito();
      this.total = await this.carritoService.calcularTotal();
      this.carritoVacio = this.carritoItems.length === 0;
    } catch (error) {
      console.error('Error al cargar carrito:', error);
      this.carritoVacio = true;
    } finally {
      this.isLoading = false;
    }
  }

  async aumentarCantidad(item: ItemCarrito) {
    const nuevaCantidad = item.cantidad + 1;
    const exito = await this.carritoService.actualizarCantidad(
      item.producto.id, 
      nuevaCantidad
    );
    
    if (exito) {
      await this.cargarCarrito();
    } else {
      this.mostrarAlertaStock();
    }
  }

  async disminuirCantidad(item: ItemCarrito) {
    const nuevaCantidad = item.cantidad - 1;
    const exito = await this.carritoService.actualizarCantidad(
      item.producto.id, 
      nuevaCantidad
    );
    
    if (exito) {
      await this.cargarCarrito();
    }
  }

  async eliminarProducto(item: ItemCarrito) {
    const exito = await this.carritoService.eliminarProducto(item.producto.id);
    if (exito) {
      await this.cargarCarrito();
    }
  }

  async vaciarCarrito() {
    const alert = await this.alertController.create({
      header: 'Vaciar Carrito',
      message: '¿Estás seguro de que quieres vaciar el carrito?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Vaciar',
          handler: async () => {
            const exito = await this.carritoService.vaciarCarrito();
            if (exito) {
              await this.cargarCarrito();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async mostrarAlertaStock() {
    const alert = await this.alertController.create({
      header: 'Stock Insuficiente',
      message: 'No hay suficiente stock disponible para este producto.',
      buttons: ['OK']
    });

    await alert.present();
  }

  formatPrecio(precio: number): string {
    return `$${precio.toFixed(2)}`;
  }
}