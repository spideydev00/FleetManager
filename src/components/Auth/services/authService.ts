import { supabase } from "../../../supabase";
import { User, UserRole } from "../../../types";

export interface AuthServiceInterface {
  signIn(
    email: string,
    password: string
  ): Promise<{ user: User | null; error: any }>;
  signOut(): Promise<{ error: any }>;
  getCurrentUser(): Promise<{ user: User | null; error: any }>;
  updateProfile(
    userId: string,
    profileData: Partial<User>
  ): Promise<{ user: User | null; error: any }>;
  resetPassword(email: string): Promise<{ error: any }>;
  validateSession(): Promise<{ user: User | null; error: any }>;
  // User management methods
  fetchUsers(): Promise<{ data: User[] | null; error: any }>;
  createUser(
    email: string,
    userData: any
  ): Promise<{ data: User | null; error: any }>;
  updateUser(
    userId: string,
    userData: Partial<User>
  ): Promise<{ data: User | null; error: any }>;
  deleteUser(userId: string): Promise<{ success: boolean; error: any }>;
}

class AuthService implements AuthServiceInterface {
  async signIn(email: string, password: string) {
    try {
      
      // Sign in with Supabase Auth
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError) throw authError;

      if (authData.user) {
        // Get user profile from our users table BEFORE any updates
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", authData.user.id)
          .single();

        if (userError) throw userError;


        // CRITICAL: Check if someone is updating the role field
        // Convert string role to UserRole enum
        let userRole: UserRole;
        switch (userData.role) {
          case "Creatore":
            userRole = UserRole.CREATOR;
            break;
          case "Manager":
            userRole = UserRole.MANAGER;
            break;
          case "User":
            userRole = UserRole.USER;
            break;
          default:
            console.warn("Unknown role from DB:", userData.role, "defaulting to USER");
            userRole = UserRole.USER;
        }


        const user: User = {
          id: userData.id,
          role: userRole,
          nome: userData.nome,
          email: userData.email,
          azienda: userData.azienda,
          telefono: userData.telefono,
          dataCreazione: userData.created_at,
          ultimoAccesso: new Date().toISOString(),
        };


        // Update ONLY last access time, DO NOT UPDATE ROLE
        const { data: updateResult, error: updateError } = await supabase
          .from("users")
          .update({ ultimo_accesso: new Date().toISOString() })
          .eq("id", userData.id)
          .select("role"); // Select role to verify it doesn't change

        if (updateError) {
          console.warn("AuthService signIn - Error updating last access:", updateError);
        } else {
          console.log("🔍 After ultimo_accesso update, role in DB is:", updateResult?.[0]?.role);
          if (updateResult?.[0]?.role !== userData.role) {
            console.error("🚨 CRITICAL: Role changed during ultimo_accesso update!", {
              before: userData.role,
              after: updateResult?.[0]?.role
            });
          }
        }

        // Double-check: Read the role again from database
        const { data: finalCheck, error: checkError } = await supabase
          .from("users")
          .select("role")
          .eq("id", userData.id)
          .single();

        if (!checkError && finalCheck) {
          if (finalCheck.role !== userData.role) {
            console.error("🚨 CRITICAL: Role was modified somewhere!", {
              original: userData.role,
              final: finalCheck.role
            });
          }
        }

        return { user, error: null };
      }

      return { user: null, error: new Error("User not found") };
    } catch (error) {
      console.error("AuthService signIn - Error:", error);
      return { user: null, error };
    }
  }

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      console.error("Error signing out:", error);
      return { error };
    }
  }

  async getCurrentUser() {
    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) throw sessionError;

      if (!session?.user) {
        return { user: null, error: null };
      }

      // Get user profile from our users table
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (userError) throw userError;


      // Convert string role to UserRole enum - DO NOT CHANGE THE ROLE IN DB
      let userRole: UserRole;
      switch (userData.role) {
        case "Creatore":
          userRole = UserRole.CREATOR;
          break;
        case "Manager":
          userRole = UserRole.MANAGER;
          break;
        case "User":
          userRole = UserRole.USER;
          break;
        default:
          console.warn("Unknown role from DB:", userData.role, "defaulting to USER");
          userRole = UserRole.USER;
      }

      const user: User = {
        id: userData.id,
        role: userRole,
        nome: userData.nome,
        email: userData.email,
        azienda: userData.azienda,
        telefono: userData.telefono,
        dataCreazione: userData.created_at,
        ultimoAccesso: userData.ultimo_accesso,
      };


      return { user, error: null };
    } catch (error) {
      console.error("Error getting current user:", error);
      return { user: null, error };
    }
  }

  async updateProfile(userId: string, profileData: Partial<User>) {
    try {
      
      // Update user profile - BE VERY CAREFUL NOT TO OVERWRITE ROLE
      const updateData: any = {};
      
      if (profileData.nome !== undefined) updateData.nome = profileData.nome;
      if (profileData.email !== undefined) updateData.email = profileData.email;
      if (profileData.azienda !== undefined) updateData.azienda = profileData.azienda;
      if (profileData.telefono !== undefined) updateData.telefono = profileData.telefono;
      
      // NEVER update the role here unless explicitly intended
      if (profileData.role !== undefined) {
        console.warn("🚨 WARNING: Attempting to update role in updateProfile:", profileData.role);
        console.warn("🚨 This should only happen if explicitly intended!");
        // Uncomment only if you really want to update the role:
        // updateData.role = profileData.role;
      }


      const { data, error } = await supabase
        .from("users")
        .update(updateData)
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;

      console.log("🔍 AuthService updateProfile - Result from DB:", data);

      // Convert the updated data back to User format
      let userRole: UserRole;
      switch (data.role) {
        case "Creatore":
          userRole = UserRole.CREATOR;
          break;
        case "Manager":
          userRole = UserRole.MANAGER;
          break;
        case "User":
          userRole = UserRole.USER;
          break;
        default:
          userRole = UserRole.USER;
      }

      const updatedUser: User = {
        id: data.id,
        role: userRole,
        nome: data.nome,
        email: data.email,
        azienda: data.azienda,
        telefono: data.telefono,
        dataCreazione: data.created_at,
        ultimoAccesso: data.ultimo_accesso,
      };


      return { user: updatedUser, error: null };
    } catch (error) {
      console.error("Error updating profile:", error);
      return { user: null, error };
    }
  }

  async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      return { error };
    } catch (error) {
      console.error("Error resetting password:", error);
      return { error };
    }
  }

  async validateSession() {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) throw error;

      if (!session?.user) {
        return { user: null, error: null };
      }

      // Validate that user still exists in our database
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (userError) {
        // User not found in database, sign out
        await this.signOut();
        return { user: null, error: new Error("User not found in database") };
      }


      // Convert string role to UserRole enum - DO NOT CHANGE THE ROLE IN DB
      let userRole: UserRole;
      switch (userData.role) {
        case "Creatore":
          userRole = UserRole.CREATOR;
          break;
        case "Manager":
          userRole = UserRole.MANAGER;
          break;
        case "User":
          userRole = UserRole.USER;
          break;
        default:
          console.warn("Unknown role from DB:", userData.role, "defaulting to USER");
          userRole = UserRole.USER;
      }

      const user: User = {
        id: userData.id,
        role: userRole,
        nome: userData.nome,
        email: userData.email,
        azienda: userData.azienda,
        telefono: userData.telefono,
        dataCreazione: userData.created_at,
        ultimoAccesso: userData.ultimo_accesso,
      };


      return { user, error: null };
    } catch (error) {
      console.error("Error validating session:", error);
      return { user: null, error };
    }
  }

  async fetchUsers() {
    try {
      const { data, error } = await supabase.from("users").select("*");

      if (error) throw error;

      const users =
        data?.map((user) => ({
          id: user.id,
          role: user.role as UserRole,
          nome: user.nome,
          email: user.email,
          azienda: user.azienda,
          telefono: user.telefono,
          dataCreazione: user.created_at,
          ultimoAccesso: user.ultimo_accesso,
        })) || [];

      return { data: users, error: null };
    } catch (error) {
      console.error("Error fetching users:", error);
      return { data: null, error };
    }
  }

  async createUser(email: string, userData: any) {
    try {
      // First, generate a temporary password
      const tempPassword = Math.random().toString(36).slice(-10);

      // Prepare user metadata for Supabase Auth
      const userMetadata = {
        role: userData.role || UserRole.USER,
        nome: userData.nome,
        azienda: userData.azienda || "",
        telefono: userData.telefono || "",
      };

      // Create user in Auth with metadata
      const { data: authData, error: authError } =
        await supabase.auth.admin.createUser({
          email,
          password: tempPassword,
          email_confirm: true,
          user_metadata: userMetadata,
        });

      if (authError) throw authError;

      // Get the created user data for the UI
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

      if (error) throw error;

      const user: User = {
        id: data.id,
        role: data.role as UserRole,
        nome: data.nome,
        email: data.email,
        azienda: data.azienda,
        telefono: data.telefono,
        dataCreazione: data.created_at,
        ultimoAccesso: data.ultimo_accesso,
      };

      return { data: user, error: null };
    } catch (error) {
      console.error("Error creating user:", error);
      return { data: null, error };
    }
  }

  async updateUser(userId: string, userData: Partial<User>) {
    try {
      // Get the user first
      const { data: existingUser, error: fetchError } = await supabase
        .from("users")
        .select("email")
        .eq("id", userId)
        .single();

      if (fetchError) throw fetchError;

      if (!existingUser) throw new Error("User not found");

      // Update user metadata in Auth if relevant fields changed
      if (
        userData.nome ||
        userData.role ||
        userData.azienda ||
        userData.telefono
      ) {
        const { data: authUser, error: authFetchError } =
          await supabase.auth.admin.getUserById(userId);

        if (authFetchError) throw authFetchError;

        // Prepare updated metadata
        const updatedMetadata = {
          ...authUser?.user?.user_metadata,
          role: userData.role || authUser?.user?.user_metadata?.role,
          nome: userData.nome || authUser?.user?.user_metadata?.nome,
          azienda:
            userData.azienda !== undefined
              ? userData.azienda
              : authUser?.user?.user_metadata?.azienda,
          telefono:
            userData.telefono !== undefined
              ? userData.telefono
              : authUser?.user?.user_metadata?.telefono,
        };

        // Update auth user with new metadata
        const { error: authUpdateError } =
          await supabase.auth.admin.updateUserById(userId, {
            user_metadata: updatedMetadata,
            email: userData.email || undefined,
          });

        if (authUpdateError) throw authUpdateError;
      } else if (userData.email && userData.email !== existingUser.email) {
        // Update just the email if that's all that changed
        const { error: authUpdateError } =
          await supabase.auth.admin.updateUserById(userId, {
            email: userData.email,
          });

        if (authUpdateError) throw authUpdateError;
      }

      // Update user in our database
      const { data, error } = await supabase
        .from("users")
        .update({
          nome: userData.nome,
          email: userData.email,
          role: userData.role,
          azienda: userData.azienda,
          telefono: userData.telefono,
        })
        .eq("id", userId)
        .select();

      if (error) throw error;

      if (data?.length) {
        const updatedUser: User = {
          id: data[0].id,
          role: data[0].role as UserRole,
          nome: data[0].nome,
          email: data[0].email,
          azienda: data[0].azienda,
          telefono: data[0].telefono,
          dataCreazione: data[0].created_at,
          ultimoAccesso: data[0].ultimo_accesso,
        };

        return { data: updatedUser, error: null };
      }

      return { data: null, error: new Error("No data returned from update") };
    } catch (error) {
      console.error("Error updating user:", error);
      return { data: null, error };
    }
  }

  async deleteUser(userId: string) {
    try {
      // Get the user's email first
      const { data: userData, error: fetchError } = await supabase
        .from("users")
        .select("email")
        .eq("id", userId)
        .single();

      if (fetchError) throw fetchError;

      if (!userData?.email) throw new Error("User not found");

      // Delete the user from Auth using admin API
      const { error: authError } = await supabase.auth.admin.deleteUser(
        userData.email
      );

      if (authError) throw authError;

      // Delete from our database
      const { error } = await supabase.from("users").delete().eq("id", userId);

      if (error) throw error;

      return { success: true, error: null };
    } catch (error) {
      console.error("Error deleting user:", error);
      return { success: false, error };
    }
  }
}

export const authService = new AuthService();
