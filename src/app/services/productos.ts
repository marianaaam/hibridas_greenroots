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
        precio: 85,
        imagen: 'assets/productos/botella_bambu.jpg',
        categoria: 'accesorios',
        stock: 20,
        destacado: true
      },
      {
        id: 2,
        nombre: 'Cepillo Dental de Bambú',
        descripcion: 'Cepillo biodegradable con mango de bambú y cerdas suaves ecológicas.',
        precio: 25,
        imagen: 'assets/fonodo.jpg',
        categoria: 'higiene',
        stock: 50,
        destacado: true
      },
      {
        id: 3,
        nombre: 'Bolsa Reutilizable de Algodón',
        descripcion: 'Bolsa 100% algodón orgánico para tus compras diarias. Resistente y lavable.',
        precio: 40,
        imagen: 'assets/productos/bolsa_algodon.jpg',
        categoria: 'hogar',
        stock: 35
      },
      {
        id: 4,
        nombre: 'Jabón Artesanal Natural',
        descripcion: 'Jabón hecho a mano con ingredientes naturales y aceites esenciales. Sin parabenos.',
        precio: 18,
        imagen: 'assets/productos/jabon_artesanal.jpg',
        categoria: 'cuidado personal',
        stock: 45
      },
      {
        id: 5,
        nombre: 'Set de Cubiertos de Bambú',
        descripcion: 'Set portátil de cubiertos ecológicos, incluye cuchillo, tenedor, cuchara y estuche de tela.',
        precio: 30,
        imagen: 'assets/productos/cubiertos_bambu.jpg',
        categoria: 'accesorios',
        stock: 25
      }
    ];
  }

  private async guardarProductos() {
    await this.storageService.set(this.STORAGE_KEY, this.productos);
  }

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
}