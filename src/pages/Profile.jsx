
import { useEffect, useState } from 'react';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
} from 'firebase/auth';

import {
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore';

import { auth, db } from '../firebase';
import { useAuth } from '../context/AuthContext';

const DEFAULT_PREFERENCES = {
  highContrastSkeletons: true,
  audioFeedbackCues: false,
};

const googleProvider = new GoogleAuthProvider();

function Profile() {
  const { user, loading } = useAuth();

  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [preferences, setPreferences] = useState(
    DEFAULT_PREFERENCES
  );

  const [preferencesLoading, setPreferencesLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  // Load this user's saved preferences.
  useEffect(() => {
    let cancelled = false;

    async function loadPreferences() {
      if (!user) {
        setPreferences(DEFAULT_PREFERENCES);
        setPreferencesLoading(false);
        return;
      }

      setPreferencesLoading(true);

      try {
        const userRef = doc(db, 'users', user.uid);
        const snapshot = await getDoc(userRef);

        if (cancelled) return;

        const saved = snapshot.exists()
          ? snapshot.data().preferences
          : {};

        setPreferences({
          ...DEFAULT_PREFERENCES,
          ...(saved || {}),
        });
      } catch (error) {
        if (!cancelled) {
          setMessage(`Couldn't load preferences: ${error.message}`);
        }
      } finally {
        if (!cancelled) setPreferencesLoading(false);
      }
    }

    loadPreferences();

    return () => {
      cancelled = true;
    };
  }, [user]);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');
    setBusy(true);

    try {
      if (mode === 'signup') {
        const credential = await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

        if (name.trim()) {
          await updateProfile(credential.user, {
            displayName: name.trim(),
          });
        }

        await setDoc(
          doc(db, 'users', credential.user.uid),
          {
            preferences: DEFAULT_PREFERENCES,
            createdAt: new Date().toISOString(),
          },
          { merge: true }
        );
      } else {
        await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );
      }

      setPassword('');
      setMessage('');
    } catch (error) {
      const messages = {
        'auth/email-already-in-use': 'An account already exists for this email.',
        'auth/invalid-email': 'Enter a valid email address.',
        'auth/invalid-credential': 'Email or password is incorrect.',
        'auth/weak-password': 'Choose a stronger password (at least 6 characters).',
        'auth/too-many-requests': 'Too many attempts. Please try again later.',
      };

      setMessage(
        messages[error.code] ||
        'Something went wrong. Please try again.'
      );
    } finally {
      setBusy(false);
    }
  }

  async function handlePreferenceChange(key, value) {
    const next = { ...preferences, [key]: value };

    // Update the interface only after Firestore saves successfully.
    setBusy(true);
    setMessage('');

    try {
      await setDoc(
        doc(db, 'users', user.uid),
        { preferences: next },
        { merge: true }
      );

      setPreferences(next);
    } catch (error) {
      setMessage(`Couldn't save your preference: ${error.message}`);
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogleSignIn() {
    setMessage('');
    setBusy(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userRef = doc(db, 'users', result.user.uid);
      const snapshot = await getDoc(userRef);

      // Create a Firestore profile only for a new user.
      if (!snapshot.exists()) {
        await setDoc(userRef, {
          preferences: DEFAULT_PREFERENCES,
          createdAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      const messages = {
        'auth/popup-closed-by-user': 'Sign-in was cancelled. Try again when you’re ready.',
        'auth/popup-blocked': 'Your browser blocked the sign-in popup. Allow popups and try again.',
        'auth/account-exists-with-different-credential':
          'An account already exists with this email using another sign-in method.',
        'auth/unauthorized-domain':
          'This website domain is not authorized in Firebase.',
        'auth/network-request-failed':
          'Network error. Check your connection and try again.',
      };

      setMessage(
        messages[error.code] ||
        'Google sign-in failed. Please try again.'
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleSignOut() {
    setMessage('');

    try {
      await signOut(auth);
    } catch {
      setMessage('Unable to sign out. Please try again.');
    }
  }

  if (loading) {
    return <div className="page profile-container">Loading account…</div>;
  }

  if (!user) {
    return (
      <div className="page profile-container">
        <div className="profile-section">
          <h2>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
          <p>
            {mode === 'login'
              ? 'Sign in to ASLearn.'
              : 'Create an account to start saving your learning progress.'}
          </p>

          <form onSubmit={handleSubmit} className="settings-card">
            {mode === 'signup' && (
              <label className="setting-item">
                Display name
                <input
                  value={name}
                  onChange={event => setName(event.target.value)}
                  autoComplete="name"
                  maxLength={80}
                />
              </label>
            )}

            <label className="setting-item">
              Email
              <input
                type="email"
                value={email}
                onChange={event => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </label>

            <label className="setting-item">
              Password
              <input
                type="password"
                value={password}
                onChange={event => setPassword(event.target.value)}
                autoComplete={
                  mode === 'login' ? 'current-password' : 'new-password'
                }
                minLength={6}
                required
              />
            </label>

            {message && <p role="alert">{message}</p>}

            <button type="submit" disabled={busy}>
              {busy
                ? 'Please wait…'
                : mode === 'login'
                  ? 'Sign in'
                  : 'Create account'}
            </button>
          </form>

          <button
            type="button"
            className="google-sign-in-button"
            onClick={handleGoogleSignIn}
            disabled={busy}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 3.17 13.22l7.98 6.19C13.05 13.72 18.05 9.5 24 9.5Z"
                transform="translate(0 4)"
              />
              <path
                fill="#4285F4"
                d="M47.98 24.55c0-1.57-.15-3.09-.39-4.55H24v9.02h13.48c-.6 2.96-2.29 5.48-4.79 7.18l7.73 6C44.93 37.8 47.98 31.7 47.98 24.55Z"
              />
              <path
                fill="#FBBC05"
                d="M10.15 28.59a14.4 14.4 0 0 1 0-9.18l-7.98-6.19a24 24 0 0 0 0 21.56l7.98-6.19Z"
                transform="translate(0 4)"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.14 1.44-4.89 2.3-8.18 2.3-5.95 0-10.95-4.22-12.85-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
                transform="translate(0 -4)"
              />
            </svg>

            {busy ? 'Please wait…' : 'Continue with Google'}
          </button>

          <button
            type="button"
            className="learn-text-button"
            onClick={() => {
              setMode(mode === 'login' ? 'signup' : 'login');
              setMessage('');
            }}
          >
            {mode === 'login'
              ? 'Need an account? Sign up'
              : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page profile-container">
      <section className="profile-header-card">
        <div className="profile-avatar" aria-hidden="true">👋</div>

        <div className="profile-info">
          <h2>{user.displayName || 'ASLearn Learner'}</h2>
          <p className="profile-subtitle">{user.email}</p>
          <p className="profile-subtitle">Your ASLearn account</p>
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          disabled={busy}
        >
          Sign out
        </button>
      </section>

      <section className="profile-section">
        <h3>Your learning progress</h3>
        <p>
          Your lesson history, mastered signs, accuracy, and streak
          will appear here once progress tracking is connected.
        </p>
      </section>

      <section className="profile-section">
        <h3>Achievements & Badges</h3>
        <p>
          Achievements will unlock based on your actual learning activity.
        </p>
      </section>

      <section className="profile-section">
        <h3>Preferences</h3>

        {preferencesLoading ? (
          <p>Loading preferences…</p>
        ) : (
          <div className="settings-card">
            <label className="setting-item">
              <span>High Contrast Skeletons</span>
              <input
                type="checkbox"
                checked={preferences.highContrastSkeletons}
                disabled={busy}
                onChange={event =>
                  handlePreferenceChange(
                    'highContrastSkeletons',
                    event.target.checked
                  )
                }
              />
            </label>

            <label className="setting-item">
              <span>Audio Feedback Cues</span>
              <input
                type="checkbox"
                checked={preferences.audioFeedbackCues}
                disabled={busy}
                onChange={event =>
                  handlePreferenceChange(
                    'audioFeedbackCues',
                    event.target.checked
                  )
                }
              />
            </label>
          </div>
        )}

        {message && <p role="status">{message}</p>}
      </section>
    </div>
  );
}

export default Profile;