import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MenuComponent } from '../../components/menu/menu.component';
import { HeaderInternoComponent } from '../../components/header-interno/header-interno.component';
import { ProductosService, Producto } from '../../services/productos';
import { CarritoService } from '../../services/carrito';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    IonicModule, 
    MenuComponent,
    HeaderInternoComponent
  ]
})
export class ProductosPage implements OnInit {
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  categorias: string[] = [];
  categoriaSeleccionada: string = 'todos';
  terminoBusqueda: string = '';
  isLoading = true;

  constructor(
    private productosService: ProductosService,
    private carritoService: CarritoService
  ) {}

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
    
    if (categoria === 'todos') {
      this.productosFiltrados = this.productos;
    } else {
      this.productosFiltrados = this.productos.filter(p => p.categoria === categoria);
    }
    
    if (this.terminoBusqueda) {
      this.productosFiltrados = this.productosFiltrados.filter(p =>
        p.nombre.toLowerCase().includes(this.terminoBusqueda.toLowerCase()) ||
        p.descripcion.toLowerCase().includes(this.terminoBusqueda.toLowerCase()) ||
        p.categoria.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
      );
    }
  }

  async buscarProductos() {
    if (this.terminoBusqueda.trim()) {
      this.productosFiltrados = await this.productosService.buscarProductos(this.terminoBusqueda);
    } else {
      this.filtrarProductos(this.categoriaSeleccionada);
    }
  }

  // NUEVO MÉTODO: Agregar al carrito
  async agregarAlCarrito(producto: Producto) {
    try {
      console.log('Agregando al carrito:', producto.nombre);
      
      const resultado = await this.carritoService.agregarProducto(producto, 1);
      
      if (resultado) {
        const stockReducido = await this.productosService.reducirStock(producto.id, 1);
        
        if (stockReducido) {
          await this.cargarProductos();
          this.filtrarProductos(this.categoriaSeleccionada);
          alert(`¡${producto.nombre} agregado al carrito!`);
        } else {
          await this.carritoService.eliminarProducto(producto.id);
          alert('Error: No se pudo actualizar el stock');
        }
      } else {
        alert('No hay suficiente stock disponible');
      }
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      alert('Error al agregar al carrito');
    }
  }

  // Métodos existentes para administración
  async reducirStock(id: number, cantidad: number) {
    try {
      const resultado = await this.productosService.reducirStock(id, cantidad);
      if (resultado) {
        await this.cargarProductos();
        this.filtrarProductos(this.categoriaSeleccionada);
      }
    } catch (error) {
      console.error('Error al reducir stock:', error);
    }
  }

  async aumentarStock(id: number, cantidad: number) {
    try {
      const producto = await this.productosService.obtenerProductoPorId(id);
      if (producto) {
        const nuevoStock = producto.stock + cantidad;
        await this.productosService.actualizarProducto(id, { stock: nuevoStock });
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
        await this.cargarProductos();
        this.filtrarProductos(this.categoriaSeleccionada);
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