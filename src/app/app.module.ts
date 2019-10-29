import {Store} from './store';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppComponent} from './app.component';

// ************* Modules ********************** /
import {AppRoutingModule} from './app-routing.module';
import {ContentModule} from 'content/content.module';

// ************* Components ********************** /
import {HomeComponent} from './home/home.component';
import {NotFoundComponent} from './not-found/not-found.component';
import {NavbarComponent} from 'navbar/navbar.component';

// ************* ANgularFire ********************** /
import {AngularFireModule} from '@angular/fire';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {AngularFirestoreModule} from '@angular/fire/firestore';

// ************* ANgularFire Auth ********************** /
// import { environment } from '../environments/environment';

// ************* Service Worker ********************** /
import {ServiceWorkerModule} from '@angular/service-worker';

import {SharedModule} from './content/shared/shared.module';

@NgModule({
  declarations: [AppComponent, HomeComponent, NotFoundComponent, NavbarComponent],
  imports: [
    BrowserModule.withServerTransition({appId: 'serverApp'}),
    BrowserAnimationsModule,
    CommonModule,
    AppRoutingModule,
    FormsModule, // <-- import the FormsModule before binding with [(ngModel)]
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule, // imports firebase/database, only needed for database features
    // AngularFireAuthModule, imports firebase/auth, only needed for auth features
    AngularFirestoreModule,
    ContentModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
    SharedModule,
  ],
  providers: [Store],
  bootstrap: [AppComponent],
})
export class AppModule {}
