import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signOut, onAuthStateChanged, updateProfile, PhoneAuthProvider,
  signInWithPhoneNumber, RecaptchaVerifier
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db, googleProvider, facebookProvider } from '../firebase/config'
import { differenceInYears, parseISO } from 'date-fns'

const ADMIN_EMAIL = 'aarag1604@gmail.com'

const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [userProfile, setUserProfile]  = useState(null)
  const [loading, setLoading]          = useState(true)
  const [isKidsMode, setIsKidsMode]    = useState(false)

  const isAdmin = currentUser?.email === ADMIN_EMAIL

  // ── Helpers ──────────────────────────────────────────
async function loadProfile(uid) {
  try {
    const snap = await getDoc(doc(db, 'users', uid))

    if (snap.exists()) {
      const data = snap.data()
      setUserProfile(data)

      if (data.dob) {
        const age = differenceInYears(new Date(), parseISO(data.dob))
        setIsKidsMode(age < 18)
      }

      return data
    }

    return null
  } catch (error) {
    console.error('loadProfile error:', error)
    return null
  }
}
  async function createUserProfile(user, extra = {}) {
    const ref = doc(db, 'users', user.uid)
    const snap = await getDoc(ref)
    if (!snap.exists()) {
      await setDoc(ref, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        dob: extra.dob || '',
        createdAt: serverTimestamp(),
        ...extra
      })
    }
    return loadProfile(user.uid)
  }

  // ── Auth Methods ──────────────────────────────────────
  async function loginWithGoogle() {
    const result = await signInWithPopup(auth, googleProvider)
    await createUserProfile(result.user)
    return result
  }

  async function loginWithFacebook() {
    const result = await signInWithPopup(auth, facebookProvider)
    await createUserProfile(result.user)
    return result
  }

  async function loginWithEmail(email, password) {
    const result = await signInWithEmailAndPassword(auth, email, password)
    await loadProfile(result.user.uid)
    return result
  }

  async function registerWithEmail(email, password, displayName, dob) {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(result.user, { displayName })
    await createUserProfile(result.user, { dob })
    return result
  }

  function setupRecaptcha(containerId) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {}
    })
  }

  async function sendPhoneOtp(phoneNumber) {
    const confirmResult = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier)
    window.confirmationResult = confirmResult
    return confirmResult
  }

  async function verifyPhoneOtp(code) {
    const result = await window.confirmationResult.confirm(code)
    await createUserProfile(result.user)
    return result
  }

  async function logout() {
    await signOut(auth)
    setUserProfile(null)
    setIsKidsMode(false)
  }

  async function updateUserDob(dob) {
    if (!currentUser) return
    await setDoc(doc(db, 'users', currentUser.uid), { dob }, { merge: true })
    const age = differenceInYears(new Date(), parseISO(dob))
    setIsKidsMode(age < 18)
    setUserProfile(p => ({ ...p, dob }))
  }

  // ── Auth listener ──────────────────────────────────────
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async user => {
    try {
      setCurrentUser(user)

      if (user) {
        await loadProfile(user.uid)
      }
    } catch (error) {
      console.error('Profile load error:', error)
    } finally {
      setLoading(false)
    }
  })

  return unsubscribe
}, [])
  const value = {
    currentUser, userProfile, loading,
    isAdmin, isKidsMode, setIsKidsMode,
    loginWithGoogle, loginWithFacebook,
    loginWithEmail, registerWithEmail,
    setupRecaptcha, sendPhoneOtp, verifyPhoneOtp,
    logout, updateUserDob, createUserProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
