import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "./firebase";

const projectsCollection = collection(db, "projects");

export async function getProjects() {
  const projectsQuery = query(
    projectsCollection,
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(projectsQuery);

  return snapshot.docs.map((projectDoc) => ({
    id: projectDoc.id,
    ...projectDoc.data(),
  }));
}

export async function addProject(project) {
  return await addDoc(projectsCollection, {
    ...project,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateProject(id, project) {
  const projectRef = doc(db, "projects", id);

  await updateDoc(projectRef, {
    ...project,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteProject(id) {
  const projectRef = doc(db, "projects", id);

  await deleteDoc(projectRef);
}