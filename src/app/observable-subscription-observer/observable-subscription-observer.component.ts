import { Component, OnInit } from '@angular/core';
import {combineLatest, forkJoin, from, fromEvent, Observable, of, Subscription, timer, zip} from 'rxjs';
import {ajax} from 'rxjs/ajax';
import {combineAll, filter, map} from 'rxjs/operators';

@Component({
  selector: 'app-observable-subscription-observer',
  templateUrl: './observable-subscription-observer.component.html',
  styleUrls: ['./observable-subscription-observer.component.scss']
})
export class ObservableSubscriptionObserverComponent implements OnInit {

  private map: Map<unknown, unknown> = new Map<unknown, unknown>();
  private array: any[] = [];
  private observer: any = {};

  constructor() {
    this.initValue();
  }

  ngOnInit(): void {
    // this.exampleOne();
    // this.exampleTwo();
    // this.exampleThree();
    // this.exampleFour();
    // this.exampleFive();
    this.exampleSix();
    // this.exampleSeven();
    // this.exampleEight();
    // this.exampleNine();
    // this.forkJoinExample();
    // this.forkJoinErrorExample();
    // this.zipExample();
    // this.combineLatestExample();
  }

  private initValue(): void {
    // Set value for map
    this.map.set(1, 'one');
    this.map.set(2, 'two');
    this.map.set(3, 'three');

    // Set value for array
    this.array = [1, 2, 3];

    // Set observer
    this.observer = ((nextLabel = 'Next') => {
      return {
        next: value => console.log(nextLabel + ':', value),
          error: err => console.log('Error:', err),
          complete: () => console.log('Completed'),
      };
    });
  }

  public exampleOne(): void {
    const observable$: Observable<string> = new Observable<string>(subscriber => {
      console.log('Observable Executed');
      subscriber.next('One');
      setTimeout(_ => subscriber.next('Two'), 2000);
      setTimeout(_ => subscriber.next('Three'), 4000);
    });

    console.log('Subscription 1 starts!');
    observable$.subscribe(value => console.log('Subscription 1:', value)).unsubscribe();

    setTimeout(_ => {
      console.log('Subscription 2 starts!');
      observable$.subscribe(value => console.log('Subscription 2:', value)).unsubscribe();
    }, 1000);
  }

  // TODO: Observable lifecycle and 3 notification
  public exampleTwo(): void {
    const observable$: Observable<any> = new Observable(subscriber => {
      console.log('Observable executed');
      subscriber.next('Alice');
      subscriber.next('Ben');
      setTimeout(_ => {
        subscriber.next('Charlie');
        // subscriber.complete();
      }, 2000);
      setTimeout(_ => subscriber.error(new Error('Failure')), 4000);
      return () => { console.log('Teardown'); };
    });
    console.log('before subscribe');
    observable$.subscribe(data => {
      console.log('Subscribe:', data);
    }, err => {
      console.log('Error:', err);
    }, () => {
      console.log('Complete');
    });
    console.log('after subscribe');
  }

  // TODO: Unsubscribe a observable
  public exampleThree(): void {
    const observable$: Observable<number> = new Observable<number>(subscriber => {
      let count = 0;
      const interval = setInterval(_ => subscriber.next(++count), 1000);
      setTimeout(_ => {
        // subscriber.complete();
        // clearInterval(interval);
      }, 6000);
      return () => {
        console.log('Teardown');
        clearInterval(interval);
        setTimeout(_ => {
          console.log('Teardown when timer', count);
        }, 2000);
      };
    });

    let totalCount = 0;
    const subscription: Subscription = observable$.subscribe({
      next: value => {
        totalCount += value;
        console.log(value);
      },
      complete: () => console.log('Completed'),
    });

    setTimeout(_ => {
      console.log('Unsubscribe', totalCount);
      subscription.unsubscribe();
    }, 7000);
  }

  // TODO: Hot & cold observable
  public exampleFour(): void {
    const ajax$: any = ajax('https://random-data-api.com/api/name/random_name');
    ajax$.subscribe(data => console.log('Cold 1:', data.response.first_name));
    ajax$.subscribe(data => console.log('Cold 2:', data.response.first_name));
    ajax$.subscribe(data => console.log('Cold 3:', data.response.first_name));

    const click$ = new Observable<MouseEvent>(subscriber => {
      document.addEventListener('click', event => {
        subscriber.next(event);
      });
    });

    click$.subscribe(data => console.log('Hot 1:', data.type, data.x, data.y));
    const click2 = () => {
      console.log('Subscription hot 2 start!');
      click$.subscribe(data => console.log('Hot 2:', data.type, data.x, data.y));
    };
    createSetTimeout(click2, 5000);
    function createSetTimeout(callback: any, duration: number = 0): void {
      setTimeout(callback, duration);
    }
  }

  // TODO: Create Functions: Of
  public exampleFive(): void {
    const observer = {
      next: value => console.log('Next:', value),
      error: err => console.log('Error:', err),
      complete: () => console.log('Completed'),
    };
    const source = of(1, 2, 3);
    const number$ = new Observable<number>(subscriber => {
      subscriber.next(1);
      subscriber.next(2);
      subscriber.next(3);
      subscriber.complete();
    });
    const sourceOwn = ourOwnOf(1, 2, 3);

    console.log('Start observable');
    // source.subscribe(observer);
    // number$.subscribe(observer);
    sourceOwn.subscribe(observer);

    function ourOwnOf(...args: number[]): Observable<number> {
      return new Observable<number>(subscriber => {
        try {
          args.forEach(value => subscriber.next(value));
          subscriber.complete();
        } catch (e) {
          subscriber.error(e);
        }
      });
    }
  }

