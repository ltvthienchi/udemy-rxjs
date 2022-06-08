import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ExampleOneComponent } from './example-one/example-one.component';
import { ObservableSubscriptionObserverComponent } from './observable-subscription-observer/observable-subscription-observer.component';
import { OperatorObservableComponent } from './operator-observable/operator-observable.component';

@NgModule({
  declarations: [
    AppComponent,
    ExampleOneComponent,
    ObservableSubscriptionObserverComponent,
    OperatorObservableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
