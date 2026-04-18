import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../config/firebase';

const BOOKS_COLLECTION = 'books';

export const bookCategories = [
  'Story',
  'Fantasy',
  'Science Fiction',
  'Novels',
  'Poetry',
  'Mystery/Thriller',
  'Historical Fiction',
  'Romance',
  'Horror',
  'Literary Fiction',
  'Non-Fiction',
];

export const bookService = {
  async getAllBooks(isKidsMode = false) {
    try {
      const booksRef = collection(db, BOOKS_COLLECTION);
      const q = query(
        booksRef,
        where('isKidsContent', '==', isKidsMode),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching books:', error);
      return [];
    }
  },

  async getBooksByCategory(category, isKidsMode = false) {
    try {
      const booksRef = collection(db, BOOKS_COLLECTION);
      const q = query(
        booksRef,
        where('category', '==', category),
        where('isKidsContent', '==', isKidsMode)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching books by category:', error);
      return [];
    }
  },

  async getFreeBooks(isKidsMode = false) {
    try {
      const booksRef = collection(db, BOOKS_COLLECTION);
      const q = query(
        booksRef,
        where('isFree', '==', true),
        where('isKidsContent', '==', isKidsMode)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching free books:', error);
      return [];
    }
  },

  async getPaidBooks(isKidsMode = false) {
    try {
      const booksRef = collection(db, BOOKS_COLLECTION);
      const q = query(
        booksRef,
        where('isFree', '==', false),
        where('isKidsContent', '==', isKidsMode)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching paid books:', error);
      return [];
    }
  },

  async getNewReleases(isKidsMode = false) {
    try {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const booksRef = collection(db, BOOKS_COLLECTION);
      const q = query(
        booksRef,
        where('isNewRelease', '==', true),
        where('isKidsContent', '==', isKidsMode),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching new releases:', error);
      return [];
    }
  },

  async getBookById(bookId) {
    try {
      const bookRef = doc(db, BOOKS_COLLECTION, bookId);
      const snapshot = await getDoc(bookRef);
      if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() };
      }
      return null;
    } catch (error) {
      console.error('Error fetching book:', error);
      return null;
    }
  },

  async uploadBookPDF(file, bookId) {
    try {
      const storageRef = ref(storage, `books/${bookId}/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading PDF:', error);
      throw error;
    }
  },

  async addBook(bookData, pdfFile) {
    try {
      const docRef = await addDoc(collection(db, BOOKS_COLLECTION), {
        ...bookData,
        createdAt: Timestamp.now(),
        isNewRelease: true,
      });

      if (pdfFile) {
        const pdfURL = await this.uploadBookPDF(pdfFile, docRef.id);
        await updateDoc(doc(db, BOOKS_COLLECTION, docRef.id), {
          pdfURL,
        });
      }

      return docRef.id;
    } catch (error) {
      console.error('Error adding book:', error);
      throw error;
    }
  },

  async updateBook(bookId, bookData, pdfFile = null) {
    try {
      const bookRef = doc(db, BOOKS_COLLECTION, bookId);

      if (pdfFile) {
        const pdfURL = await this.uploadBookPDF(pdfFile, bookId);
        bookData.pdfURL = pdfURL;
      }

      await updateDoc(bookRef, bookData);
    } catch (error) {
      console.error('Error updating book:', error);
      throw error;
    }
  },

  async deleteBook(bookId) {
    try {
      const bookRef = doc(db, BOOKS_COLLECTION, bookId);
      const bookSnapshot = await getDoc(bookRef);

      if (bookSnapshot.exists() && bookSnapshot.data().pdfURL) {
        const pdfRef = ref(storage, bookSnapshot.data().pdfURL);
        await deleteObject(pdfRef);
      }

      await deleteDoc(bookRef);
    } catch (error) {
      console.error('Error deleting book:', error);
      throw error;
    }
  },

  async checkAndUpdateNewReleases() {
    try {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const booksRef = collection(db, BOOKS_COLLECTION);
      const q = query(booksRef, where('isNewRelease', '==', true));
      const snapshot = await getDocs(q);

      snapshot.forEach(async (docSnapshot) => {
        const book = docSnapshot.data();
        const createdAt = book.createdAt.toDate();

        if (createdAt < oneWeekAgo) {
          await updateDoc(doc(db, BOOKS_COLLECTION, docSnapshot.id), {
            isNewRelease: false,
          });
        }
      });
    } catch (error) {
      console.error('Error updating new releases:', error);
    }
  },
};