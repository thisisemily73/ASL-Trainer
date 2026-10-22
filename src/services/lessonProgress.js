
import {
  collection,
  doc,
  getDocs,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore';

import { db } from '../firebase';

function getLessonDocumentId(unitKey, lessonId) {
  return `${unitKey}__${lessonId}`;
}

/**
 * Load completed lesson keys for one user.
 * Returns keys in the format used by Learn.jsx:
 * "unit-1:basic-greetings"
 */
export async function getCompletedLessons(uid) {
  const progressRef = collection(
    db,
    'users',
    uid,
    'lessonProgress'
  );

  const snapshot = await getDocs(progressRef);

  return snapshot.docs
    .filter(document => document.data().completed === true)
    .map(document => {
      const data = document.data();
      return `${data.unitKey}:${data.lessonId}`;
    });
}

/**
 * Mark a lesson complete without overwriting its original
 * completion timestamp when the student reviews it.
 */
export async function completeLesson(uid, unitKey, lessonId) {
  const documentId = getLessonDocumentId(unitKey, lessonId);

  const progressRef = doc(
    db,
    'users',
    uid,
    'lessonProgress',
    documentId
  );

  return runTransaction(db, async transaction => {
    const snapshot = await transaction.get(progressRef);

    if (snapshot.exists() && snapshot.data().completed === true) {
      return false;
    }

    transaction.set(
      progressRef,
      {
        unitKey,
        lessonId,
        completed: true,
        completedAt: serverTimestamp(),
      },
      { merge: true }
    );

    return true;
  });
}