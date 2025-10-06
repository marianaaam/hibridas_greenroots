import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderInternoComponent } from 'src/app/components/header-interno/header-interno.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,   
  imports: [
    IonicModule,      
    CommonModule,
    RouterModule,
    HeaderInternoComponent
  ]
})
export class HomePage {}
