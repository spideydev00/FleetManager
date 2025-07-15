import { useState, useEffect } from "react";
import { User } from "../../../entities/types";
import { authService } from "../services/authService";

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const { user, error } = await authService.validateSession();
      if (error) {
        setError(
          (error as { message?: string }).message ||
            "Errore durante la verifica della sessione"
        );
        setCurrentUser(null);
      } else {
        setCurrentUser(user);
      }
    } catch (err: any) {
      setError(err.message || "Errore durante la verifica della sessione");
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    setError("");

    try {
      const { user, error } = await authService.signIn(email, password);
      if (error) {
        throw error;
      }
      setCurrentUser(user);
      return { success: true, user };
    } catch (err: any) {
      const errorMessage = err.message || "Errore durante l'accesso";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await authService.signOut();
      setCurrentUser(null);
      setError("");
    } catch (err: any) {
      setError(err.message || "Errore durante il logout");
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (profileData: Partial<User>) => {
    if (!currentUser) return;

    setIsLoading(true);
    setError("");

    try {
      const { user, error } = await authService.updateProfile(
        currentUser.id,
        profileData
      );
      if (error) {
        throw error;
      }
      setCurrentUser(user);
      return { success: true, user };
    } catch (err: any) {
      const errorMessage =
        err.message || "Errore durante l'aggiornamento del profilo";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    setError("");

    try {
      const { error } = await authService.resetPassword(email);
      if (error) {
        throw error;
      }
      return { success: true };
    } catch (err: any) {
      const errorMessage =
        err.message || "Errore durante il reset della password";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    currentUser,
    isLoading,
    error,
    signIn,
    signOut,
    updateProfile,
    resetPassword,
    checkAuthStatus,
  };
};
