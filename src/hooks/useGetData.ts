import firebase from 'firebase';
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
      })
      .catch((e) => console.log('Error during fetching data for collection: ' + collection + ':' + e));
  }, [collection, db]);
  return [documents];
};
