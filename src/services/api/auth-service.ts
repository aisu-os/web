import type { UserProfile, SetupUserData } from "@/types";
import { apiGet, apiPost, apiPostFormData, ApiError, setToken } from "./client";

// ── localStorage kalitlari ──
const USERNAME_KEY = "aisu_username";
const WALLPAPER_KEY = "aisu_wallpaper";

// ── API response tiplari ──

interface LoginResponse {
  access_token: string;
  token_type: string;
}

interface MeResponse {
  id: string;
  username: string;
  display_name: string;
  email: string;
  avatar_url: string | null;
  role: string;
  is_active: boolean;
}

interface UsernameInfoResponse {
  avatar_url: string | null;
  display_name: string;
  wallpaper: string | null;
}

interface RegisterResponse {
  username: string;
  display_name: string;
  avatar_url: string | null;
  wallpaper: string | null;
}

// ── Yordamchi ──

function mapMeToProfile(me: MeResponse): UserProfile {
  return {
    id: String(me.id),
    username: me.username,
    displayName: me.display_name,
    email: me.email,
    avatar: me.avatar_url,
    role: me.role,
    isActive: me.is_active,
  };
}

// ── Saqlangan username bilan ishlash ──

export function getSavedUsername(): string | null {
  return localStorage.getItem(USERNAME_KEY);
}

export function clearSavedUsername(): void {
  localStorage.removeItem(USERNAME_KEY);
}

export function saveUsername(username: string): void {
  localStorage.setItem(USERNAME_KEY, username);
}

// ── API funksiyalari ──

/**
 * Token bilan joriy foydalanuvchi profilini olish.
 * GET /api/v1/auth/me
 */
export async function fetchMe(): Promise<UserProfile> {
  const me = await apiGet<MeResponse>("/auth/me");
  return mapMeToProfile(me);
}

/**
 * Username bo'yicha ochiq profil ma'lumotlarini olish (avatar, display_name).
 * GET /api/v1/auth/username-info?username=x
 */
export async function fetchUserProfile(username: string): Promise<{
  user: UserProfile;
  wallpaper: string | null;
} | null> {
  try {
    const info = await apiGet<UsernameInfoResponse>(
      `/auth/username-info?username=${encodeURIComponent(username)}`,
    );

    const user: UserProfile = {
      id: "",
      username,
      displayName: info.display_name,
      email: "",
      avatar: info.avatar_url,
      role: "",
      isActive: true,
    };

    return { user, wallpaper: info.wallpaper };
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      return null;
    }
    throw err;
  }
}

/**
 * Username + parol bilan login.
 * POST /api/v1/auth/login → token olish
 * GET /api/v1/auth/me → to'liq profil
 */
export async function loginUser(
  username: string,
  password: string,
): Promise<{
  success: boolean;
  user: UserProfile | null;
  wallpaper: string | null;
  error?: string;
}> {
  try {
    // 1. Login → token olish
    const loginRes = await apiPost<LoginResponse>("/auth/login", {
      username,
      password,
    });

    // 2. Token xotiraga, username localStorage'ga saqlash
    setToken(loginRes.access_token);
    saveUsername(username);

    // 3. Profil olish
    const user = await fetchMe();

    // 4. Wallpaper olish (username-info ochiq endpoint)
    let wallpaper: string | null = null;
    try {
      const info = await fetchUserProfile(username);
      wallpaper = info?.wallpaper ?? null;
    } catch {
      // Wallpaper ololmasa ham login muvaffaqiyatli qoladi
    }

    return { success: true, user, wallpaper };
  } catch (err) {
    if (err instanceof ApiError) {
      if (err.status === 401) {
        return {
          success: false,
          user: null,
          wallpaper: null,
          error: "Noto'g'ri parol",
        };
      }
      if (err.status === 404) {
        return {
          success: false,
          user: null,
          wallpaper: null,
          error: "Foydalanuvchi topilmadi",
        };
      }
      return { success: false, user: null, wallpaper: null, error: err.detail };
    }
    return {
      success: false,
      user: null,
      wallpaper: null,
      error: "Tarmoq xatosi",
    };
  }
}

/**
 * Yangi foydalanuvchi ro'yxatdan o'tkazish.
 * POST /api/v1/auth/register (multipart/form-data)
 * Success bo'lsa username saqlanadi, keyin reboot → login ekrani.
 */
export async function registerUser(data: SetupUserData): Promise<void> {
  const formData = new FormData();
  formData.append("email", data.email);
  formData.append("username", data.username);
  formData.append("display_name", data.displayName);
  formData.append("password", data.password);

  if (data.avatarFile) {
    formData.append("avatar", data.avatarFile);
  } else if (data.avatarEmoji) {
    formData.append("avatar_emoji", data.avatarEmoji);
  }

  await apiPostFormData<RegisterResponse>("/auth/register", formData);

  saveUsername(data.username);
}

/**
 * Wallpaper'ni saqlash (hozircha localStorage'da).
 */
export function saveWallpaper(wallpaper: string): void {
  localStorage.setItem(WALLPAPER_KEY, wallpaper);
}
