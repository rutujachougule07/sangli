import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
  query,
  orderBy,
  serverTimestamp,
  updateDoc,
  setDoc,
  onSnapshot,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject, listAll, getMetadata, updateMetadata } from "firebase/storage";
import { db, storage } from "./firebase";

// --- Inquiries ---
export const saveInquiry = async (data: {
  name: string;
  email: string;
  message: string;
  phone?: string;
  subject?: string;
}) => {
  return await addDoc(collection(db, "inquiries"), {
    ...data,
    date: serverTimestamp(),
  });
};

export const getInquiries = (callback: (data: any[]) => void) => {
  const q = query(collection(db, "inquiries"), orderBy("date", "desc"));
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(items);
  }, (error) => {
    console.error("getInquiries Firestore error:", error);
    callback([]);
  });
};

export const deleteInquiry = async (id: string) => {
  await deleteDoc(doc(db, "inquiries", id));
};

// --- Courses ---
export const getCourses = (callback: (data: any[], error?: string) => void) => {
  return onSnapshot(collection(db, "courses"), (snapshot) => {
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(items);
  }, (error) => {
    console.error("getCourses Firestore error:", error.code, error.message);
    callback([], error.message);
  });
};

export const getCourse = async (id: string) => {
  const docRef = doc(db, "courses", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
};

export const addCourse = async (data: any) => {
  return await addDoc(collection(db, "courses"), data);
};

export const updateCourse = async (id: string, data: any) => {
  await setDoc(doc(db, "courses", id), data, { merge: true });
};

export const deleteCourse = async (id: string) => {
  await deleteDoc(doc(db, "courses", id));
};

// --- Gallery/Photos ---
export const uploadImage = async (file: File, path: string) => {
  const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};

export const uploadVideo = async (file: File) => {
  const storageRef = ref(storage, `gallery/videos/${Date.now()}_${file.name}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};

export const saveGalleryItem = async (data: { url?: string; title: string; category?: string }) => {
  return await addDoc(collection(db, "gallery"), {
    ...data,
    date: serverTimestamp(),
  });
};

export const getGalleryItems = (callback: (data: any[]) => void) => {
  const q = query(collection(db, "gallery"), orderBy("date", "desc"));
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(items);
  }, (error) => {
    console.error("getGalleryItems Firestore error:", error);
    callback([]);
  });
};

export const updateGalleryItem = async (id: string, data: any) => {
  await updateDoc(doc(db, "gallery", id), data);
};

export const deleteGalleryItem = async (id: string, imageUrl: string) => {
  await deleteDoc(doc(db, "gallery", id));
};

// --- Gallery Storage-Only (no Firestore) ---
export const uploadGalleryFile = async (file: File, customTitle?: string, customTitle_mr?: string) => {
  const isVideo = file.type.startsWith("video/");
  const folder = isVideo ? "gallery/videos" : "gallery/images";
  const storageRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
  const metadata: any = { customMetadata: {} };
  if (customTitle) metadata.customMetadata.title = customTitle;
  if (customTitle_mr) metadata.customMetadata.title_mr = customTitle_mr;
  
  await uploadBytes(storageRef, file, Object.keys(metadata.customMetadata).length > 0 ? metadata : undefined);
  return await getDownloadURL(storageRef);
};

export const listGalleryFiles = async (): Promise<{ name: string; url: string; fullPath: string; isVideo: boolean; customTitle?: string }[]> => {
  const imagesRef = ref(storage, "gallery/images");
  const videosRef = ref(storage, "gallery/videos");

  const [imagesList, videosList] = await Promise.all([
    listAll(imagesRef).catch(() => ({ items: [] })),
    listAll(videosRef).catch(() => ({ items: [] })),
  ]);

  const imageItems = await Promise.all(
    imagesList.items.map(async (item) => {
      const [url, meta] = await Promise.all([
        getDownloadURL(item),
        getMetadata(item).catch(() => null)
      ]);
      return {
        name: item.name,
        url,
        fullPath: item.fullPath,
        isVideo: false,
        customTitle: meta?.customMetadata?.title || undefined,
        customTitle_mr: meta?.customMetadata?.title_mr || undefined,
      };
    })
  );

  const videoItems = await Promise.all(
    videosList.items.map(async (item) => {
      const [url, meta] = await Promise.all([
        getDownloadURL(item),
        getMetadata(item).catch(() => null)
      ]);
      return {
        name: item.name,
        url,
        fullPath: item.fullPath,
        isVideo: true,
        customTitle: meta?.customMetadata?.title || undefined,
        customTitle_mr: meta?.customMetadata?.title_mr || undefined,
      };
    })
  );

  // Sort by name (timestamp prefix) desc so newest first
  return [...imageItems, ...videoItems].sort((a, b) => b.name.localeCompare(a.name));
};

export const deleteGalleryFile = async (fullPath: string) => {
  const fileRef = ref(storage, fullPath);
  await deleteObject(fileRef);
};

export const updateGalleryFileMetadata = async (fullPath: string, title: string, title_mr?: string) => {
  const fileRef = ref(storage, fullPath);
  const customMetadata: any = {};
  if (title) customMetadata.title = title;
  if (title_mr) customMetadata.title_mr = title_mr;

  await updateMetadata(fileRef, { customMetadata });
};

// --- Reviews ---
export const saveReview = async (data: {
  name: string;
  rating: number;
  text: string;
  role?: string;
}) => {
  return await addDoc(collection(db, "reviews"), {
    ...data,
    date: serverTimestamp(),
  });
};

export const getReviews = (callback: (data: any[]) => void) => {
  const q = query(collection(db, "reviews"), orderBy("date", "desc"));
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(items);
  }, (error) => {
    console.error("getReviews Firestore error:", error);
    callback([]);
  });
};

export const updateReview = async (id: string, data: any) => {
  await updateDoc(doc(db, "reviews", id), data);
};

export const deleteReview = async (id: string) => {
  await deleteDoc(doc(db, "reviews", id));
};

export const uploadReviewFile = async (file: File) => {
  const isVideo = file.type.startsWith("video/");
  const folder = isVideo ? "reviews/videos" : "reviews/images";
  const storageRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};

// --- Success Stories ---
export const saveSuccessStory = async (data: any) => {
  return await addDoc(collection(db, "success_stories"), {
    ...data,
    date: serverTimestamp(),
  });
};

export const getSuccessStories = (callback: (data: any[]) => void) => {
  const q = query(collection(db, "success_stories"), orderBy("date", "desc"));
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(items);
  }, (error) => {
    console.error("getSuccessStories Firestore error:", error);
    callback([]);
  });
};

export const updateSuccessStory = async (id: string, data: any) => {
  await updateDoc(doc(db, "success_stories", id), data);
};

export const deleteSuccessStory = async (id: string) => {
  await deleteDoc(doc(db, "success_stories", id));
};

export const uploadSuccessStoryFile = async (file: File) => {
  const isVideo = file.type.startsWith("video/");
  const folder = isVideo ? "success_stories/videos" : "success_stories/images";
  const storageRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};

// --- Team ---
export const getTeam = (callback: (data: any[]) => void) => {
  const q = query(collection(db, "team"), orderBy("name", "asc"));
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(items);
  }, (error) => {
    console.error("getTeam Firestore error:", error);
    callback([]);
  });
};

export const addTeamMember = async (data: any) => {
  return await addDoc(collection(db, "team"), data);
};

export const updateTeamMember = async (id: string, data: any) => {
  await updateDoc(doc(db, "team", id), data);
};

export const deleteTeamMember = async (id: string) => {
  await deleteDoc(doc(db, "team", id));
};

// --- Contributions (Donations & Volunteers) ---
export const saveDonation = async (data: {
  amount: number;
  name: string;
  email: string;
  phone: string;
  aadhaar?: string;
  pan?: string;
}) => {
  return await addDoc(collection(db, "donations"), {
    ...data,
    date: serverTimestamp(),
  });
};

export const getDonations = (callback: (data: any[]) => void) => {
  const q = query(collection(db, "donations"), orderBy("date", "desc"));
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(items);
  }, (error) => {
    console.error("getDonations Firestore error:", error);
    callback([]);
  });
};

export const deleteDonation = async (id: string) => {
  await deleteDoc(doc(db, "donations", id));
};

export const saveVolunteer = async (data: {
  name: string;
  email: string;
  phone: string;
  skill: string;
}) => {
  return await addDoc(collection(db, "volunteers"), {
    ...data,
    date: serverTimestamp(),
  });
};

export const getVolunteers = (callback: (data: any[]) => void) => {
  const q = query(collection(db, "volunteers"), orderBy("date", "desc"));
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(items);
  }, (error) => {
    console.error("getVolunteers Firestore error:", error);
    callback([]);
  });
};

export const deleteVolunteer = async (id: string) => {
  await deleteDoc(doc(db, "volunteers", id));
};

// --- Founders / Website Settings ---
export const getFoundersSnapshot = (callback: (data: any) => void) => {
  return onSnapshot(doc(db, "settings", "founders"), (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data());
    } else {
      callback(null);
    }
  }, (error) => {
    console.error("getFoundersSnapshot error:", error);
    callback(null);
  });
};

export const saveFounders = async (data: any) => {
  await setDoc(doc(db, "settings", "founders"), data, { merge: true });
};
