import { Injectable } from '@angular/core';

// import store
import { Store } from 'store';


// Models
import { Serial } from 'models/serial';

// rxjs
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

// firebase
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';



@Injectable()
export class SerialService {

  SerialDoc: AngularFirestoreDocument<Serial>;

  // Observable stream for the filestore collection
  serials$: Observable<Serial[]> = this.afs.collection('serial').snapshotChanges()
    // map operator to get the document ID
    .map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Serial;
        const id = a.payload.doc.id;
        return { id, ...data };
      });
      // updating the store with the data
    }).do(next => this.store.set('serial', next));


  constructor(
    private store: Store,
    // to connect to the Cloud Firestore database
    private afs: AngularFirestore
  ) { }

  getSerial(id: string) {
    if (!id) { return Observable.of({});
    }
    return this.store.select<Serial[]>('serial')
      .filter(Boolean)
      .map((serial: Serial[]) => serial.find((item: Serial) => item.id === id));
  }
}
