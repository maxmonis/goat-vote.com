import {initializeApp} from "firebase/app"
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth"

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  appId: process.env.REACT_APP_APP_ID,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
}

const googleProvider = new GoogleAuthProvider()

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)

export async function logInWithGoogle() {
  await signInWithPopup(auth, googleProvider)
}

export async function logOut() {
  await signOut(auth)
}
