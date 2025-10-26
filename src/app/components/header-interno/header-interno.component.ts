import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, MenuController } from '@ionic/angular';
import { CarritoService } from '../../services/carrito';

@Component({
  selector: 'app-header-interno',
  templateUrl: './header-interno.component.html',
  styleUrls: ['./header-interno.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class HeaderInternoComponent implements OnInit {
  
  @Input() nombreApp: string = 'GreenRoots';
  @Input() ubicacion: string = 'Bogotá, Colombia';
  @Input() mostrarPerfil: boolean = true;
  @Input() mostrarCarrito: boolean = true;
  
  usuarioActual: any = null;
  cantidadCarrito: number = 0;

  constructor(
    private menuController: MenuController,
    private router: Router,
    private carritoService: CarritoService
  ) {
    this.cargarUsuarioActual();
  }

  async ngOnInit() {
    await this.actualizarCantidadCarrito();
  }

  private cargarUsuarioActual(): void {
    try {
      const usuarioGuardado = localStorage.getItem('usuarioActual');
      if (usuarioGuardado) {
        this.usuarioActual = JSON.parse(usuarioGuardado);
      } else {
        this.usuarioActual = {
          nombres: 'Usuario',
          apellidos: 'Demo'
        };
      }
    } catch (error) {
      this.usuarioActual = {
        nombres: 'Usuario',
        apellidos: 'Demo'
      };
    }
  }

  async actualizarCantidadCarrito() {
    try {
      this.cantidadCarrito = await this.carritoService.obtenerCantidadTotal();
    } catch (error) {
      this.cantidadCarrito = 0;
    }
  }

  abrirMenu(): void {
    this.menuController.open('menu-principal');
  }

  irAPerfil(): void {
    this.router.navigate(['/profile']);
  }

  irAlCarrito(): void {
    this.router.navigate(['/carrito']);
  }

  getNombreCompleto(): string {
  if (this.usuarioActual) {
    // El usuario tiene "nombre" en lugar de "nombres" y "apellidos"
    if (this.usuarioActual.nombre) {
      return this.usuarioActual.nombre;
    } else if (this.usuarioActual.nombres && this.usuarioActual.apellidos) {
      return `${this.usuarioActual.nombres} ${this.usuarioActual.apellidos}`;
    }
  }
  return 'Usuario GreenRoots';
}

  getIniciales(): string {
    if (this.usuarioActual && this.usuarioActual.nombre) {
      // Tomar las primeras dos letras del nombre completo
      const nombre = this.usuarioActual.nombre;
      if (nombre.length >= 2) {
        return nombre.substring(0, 2).toUpperCase();
      } else {
        return nombre.charAt(0).toUpperCase();
      }
    } else if (this.usuarioActual && this.usuarioActual.nombres && this.usuarioActual.apellidos) {
      const inicialNombre = this.usuarioActual.nombres.charAt(0).toUpperCase();
      const inicialApellido = this.usuarioActual.apellidos.charAt(0).toUpperCase();
      return inicialNombre + inicialApellido;
    }
    return 'GR';
  }
}