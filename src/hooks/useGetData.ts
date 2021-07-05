import firebase from 'firebase/app';
import 'firebase/firestore';
import { useEffect, useState } from 'react';
export const useGetData = (collection: string) => {
  const [documents, setDocuments] = useState<any[]>([]);
  const db = firebase.firestore();

  useEffect(() => {
    db.collection(collection)
      .get()
      .then((qs) => {
        let arr: any[] = [];
        qs.docs.map((d) => arr.push({ id: d.id, value: d.data() }));
        setDocuments(arr);
      });
  }, [collection, db]);
  return [documents];
};