  // TODO: Create Functions: From & convert promise to observable
  public exampleSix(): void {
    const array = [1, 2, 3];
    const someString = 'world';
    const somePromise = new Promise((resolve, reject) => {
      console.log('Start promise: delay 2s');
      resolve(array);
    });
    const someObservable = from(array);

    console.log('start from PROMISE!');
    let source = from(somePromise);
    source.subscribe(this.observer);

    console.log('start from ARRAY!');
    source = from(array);
    source.subscribe(this.observer);

    console.log('start from STRING!');
    source = from(someString);
    source.subscribe(this.observer);

    console.log('start from MAP!');
    source = from(this.map);
    source.subscribe(this.observer);

    console.log('start from OBSERVABLE!');
    source = from(someObservable);
    source.subscribe(this.observer);
  }

  // TODO: Create Function: fromEvent
  public exampleSeven(): void {
    const fromEventObservable = fromEvent(document, 'click');
    const triggerClick$ = new Observable(subscriber => {
      document.addEventListener('click', (value: MouseEvent) => subscriber.next(value));
      return function unsubscribe(): void {
        document.removeEventListener('click', () => subscriber.complete());
      };
    });
    this.observer.next = (data: MouseEvent) => console.log('Next:', data.type, data.x, data.y);
    // fromEventObservable.subscribe(this.observer);
    const ownClick: Subscription = triggerClick$.subscribe(this.observer);
    setTimeout(_ => ownClick.unsubscribe(), 3000);
  }

  // TODO: Create Function: Timer/Timeout
  public exampleEight(): void {
    console.log('Start!');
    const timer$ = new Observable<number>(subscriber => {
      const timeoutId = setTimeout(() => {
        console.log('Timeout!');
        subscriber.next(0);
        subscriber.complete();
      }, 2000);
      return () => clearTimeout(timeoutId);
    });
    // const subscription = timer(2000).subscribe(this.observer);
    const subscription = timer$.subscribe(this.observer);
    setTimeout(() => {
      subscription.unsubscribe();
      console.log('Unsubscribe');
    }, 1000);
  }

  // TODO: Create Function: interval
  public exampleNine(): void {
    const interval$ = new Observable<number>(subscriber => {
      let counter = 0;
      const intervalId = setInterval(() => {
        counter += (1000 / 1000);
        subscriber.next(counter);
      }, 1000);
      return () => clearInterval(intervalId);
    });
    // const subscription = interval(2000).subscribe(this.observer);
    const subscription = interval$.subscribe(this.observer);
    setTimeout(() => {
      subscription.unsubscribe();
      console.log('Unsubscribe');
    }, 5000);
  }

  // TODO: Create Function: forkJoin
  public forkJoinExample(): void {
    const randomName$ = ajax('https://random-data-api.com/api/name/random_name');
    const randomNation$ = ajax('https://random-data-api.com/api/nation/random_nation');
    const randomFood$ = ajax('https://random-data-api.com/api/food/random_food');
    forkJoin(randomName$, randomNation$, randomFood$).subscribe(
        ([ajaxName, ajaxNation, ajaxFood]) => {
      console.log(`My name is ${ajaxName.response.first_name} from ${ajaxNation.response.capital} and likes to eat ${ajaxFood.response.dish}`);
    });
    forkJoin([of('ABC'), timer(1000)]).subscribe(([text, time]) => {
      console.log(text, time);
    });
  }

  // TODO: Create Function: forkJoin Error
  public forkJoinErrorExample(): void {
    const a$ = new Observable<string>(subscriber => {
      setTimeout(() => {
        subscriber.next('A value');
        subscriber.complete();
      }, 1000);
      return () => console.log('Teardown A!');
    });

    const b$ = new Observable<string>(subscriber => {
      setTimeout(() => {
        subscriber.error('Failure!');
      }, 3000);
      return () => console.log('Teardown B!');
    });

    zip(a$, b$).subscribe(res => console.log(res), err => console.log(err));
  }

  // TODO: Operator Function: Zip
  public zipExample(): void {
    const randomName$ = ajax('https://random-data-api.com/api/name/random_name');
    const randomNation$ = ajax('https://random-data-api.com/api/nation/random_nation');
    const randomFood$ = ajax('https://random-data-api.com/api/food/random_food');
    zip(randomName$, randomNation$, randomFood$).subscribe(
        ([ajaxName, ajaxNation, ajaxFood]) => {
          console.log(`My name is ${ajaxName.response.first_name} from ${ajaxNation.response.capital} and likes to eat ${ajaxFood.response.dish}`);
        });

    // get X/Y coordinates of drag start/finish (mouse down/up)
    const documentEvent = eventName =>
        fromEvent(document, eventName).pipe(
            map((e: MouseEvent) => ({ x: e.clientX, y: e.clientY }))
        );

    zip(documentEvent('mousedown'), documentEvent('mouseup')).subscribe(e =>
        console.log(JSON.stringify(e))
    );
  }

  // TODO: Create Function: CombineLatest
  public combineLatestExample(): void {
    const temperatureInput = document.getElementById('temperature-input');
    const conversionDropdown = document.getElementById('conversion-dropdown');
    const resultText = document.getElementById('result-text');
    const temperatureInput$ = fromEvent(temperatureInput, 'input');
    const conversionDropDown$ = fromEvent(conversionDropdown, 'input');
    combineLatest(temperatureInput$, conversionDropDown$).subscribe(([temperatureEvent, conversionEvent]) => {
      const temperature = Number(temperatureEvent.target['value']);
      const conversion = conversionEvent.target['value'];
      let result: number;
      if (conversion === 'f-to-c') {
        result = (temperature - 32) * 5 / 9;
      } else {
        result = temperature * 9 / 5 + 32;
      }
      resultText.innerText = Math.round(result).toString();
    });
  }
}
