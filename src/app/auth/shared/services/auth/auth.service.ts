import { User } from 'models/user';
import { Store } from 'store';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/do';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

// https://angularfirebase.com/lessons/role-based-permissions-and-authorization-with-firebase-auth/

@Injectable()
export class AuthService {

  auth$ = this.af.authState
    .do(next => {
        if (!next) {
          this.store.set('user', null);
          return;
        }
        const user: User = {
          email: next.email,
          uid: next.uid,
          authenticated: true
        };
        this.store.set('user', user);
    });

  constructor(
    private af: AngularFireAuth,
    private afs: AngularFirestore,
    private store: Store,
  ) { }

  get user() {
    return this.af.auth.currentUser;
  }
    get authState() {
      return this.af.authState;
    }



    createUser(email: string, password: string) {
      return this.af.auth
        .createUserWithEmailAndPassword(email, password);
    }

    createUserDB() {

    }

    loginUser(email: string, password: string) {
        return this.af.auth
        .signInWithEmailAndPassword(email, password);
    }

    logoutUser() {
      return this.af.auth.signOut();
    }

}
