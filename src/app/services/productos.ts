// src/app/services/productos.service.ts
import { Injectable } from "@angular/core";
import { StorageService } from './storage';

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  categoria: string;
  stock: number;
  destacado?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private STORAGE_KEY = 'productos';
  private productos: Producto[] = [];

  constructor(private storageService: StorageService) {
    this.inicializarProductos();
  }

  async inicializarProductos() {
    try {
      const productosGuardados = await this.storageService.get(this.STORAGE_KEY);

      if (productosGuardados && productosGuardados.length > 0) {
        this.productos = productosGuardados;
        console.log('Productos ecológicos cargados del storage', this.productos.length);
      } else {
        console.log('No se encontraron productos en el storage');
        this.productos = this.obtenerProductosPorDefecto();
        await this.guardarProductos();
        console.log('Productos ecológicos por defecto cargados');
      }
    } catch (error) {
      console.error('Error al cargar productos:', error);
      this.productos = this.obtenerProductosPorDefecto();
    }
  }

  private obtenerProductosPorDefecto(): Producto[] {
    return [
      {
        id: 1,
        nombre: 'Botella Reutilizable de Bambú',
        descripcion: 'Botella ecológica de bambú con interior de acero inoxidable. Ideal para mantener bebidas frías o calientes.',
        precio: 42000,
        imagen: 'assets/productos/botella_bambu.png',
        categoria: 'accesorios',
        stock: 20,
        destacado: true
      },
      {
        id: 2,
        nombre: 'Cepillo Dental de Bambú',
        descripcion: 'Cepillo biodegradable con mango de bambú y cerdas suaves ecológicas.',
        precio: 6500,
        imagen: 'assets/productos/cepillo_bambu.jpeg',
        categoria: 'higiene',
        stock: 50,
        destacado: true
      },
      {
        id: 3,
        nombre: 'Bolsa Reutilizable de Algodón',
        descripcion: 'Bolsa 100% algodón orgánico para tus compras diarias. Resistente y lavable.',
        precio: 18000,
        imagen: 'assets/productos/bolsa.png',
        categoria: 'hogar',
        stock: 35
      },
      {
        id: 4,
        nombre: 'Jabón Artesanal Natural',
        descripcion: 'Jabón hecho a mano con ingredientes naturales y aceites esenciales. Sin parabenos.',
        precio: 9000,
        imagen: 'assets/productos/jabon.jpg',
        categoria: 'cuidado personal',
        stock: 45
      },
      {
        id: 5,
        nombre: 'Set de Cubiertos de Bambú',
        descripcion: 'Set portátil de cubiertos ecológicos, incluye cuchillo, tenedor, cuchara y estuche de tela.',
        precio: 25000,
        imagen: 'assets/productos/set_cubiertos.png',
        categoria: 'accesorios',
        stock: 25
      }
    ];
  }

  private async guardarProductos() {
    await this.storageService.set(this.STORAGE_KEY, this.productos);
  }

  // MÉTODOS EXISTENTES
  async obtenerProductos(): Promise<Producto[]> {
    await this.inicializarProductos();
    return [...this.productos];
  }

  async obtenerProductosDestacados(): Promise<Producto[]> {
    await this.inicializarProductos();
    return this.productos.filter(p => p.destacado);
  }

  async obtenerProductoPorId(id: number): Promise<Producto | undefined> {
    await this.inicializarProductos();
    return this.productos.find(p => p.id === id);
  }

  async obtenerCategorias(): Promise<string[]> {
    await this.inicializarProductos();
    const categorias = this.productos.map(p => p.categoria);
    return [...new Set(categorias)];
  }

  // MÉTODOS NUEVOS - COMO LOS DE LA PROFESORA

  // Reducir Stock por compra
  async reducirStock(id: number, cantidad: number): Promise<boolean> {
    try {
      await this.inicializarProductos();
      const producto = this.productos.find(p => p.id === id);

      if (producto && producto.stock >= cantidad) {
        producto.stock -= cantidad;
        await this.guardarProductos();
        console.log(`Stock reducido: ${producto.nombre} - Nuevo stock: ${producto.stock}`);
        return true;
      } else {
        console.warn(`No hay suficiente stock para ${producto?.nombre}`);
        return false;
      }
    } catch (error) {
      console.error('Error al reducir stock:', error);
      return false;
    }
  }

  // Buscar Productos
  async buscarProductos(termino: string): Promise<Producto[]> {
    try {
      await this.inicializarProductos();
      
      const terminoLower = termino.toLowerCase();
      return this.productos.filter(p =>
        p.nombre.toLowerCase().includes(terminoLower) ||
        p.descripcion.toLowerCase().includes(terminoLower) ||
        p.categoria.toLowerCase().includes(terminoLower)
      );
    } catch (error) {
      console.error('Error al buscar productos:', error);
      return [];
    }
  }

  // Eliminar Producto
  async eliminarProducto(id: number): Promise<boolean> {
    try {
      await this.inicializarProductos();
      const index = this.productos.findIndex(p => p.id === id);
      
      if (index !== -1) {
        const productoEliminado = this.productos.splice(index, 1)[0];
        await this.guardarProductos();
        console.log(`Producto eliminado: ${productoEliminado.nombre}`);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      return false;
    }
  }

  // Actualizar Producto
  async actualizarProducto(id: number, datosActualizacion: Partial<Producto>): Promise<boolean> {
    try {
      await this.inicializarProductos();
      const index = this.productos.findIndex(p => p.id === id);
      
      if (index !== -1) {
        this.productos[index] = { ...this.productos[index], ...datosActualizacion };
        await this.guardarProductos();
        console.log(`Producto actualizado: ${this.productos[index].nombre}`);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      return false;
    }
  }

  // Agregar nuevo producto
  async agregarProducto(producto: Omit<Producto, 'id'>): Promise<boolean> {
    try {
      await this.inicializarProductos();
      
      // Generar nuevo ID
      const nuevoId = Math.max(...this.productos.map(p => p.id), 0) + 1;
      
      const nuevoProducto: Producto = {
        ...producto,
        id: nuevoId
      };
      
      this.productos.push(nuevoProducto);
      await this.guardarProductos();
      console.log(`Nuevo producto agregado: ${nuevoProducto.nombre}`);
      return true;
    } catch (error) {
      console.error('Error al agregar producto:', error);
      return false;
    }
  }
}