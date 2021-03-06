import { Component, OnInit } from '@angular/core';
import {EMPTY, fromEvent, interval, observable, Observable, Observer, of} from 'rxjs';
import {catchError, debounceTime, filter, map, take, tap, concatMap} from 'rxjs/operators';
import {ajax, AjaxResponse} from "rxjs/ajax";

@Component({
  selector: 'app-operator-observable',
  templateUrl: './operator-observable.component.html',
  styleUrls: ['./operator-observable.component.scss']
})
export class OperatorObservableComponent implements OnInit {

  public observer: any;

  constructor() {
    this.initValue();
  }

  ngOnInit(): void {
    // this.demoFilter();
    // this.demoMap();
    // this.demoTap();
    // this.demoDebounceTime();
    // this.demoCatchErrorAndEMPTY();
    this.dynamicHttpRequest();
  }

  private initValue(): void {
    // Set observer
    this.observer = {
        next: value => console.log('==> Next' + ':', value),
        error: err => console.log('Error:', err),
        complete: () => console.log('Completed'),
      };
  }

  demoFilter(): void {
    const interval$ = interval(1000);
    interval$.pipe(
        take(10),
        filter(item => item % 2 === 0)
    ).subscribe(count => console.log(count));
  }

  demoMap(): void {
    const obs: Observable<number> = new Observable<number>(observe => {
      observe.next(1);
      observe.next(2);
      observe.complete();
    });
    obs.pipe(map(item => item * 2)).subscribe(this.observer);
  }

  demoTap(): void {
    of(1, 7, 3, 6, 2).pipe(
        // tap(value => console.log(value)),
        map(value => value * 2),
        tap(value => console.log('Tap: ', value)),
        filter(value => value > 5),
    ).subscribe(this.observer);
  }

  demoDebounceTime(): void {
    const sliderInput = document.querySelector('input#slider');
    fromEvent(sliderInput, 'change').pipe(
        map(value => value.target['value']),
        debounceTime(200),
    ).subscribe(this.observer);
  }

  demoCatchErrorAndEMPTY(): void {
    const failureObservable$ = new Observable(subscriber => {
      let count = 0;
      const intervalId = setInterval(value => {
        ++count;
        subscriber.next(count);
      }, 1000);
      setTimeout(_ => subscriber.error(new Error('Timeout!')), 3000);
      return () => { clearInterval(intervalId); };
    });

    failureObservable$.pipe(
        // catchError(error => of(error)),
        catchError(error => EMPTY),
    ).subscribe(this.observer);
  }

  demoFlatteningOperators(): void {
    const source$ = new Observable(subscriber => {
      setTimeout(() => subscriber.next('A'), 1000);
      setTimeout(() => subscriber.next('B'), 3000);
    });

    source$.pipe(
        concatMap(value => of(1, 2))
    ).subscribe(this.observer);
  }

  dynamicHttpRequest(): void {
    const endpointInput: HTMLInputElement = document.querySelector('input#endpoint');
    const fetchButton = document.querySelector('button#fetch');
    fromEvent(fetchButton, 'click').pipe(
        map(_ => endpointInput.value),
        concatMap(value =>
            ajax(`https://random-data-api.com/api/${value}/random_${value}`).pipe(
                // catchError(_ => EMPTY),
                catchError(err => of('Inner: ' + err))
            )
        ),
        map((value: AjaxResponse) => value),
        // catchError(err => EMPTY),
    ).subscribe(this.observer);
  }
}
