import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import 'rxjs/add/operator/pluck';
import 'rxjs/add/operator/distinctUntilChanged';

import { State } from 'state';
import { Injectable } from "@angular/core";

const state: State = {
    user: undefined,
    blog: undefined


};

@Injectable()
export class Store {
    private subject = new BehaviorSubject<State>(state);
    private store = this.subject.asObservable().distinctUntilChanged();

    get value() {
        return this.subject.value;
    }

    select<T>(name: string): Observable<T> {
        return this.store.pluck(name);
    }

    set(name: string, state: any) {
        this.subject.next({
            ...this.value, [name]: state
        });
    }
}
