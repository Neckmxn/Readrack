import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  PhoneAuthProvider,
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, googleProvider, facebookProvider, db } from '../config/firebase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isKidsMode, setIsKidsMode] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const createUserProfile = async (user, additionalData = {}) => {
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
      const { email, displayName, phoneNumber } = user;
      const createdAt = new Date();
      const age = additionalData.birthDate ? calculateAge(additionalData.birthDate) : null;

      try {
        await setDoc(userRef, {
          email,
          displayName,
          phoneNumber,
          createdAt,
          birthDate: additionalData.birthDate || null,
          age,
          isKidsMode: age !== null && age < 18,
          ...additionalData,
        });
      } catch (error) {
        console.error('Error creating user profile:', error);
      }
    }

    return userRef;
  };

  const loadUserProfile = async (user) => {
    if (!user) {
      setUserProfile(null);
      setIsKidsMode(false);
      setIsAdmin(false);
      return;
    }

    try {
      const userRef = doc(db, 'users', user.uid);
      const snapshot = await getDoc(userRef);

      if (snapshot.exists()) {
        const profile = snapshot.data();
        setUserProfile(profile);
        setIsKidsMode(profile.isKidsMode || false);
        setIsAdmin(user.email === ADMIN_EMAIL);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const signup = async (email, password, additionalData) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await createUserProfile(userCredential.user, additionalData);
    return userCredential;
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    await createUserProfile(result.user);
    return result;
  };

  const loginWithFacebook = async () => {
    const result = await signInWithPopup(auth, facebookProvider);
    await createUserProfile(result.user);
    return result;
  };

  const setupRecaptcha = (elementId) => {
    return new RecaptchaVerifier(auth, elementId, {
      size: 'invisible',
    });
  };

  const loginWithPhone = (phoneNumber, recaptchaVerifier) => {
    return signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
  };

  const logout = () => {
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      await loadUserProfile(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    isKidsMode,
    isAdmin,
    signup,
    login,
    loginWithGoogle,
    loginWithFacebook,
    loginWithPhone,
    setupRecaptcha,
    logout,
    createUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};