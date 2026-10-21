import { AcademicDeadline, StudentProfile } from '../types/academic';

const LOCAL_STORAGE_KEY = 'naijagpa_profile_v2';
const DEADLINES_STORAGE_KEY = 'naijagpa_deadlines_v2';
const THEME_STORAGE_KEY = 'naijagpa_theme_v2';

// Standard Web Crypto helper for client-side AES-GCM encryption
async function getKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as BufferSource,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts arbitrary student payload into base64 ciphertext with AES-GCM
 */
export async function encryptPayload(data: unknown, secretPassphrase: string = 'NaijaGPA-Default-Secure-Key'): Promise<string> {
  const enc = new TextEncoder();
  const plainText = JSON.stringify(data);
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const key = await getKey(secretPassphrase, salt);

  const encrypted = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    enc.encode(plainText)
  );

  const combined = new Uint8Array(salt.byteLength + iv.byteLength + encrypted.byteLength);
  combined.set(salt, 0);
  combined.set(iv, salt.byteLength);
  combined.set(new Uint8Array(encrypted), salt.byteLength + iv.byteLength);

  // Return url-safe base64
  let binary = '';
  for (let i = 0; i < combined.byteLength; i++) {
    binary += String.fromCharCode(combined[i]);
  }
  return btoa(binary);
}

/**
 * Decrypts base64 ciphertext back into JSON payload
 */
export async function decryptPayload<T>(cipherBase64: string, secretPassphrase: string = 'NaijaGPA-Default-Secure-Key'): Promise<T> {
  const binary = atob(cipherBase64);
  const combined = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    combined[i] = binary.charCodeAt(i);
  }

  const salt = combined.slice(0, 16);
  const iv = combined.slice(16, 28);
  const data = combined.slice(28);

  const key = await getKey(secretPassphrase, salt);
  const decrypted = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  );

  const dec = new TextDecoder();
  return JSON.parse(dec.decode(decrypted)) as T;
}

/**
 * Local offline storage operations
 */
export function saveProfileLocally(profile: StudentProfile): void {
  try {
    const updated = { ...profile, lastSynced: new Date().toISOString() };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Failed to save profile to localStorage:', err);
  }
}

export function loadProfileLocally(): StudentProfile | null {
  try {
    const item = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!item) return null;
    return JSON.parse(item) as StudentProfile;
  } catch (err) {
    console.warn('Failed to load profile from localStorage:', err);
    return null;
  }
}

export function saveDeadlinesLocally(deadlines: AcademicDeadline[]): void {
  try {
    localStorage.setItem(DEADLINES_STORAGE_KEY, JSON.stringify(deadlines));
  } catch (err) {
    console.warn('Failed to save deadlines:', err);
  }
}

export function loadDeadlinesLocally(): AcademicDeadline[] | null {
  try {
    const item = localStorage.getItem(DEADLINES_STORAGE_KEY);
    if (!item) return null;
    return JSON.parse(item) as AcademicDeadline[];
  } catch (err) {
    console.warn('Failed to load deadlines:', err);
    return null;
  }
}

export function getStoredTheme(): 'light' | 'dark' {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

export function setStoredTheme(theme: 'light' | 'dark'): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (err) {
    console.warn('Failed to store theme:', err);
  }
}
