import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MenuComponent } from '../../components/menu/menu.component';
import { ProductosService, Producto } from '../../services/productos';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    IonicModule, 
    MenuComponent
  ]
})
export class ProductosPage implements OnInit {
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  categorias: string[] = [];
  categoriaSeleccionada: string = 'todos';
  terminoBusqueda: string = '';
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
      this.productosFiltrados = this.productos;
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
    
    let productosFiltrados = this.productos;
    
    if (categoria !== 'todos') {
      productosFiltrados = productosFiltrados.filter(p => p.categoria === categoria);
    }
    
    if (this.terminoBusqueda) {
      productosFiltrados = productosFiltrados.filter(p =>
        p.nombre.toLowerCase().includes(this.terminoBusqueda.toLowerCase()) ||
        p.descripcion.toLowerCase().includes(this.terminoBusqueda.toLowerCase()) ||
        p.categoria.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
      );
    }
    
    this.productosFiltrados = productosFiltrados;
  }

  async buscarProductos() {
    if (this.terminoBusqueda.trim()) {
      this.productosFiltrados = await this.productosService.buscarProductos(this.terminoBusqueda);
    } else {
      this.filtrarProductos(this.categoriaSeleccionada);
    }
  }

  async reducirStock(id: number, cantidad: number) {
    try {
      const resultado = await this.productosService.reducirStock(id, cantidad);
      if (resultado) {
        console.log('Stock reducido exitosamente');
        await this.cargarProductos();
        this.filtrarProductos(this.categoriaSeleccionada);
      } else {
        console.error('No hay suficiente stock o el producto no existe');
      }
    } catch (error) {
      console.error('Error al reducir stock:', error);
    }
  }

  // MÉTODO FALTANTE - AGREGAR STOCK
  async aumentarStock(id: number, cantidad: number) {
    try {
      const producto = await this.productosService.obtenerProductoPorId(id);
      if (producto) {
        const nuevoStock = producto.stock + cantidad;
        await this.productosService.actualizarProducto(id, { stock: nuevoStock });
        console.log('Stock aumentado exitosamente');
        await this.cargarProductos();
        this.filtrarProductos(this.categoriaSeleccionada);
      }
    } catch (error) {
      console.error('Error al aumentar stock:', error);
    }
  }

  async eliminarProducto(id: number) {
    try {
      const resultado = await this.productosService.eliminarProducto(id);
      if (resultado) {
        console.log('Producto eliminado exitosamente');
        await this.cargarProductos();
        this.filtrarProductos(this.categoriaSeleccionada);
      } else {
        console.error('Error al eliminar el producto');
      }
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  }

  async confirmarEliminacion(producto: Producto) {
    if (confirm(`¿Estás seguro de que quieres eliminar "${producto.nombre}"?`)) {
      await this.eliminarProducto(producto.id);
    }
  }

  limpiarBusqueda() {
    this.terminoBusqueda = '';
    this.filtrarProductos(this.categoriaSeleccionada);
  }
}