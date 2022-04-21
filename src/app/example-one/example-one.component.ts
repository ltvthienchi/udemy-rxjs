import { Component, OnInit } from '@angular/core';
import {Observable, of} from 'rxjs';

@Component({
  selector: 'app-example-one',
  templateUrl: './example-one.component.html',
  styleUrls: ['./example-one.component.scss']
})
export class ExampleOneComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    name$.subscribe(value => console.log(value))
    storeDataOnServer('Some value').subscribe({
      next: value => console.log(value),
      complete: () => console.log('complete'),
      error: err => console.log(err),
    });
  }

}

export const name$ = of('Alice', 'Ben', 'Charlie');

export function storeDataOnServer(data: string): Observable<string> {
  return new Observable(subscriber => {
    setTimeout(() => {
      subscriber.next(`Saved successfully: ${data}`);
      subscriber.complete();
    }, 5000);
  });
}

export function storeDataOnServerError(data: string): Observable<string> {
  return new Observable(subscriber => {
    setTimeout(() => {
      subscriber.error(new Error('Failure!'));
    }, 5000);
  });
}
