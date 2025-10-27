import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'; // Añade esta importación
import { Producto } from './productos';
import { StorageService } from './storage';

export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private STORAGE_KEY = 'carrito';
  private items: ItemCarrito[] = [];
  
  // NUEVO: BehaviorSubject para el contador
  private contadorCarritoSubject = new BehaviorSubject<number>(0);
  public contadorCarrito$ = this.contadorCarritoSubject.asObservable();

  constructor(private storageService: StorageService) {
    this.inicializarCarrito();
  }

  private async inicializarCarrito() {
    try {
      const carritoGuardado = await this.storageService.get(this.STORAGE_KEY);
      if (carritoGuardado && Array.isArray(carritoGuardado)) {
        this.items = carritoGuardado;
        console.log('Carrito cargado:', this.items.length, 'productos');
      } else {
        this.items = [];
        console.log('Carrito vacío iniciado');
      }
      // NUEVO: Actualizar el contador inicial
      this.actualizarContador();
    } catch (error) {
      console.error('Error al cargar carrito:', error);
      this.items = [];
      this.actualizarContador();
    }
  }

  private async guardarCarrito() {
    try {
      await this.storageService.set(this.STORAGE_KEY, this.items);
      console.log('Carrito guardado');
      // NUEVO: Actualizar contador después de guardar
      this.actualizarContador();
    } catch (error) {
      console.error('Error al guardar carrito:', error);
    }
  }

  // NUEVO: Método para actualizar el contador
  private actualizarContador() {
    const totalItems = this.items.reduce((total, item) => total + item.cantidad, 0);
    this.contadorCarritoSubject.next(totalItems);
    console.log('Contador actualizado:', totalItems);
  }

  async obtenerCarrito(): Promise<ItemCarrito[]> {
    await this.cargarCarrito();
    return [...this.items];
  }

  private async cargarCarrito() {
    try {
      const carritoGuardado = await this.storageService.get(this.STORAGE_KEY);
      if (carritoGuardado && Array.isArray(carritoGuardado)) {
        this.items = carritoGuardado;
      } else {
        this.items = [];
      }
    } catch (error) {
      console.error('Error al cargar carrito:', error);
      this.items = [];
    }
  }

  async agregarProducto(producto: Producto, cantidad: number = 1): Promise<boolean> {
    try {
      await this.cargarCarrito();
      
      if (producto.stock < cantidad) {
        console.warn('Stock insuficiente para', producto.nombre);
        return false;
      }

      const itemExistente = this.items.find(item => item.producto.id === producto.id);
      
      if (itemExistente) {
        const nuevaCantidad = itemExistente.cantidad + cantidad;
        
        if (producto.stock < nuevaCantidad) {
          console.warn('Stock insuficiente para la cantidad solicitada');
          return false;
        }
        
        itemExistente.cantidad = nuevaCantidad;
      } else {
        this.items.push({
          producto: { ...producto },
          cantidad: cantidad
        });
      }
      
      await this.guardarCarrito(); // Esto ya actualiza el contador
      console.log('Producto agregado al carrito:', producto.nombre);
      return true;
    } catch (error) {
      console.error('Error al agregar producto al carrito:', error);
      return false;
    }
  }

  async eliminarProducto(productoId: number): Promise<boolean> {
    try {
      await this.cargarCarrito();
      
      const index = this.items.findIndex(item => item.producto.id === productoId);
      
      if (index !== -1) {
        this.items.splice(index, 1);
        await this.guardarCarrito(); // Actualiza el contador
        console.log('Producto eliminado del carrito');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error al eliminar producto del carrito:', error);
      return false;
    }
  }

  async actualizarCantidad(productoId: number, nuevaCantidad: number): Promise<boolean> {
    try {
      await this.cargarCarrito();
      
      const item = this.items.find(item => item.producto.id === productoId);
      
      if (item) {
        if (nuevaCantidad <= 0) {
          return await this.eliminarProducto(productoId);
        }
        
        if (item.producto.stock < nuevaCantidad) {
          console.warn('Stock insuficiente');
          return false;
        }
        
        item.cantidad = nuevaCantidad;
        await this.guardarCarrito(); // Actualiza el contador
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error al actualizar cantidad:', error);
      return false;
    }
  }

  async vaciarCarrito(): Promise<boolean> {
    try {
      this.items = [];
      await this.guardarCarrito(); // Actualiza el contador
      console.log('Carrito vaciado');
      return true;
    } catch (error) {
      console.error('Error al vaciar carrito:', error);
      return false;
    }
  }

  async obtenerCantidadTotal(): Promise<number> {
    await this.cargarCarrito();
    return this.items.reduce((total, item) => total + item.cantidad, 0);
  }

  async calcularTotal(): Promise<number> {
    await this.cargarCarrito();
    return this.items.reduce((total, item) => {
      return total + (item.producto.precio * item.cantidad);
    }, 0);
  }
}