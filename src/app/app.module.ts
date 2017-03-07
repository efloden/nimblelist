import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { ItemFormComponent } from './item-form.component'
import { OrderByPipe } from './orderby-pipe.component';
import { MaterialModule } from '@angular/material';
import { LocalStorageService, LOCAL_STORAGE_SERVICE_CONFIG } from 'angular-2-local-storage';
import {
  AngularFireModule,
  AuthMethods,
  AuthProviders
} from "angularfire2";

// Create config options (see ILocalStorageServiceConfigOptions) for deets:
let localStorageServiceConfig = {
    prefix: 'my-app',
    storageType: 'sessionStorage'
};

// Must export the config
export const firebaseConfig = {
  apiKey: "AIzaSyC1El82G3drBmmdsfVGryUVueaEK9jASx8",
  authDomain: "nimblelist-5848a.firebaseapp.com",
  databaseURL: "https://nimblelist-5848a.firebaseio.com",
  storageBucket: "nimblelist-5848a.appspot.com",
  messagingSenderId: "655874835247"
};

@NgModule({
  declarations: [
    AppComponent,
    ItemFormComponent,
    OrderByPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig,{
      provider: AuthProviders.Google,
      method: AuthMethods.Popup
    })
  ],
  providers: [
    LocalStorageService,
        {
            provide: LOCAL_STORAGE_SERVICE_CONFIG, useValue: localStorageServiceConfig
        }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
