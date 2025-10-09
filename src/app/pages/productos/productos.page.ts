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
  imports: [CommonModule, IonicModule, MenuComponent]
})
export class ProductosPage implements OnInit {
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  categorias: string[] = [];
  categoriaSeleccionada: string = 'todos';
  isLoading = true;

  constructor(private productosService: ProductosService) {}

  async ngOnInit() {
    await this.cargarProductos();
    await this.cargarCategorias();
    this.filtrarProductos('todos');
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

  async cargarCategorias() {
    this.categorias = await this.productosService.obtenerCategorias();
  }

  filtrarProductos(categoria: string) {
    this.categoriaSeleccionada = categoria;
    if (categoria === 'todos') {
      this.productosFiltrados = this.productos;
    } else {
      this.productosFiltrados = this.productos.filter(p => p.categoria === categoria);
    }
  }
}
