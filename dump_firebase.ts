import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getStorage, ref, listAll, getMetadata } from 'firebase/storage';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

async function checkGallery() {
  console.log("--- FIRESTORE NEWS ---");
  try {
    const q = collection(db, "news");
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(`ID: ${doc.id}`);
      console.log(`Title: ${doc.data().title}`);
      console.log(`Title_MR: ${doc.data().title_mr}`);
      console.log("-----------------------");
    });
  } catch(e) {
    console.error("Firestore error:", e);
  }

  console.log("--- STORAGE GALLERY ---");
  try {
    const galleryRef = ref(storage, 'gallery');
    const res = await listAll(galleryRef);
    for (const itemRef of res.items) {
      try {
        const meta = await getMetadata(itemRef);
        console.log(`Name: ${itemRef.name}`);
        console.log(`Custom Title: ${meta.customMetadata?.title}`);
        console.log(`Custom Title_MR: ${meta.customMetadata?.title_mr}`);
        console.log("-----------------------");
      } catch (e) {}
    }
  } catch(e) {
    console.error("Storage error:", e);
  }
}

checkGallery();
