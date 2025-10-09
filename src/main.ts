import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

// 👇 Importa Ionicons y los íconos que usas
import { addIcons } from 'ionicons';
import {
  homeOutline,
  personOutline,
  personCircleOutline,
  settingsOutline,
  logOutOutline,
  receiptOutline,
  cartOutline,
  cubeOutline,
  heartOutline,
  listOutline
} from 'ionicons/icons';

// 👇 Registra los íconos globalmente para evitar los errores en consola
addIcons({
  homeOutline,
  personOutline,
  personCircleOutline,
  settingsOutline,
  logOutOutline,
  receiptOutline,
  cartOutline,
  cubeOutline,
  heartOutline,
  listOutline
});

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ],
});
