
import { useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
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