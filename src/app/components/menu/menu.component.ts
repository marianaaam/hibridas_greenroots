import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { IonButton, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonMenu, IonTitle, IonToolbar, MenuController } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { bagHandle, grid, heart, home, list, logOut, person, personCircle, settings } from "ionicons/icons";
import { AuthService, Usuario } from "src/app/services/auth";

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss'],
    standalone: true,
    imports: [
      IonMenu,
      IonContent,
      IonHeader,
      IonToolbar,
      IonTitle,
      IonList,
      IonIcon,
      IonItem,
      IonLabel,
      IonButton,
      CommonModule
    ]
  })
  export class MenuComponent implements OnInit {
    usuario: Usuario | null=null;

    constructor(
      private authService: AuthService,
      private router: Router,
      private menuController: MenuController
    ){
      addIcons({ home, grid,list,heart,bagHandle,settings,person,personCircle,logOut});
    }

    async ngOnInit() {
      this.usuario = await this.authService.obtenerUsuarioActual();
    }

    async navergarA(ruta:string){
      await this.menuController.close('main-menu');
      this.router.navigate([ruta]);
    }

    async cerrarSesion(){
      await this.menuController.close('main-menu');
      await this.authService.logout();
     
  }
}

    