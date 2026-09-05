import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyCktchvQqak0cPn9ZMhxmxdEtnV2O6hnK8',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'haven-space-ed64d.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'haven-space-ed64d',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'haven-space-ed64d.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '99907910586',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:99907910586:web:0beeb3e7f055c646c87b83',
};

let app;
let auth;
let googleProvider;

try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: 'select_account' });
} catch (err) {
  console.warn('[Firebase Init Warning]:', err.message);
}

export const loginWithGoogleFirebase = async () => {
  if (auth && googleProvider) {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      return {
        name: user.displayName || 'Google User',
        email: user.email,
        photo: user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      };
    } catch (popupErr) {
      if (popupErr.code === 'auth/popup-closed-by-user' || popupErr.code === 'auth/cancelled-popup-request') {
        throw new Error('Google sign-in popup was closed.');
      }
      if (popupErr.code === 'auth/unauthorized-domain') {
        const currentHost = window.location.hostname;
        console.warn(`[Firebase Domain Error]: "${currentHost}" is not in Firebase Authorized Domains.`);
        throw new Error(`Domain "${currentHost}" is not authorized in Firebase. Please add "${currentHost}" to Firebase Console -> Authentication -> Settings -> Authorized Domains, or use http://localhost:5173.`);
      }
      console.warn('[Firebase Google Auth Error]:', popupErr.message);
      throw new Error(popupErr.message || 'Google sign-in failed.');
    }
  }

  // Fallback simulation
  return {
    name: 'Google Tenant User',
    email: `google.user_${Date.now().toString().slice(-4)}@gmail.com`,
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  };
};

export { auth, googleProvider };
