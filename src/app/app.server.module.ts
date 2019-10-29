import {NgModule} from '@angular/core';
import {ServerModule, ServerTransferStateModule} from '@angular/platform-server';

import {AppModule} from './app.module';
import {AppComponent} from './app.component';
import {ModuleMapLoaderModule} from '@nguniversal/module-map-ngfactory-loader';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  imports: [AppModule, ServerModule, NoopAnimationsModule, ServerTransferStateModule, ModuleMapLoaderModule],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
