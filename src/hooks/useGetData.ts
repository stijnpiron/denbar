import firebase from 'firebase';
import { useEffect, useState } from 'react';
import { FirestoreQueryOperators } from './../interfaces/firestore';

export interface FirestoreQueryParams {
  field: string;
  operator: FirestoreQueryOperators;
  value: string;
}

export interface useGetDataOptions {
  docId?: string;
  queryParams?: FirestoreQueryParams;
}

export const useGetData = (collection: string, options?: useGetDataOptions) => {
  const [documents, setDocuments] = useState<any[]>([]);
  const db = firebase.firestore();

  const { queryParams, docId } = options || {};

  useEffect(() => {
    debugger;
    if (!documents.length) {
      const collectionRef = db.collection(collection);
      if (docId) {
        const documentQuery = collectionRef.doc(docId);
        documentQuery
          .get()
          .then((doc) => {
            if (doc.exists) {
              setDocuments([doc.data()]);
            }
          })
          .catch((e) => console.log('Error during fetching data for document with id: ' + docId + ':' + e));
      } else {
        const dataQuery = queryParams
          ? collectionRef.where(queryParams.field, queryParams.operator, queryParams.value)
          : collectionRef;
        dataQuery
          .get()
          .then((qs) => {
            let arr: any[] = [];
            qs.docs.map((d) => arr.push({ id: d.id, value: d.data() }));
            setDocuments(arr);
          })
          .catch((e) => console.log('Error during fetching data for collection: ' + collection + ':' + e));
      }
    }
  }, [collection, db, docId, documents.length, queryParams]);
  return [documents];
};
