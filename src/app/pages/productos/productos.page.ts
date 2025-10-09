// src/app/pages/productos/productos.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { MenuComponent } from '../../components/menu/menu.component';
import { HeaderInternoComponent } from '../../components/header-interno/header-interno.component';
import { ProductosService, Producto } from '../../services/productos';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, MenuComponent, HeaderInternoComponent]
})
export class ProductosPage implements OnInit {
  productos: Producto[] = [];
  isLoading = true;

  constructor(private productosService: ProductosService) {}

  async ngOnInit() {
    await this.cargarProductos();
  }

  async cargarProductos() {
    try {
      this.isLoading = true;
      this.productos = await this.productosService.obtenerProductos();
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      this.isLoading = false;
    }
  }
}
