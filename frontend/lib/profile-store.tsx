"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {  userAPI } from '@/services/api';

export type Profile = {
  id: string;
  email: string;
  username: string;
  role: string;
  avatar: string;
  jobTitle: string;
  fullName: string;
  initials?: string;
};

const STORAGE_KEY = "dexter.profile.v1";
const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

const defaultProfile: Profile = {
  id: "",
  email: "",
  username: "Dexuser",
  role: "USER",
  avatar: "",
  jobTitle: "",
  fullName: "",
};

type ProfileContextValue = {
  profile: Profile;
  updateProfile: (patch: Partial<Profile>) => void;
  resetProfile: () => void;
  loading: boolean;
  isLoggedIn: boolean;
  logout: () => void;
};

const ProfileContext =
  createContext<ProfileContextValue | null>(null);

export const getAvatarOrInitials = (
  username: string,
  avatar?: string
) => {
  if (avatar?.trim()) {
    return avatar;
  }

  const source = username.trim() || "User";

  return source.slice(0, 2).toUpperCase();
};

export function ProfileProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [profile, setProfile] =
    useState<Profile>(defaultProfile);

  const [hydrated, setHydrated] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [isLoggedIn, setIsLoggedIn] =
    useState(false);

  useEffect(() => {
    try {
      const raw =
        window.localStorage.getItem(STORAGE_KEY);

      if (raw) {
        const savedProfile =
          JSON.parse(raw) as Partial<Profile>;

        setProfile({
          ...defaultProfile,
          ...savedProfile,
        });
      }
    } catch (error) {
      console.error(
        "Failed to load profile:",
        error
      );
    } finally {
      setHydrated(true);
    }
  }, []);


  useEffect(() => {
    if (!hydrated) return;

    const loadUser = async () => {
      const accessToken =
        window.localStorage.getItem(
          ACCESS_TOKEN_KEY
        );

      const refreshToken =
        window.localStorage.getItem(
          REFRESH_TOKEN_KEY
        );

      if (!accessToken && !refreshToken) {
        setIsLoggedIn(false);
        setLoading(false);
        return;
      }

      try {
        const response =
          await userAPI.getMe();

        const user = response.data;

        setIsLoggedIn(true);

        setProfile({
          id: user.id || "",
          email: user.email || "",
          username: user.username || "",
          role: user.role || "USER",
          avatar: user.avatar
            ? user.avatar
            : getAvatarOrInitials(
                user.username || ""
              ),
          jobTitle: user.jobTitle || "",
          fullName: user.fullName || "",
        });
      } catch (error) {
        console.error(
          "Failed to load authenticated user:",
          error
        );

        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [hydrated]);

 
  useEffect(() => {
    if (!hydrated) return;

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(profile)
      );
    } catch (error) {
      console.error(
        "Failed to save profile:",
        error
      );
    }
  }, [profile, hydrated]);


  const logout = () => {
    window.localStorage.removeItem(
      ACCESS_TOKEN_KEY
    );

    window.localStorage.removeItem(
      REFRESH_TOKEN_KEY
    );

    window.localStorage.removeItem(
      STORAGE_KEY
    );

    setIsLoggedIn(false);
    setProfile(defaultProfile);
  };


  const updateProfile = (
    patch: Partial<Profile>
  ) => {
    setProfile((currentProfile) => {
      const nextProfile: Profile = {
        ...currentProfile,
        ...patch,
      };

      nextProfile.initials =
        getAvatarOrInitials(
          nextProfile.username,
          nextProfile.avatar
        );

      return nextProfile;
    });
  };

  const resetProfile = () => {
    setProfile(defaultProfile);

    try {
      window.localStorage.removeItem(
        STORAGE_KEY
      );
    } catch (error) {
      console.error(
        "Failed to reset profile:",
        error
      );
    }
  };

  const value = useMemo(
    () => ({
      profile,
      updateProfile,
      resetProfile,
      loading,
      isLoggedIn,
      logout,
    }),
    [
      profile,
      loading,
      isLoggedIn,
    ]
  );

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile(): ProfileContextValue {
  const context =
    useContext(ProfileContext);

  if (!context) {
    throw new Error(
      "useProfile must be used within ProfileProvider"
    );
  }

  return context;
}