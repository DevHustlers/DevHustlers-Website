import { useState } from "react";
import { Plus } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { BottomDrawer } from "./components/BottomDrawer";
import { useLanguage } from "@/i18n/LanguageContext";
import { PrimaryBtn } from "./components/ui/PrimaryBtn";
import { UserForm } from "./components/UserForm";
import { UserCard } from "./components/UserCard";
import { UserDetail } from "./components/UserDetail";
import { updateUserRoleAndPoints, deleteUser as deleteUserService } from "@/services/users.service";
import { useRealtimeUsers } from "@/hooks/useRealtimeUsers";
import type { Tables } from "@/types/database";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface UserData {
  id: string;
  name: string;
  email: string;
  joined: string;
  points: number;
  status: "active" | "inactive" | "banned";
  role: "member" | "moderator" | "admin";
  bio: string;
  attendanceCount: number;
  streak: number;
  isDeleted: boolean;
}

// Helper to map DB profile to UI UserData
const mapProfileToUserData = (profile: any): UserData => ({
  id: profile.id,
  name: profile.full_name || profile.name || "Unknown User",
  email: profile.email || "",
  joined: profile.created_at ? new Date(profile.created_at).toLocaleDateString() : "Unknown",
  points: profile.points || 0,
  status: (profile.status as any) || "active",
  role: profile.role === "admin" ? "admin" : profile.role === "mod" ? "moderator" : "member",
  bio: profile.bio || "",
  attendanceCount: profile.attendance_count || 0,
  streak: profile.streak_count || 0,
  isDeleted: profile.is_deleted || false,
});

// Helper to map UI UserData to DB profile update
const mapUserDataToProfileUpdate = (user: UserData) => ({
  full_name: user.name,
  points: user.points,
  status: (user.status === "banned" ? "inactive" : user.status) as "active" | "inactive",
  role: (user.role === "admin" ? "admin" : user.role === "moderator" ? "mod" : "user") as "admin" | "mod" | "user",
  bio: user.bio,
});

export default function Users() {
  const { t } = useLanguage();
  const [showDeleted, setShowDeleted] = useState(false);
  const [showPioneers, setShowPioneers] = useState(false);
  const { users: dbUsers, loading } = useRealtimeUsers(showDeleted);
  const [userFormMode, setUserFormMode] = useState<"none" | "create" | "edit">("none");
  const [editingUser, setEditingUser] = useState<UserData | undefined>();
  const [viewingUser, setViewingUser] = useState<UserData | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Custom sorting and filtering for Pioneers
  const users = dbUsers
    .map(mapProfileToUserData)
    .sort((a, b) => {
      if (showPioneers) {
        // Sort by joined date ascending for pioneers
        return new Date(a.joined).getTime() - new Date(b.joined).getTime();
      }
      // Default to what came from DB (likely newest first)
      return 0;
    })
    .filter((_, index) => {
      if (showPioneers) return index < 100;
      return true;
    });

  const saveUser = async (user: UserData) => {
    setIsSaving(true);
    try {
      if (userFormMode === "edit") {
        const { error } = await updateUserRoleAndPoints(user.id, mapUserDataToProfileUpdate(user));
        if (error) throw new Error(error);
        toast.success(t("dash.user_updated") || "User updated successfully");
      } else {
        // Warning: Creating auth users requires admin privileges/Edge functions
        // Here we just toast a placeholder if they try to "Add"
        toast.error("User creation is handled via Auth Signup. You can only edit profiles here.");
      }
      setUserFormMode("none");
      setEditingUser(undefined);
    } catch (err: any) {
      toast.error(err.message || "Failed to save user");
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    try {
      const { error } = await deleteUserService(userToDelete.id);
      if (error) throw new Error(error);
      toast.success("User profile deleted successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete user");
    } finally {
      setIsDeleting(false);
      setUserToDelete(null);
    }
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="bg-background/80 backdrop-blur-md border border-border/50 rounded-2xl p-4 md:p-6 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <div>
              <p className="text-[12px] sm:text-[13px] text-muted-foreground">
                {t("dash.managing")}{" "}
                <span className="text-foreground font-medium">{users.length}</span>{" "}
                {t("dash.users_label")}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={showDeleted} 
                  onChange={(e) => setShowDeleted(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-border text-primary focus:ring-primary/20 cursor-pointer"
                />
                <span className="text-[11px] sm:text-[12px] font-mono uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">
                  Show Deleted
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group px-3 py-1.5 bg-accent/30 rounded-lg border border-border/50 hover:border-primary/30 transition-all">
                <input 
                  type="checkbox" 
                  checked={showPioneers} 
                  onChange={(e) => setShowPioneers(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-border text-primary focus:ring-primary/20 cursor-pointer"
                />
                <span className="text-[11px] sm:text-[12px] font-mono uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">
                  {t("dash.first_100")}
                </span>
              </label>
              <PrimaryBtn
                onClick={() => {
                  setUserFormMode("create");
                  setEditingUser(undefined);
                  setViewingUser(null);
                }}
              >
                <Plus className="w-3.5 h-3.5" /> <span className="hidden sm:inline">{t("dash.add_user")}</span><span className="sm:hidden">Add</span>
              </PrimaryBtn>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {users.map((user) => (
            <UserCard 
              key={user.id}
              user={user}
              onView={setViewingUser}
              onEdit={(u) => {
                setUserFormMode("edit");
                setEditingUser(u);
                setViewingUser(null);
              }}
              onDelete={() => setUserToDelete(user)}
            />
          ))}
        </div>
      </div>

      <BottomDrawer
        open={userFormMode !== "none"}
        onClose={() => {
          setUserFormMode("none");
          setEditingUser(undefined);
        }}
        title={userFormMode === "edit" ? t("dash.edit_user") : t("dash.add_user")}
      >
        <UserForm
          initial={editingUser}
          isEdit={userFormMode === "edit"}
          onSave={saveUser as any} 
          onCancel={() => {
            setUserFormMode("none");
            setEditingUser(undefined);
          }}
          loading={isSaving}
        />
      </BottomDrawer>

      <BottomDrawer open={!!viewingUser} onClose={() => setViewingUser(null)} title="User Details">
        {viewingUser && <UserDetail user={viewingUser} />}
      </BottomDrawer>

      <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <AlertDialogContent className="rounded-2xl border-2 border-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-bold">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the profile for <span className="text-foreground font-semibold">{userToDelete?.name}</span>. 
              Note: This only deletes the profile record, not the user's authentication account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 gap-2">
            <AlertDialogCancel className="rounded-xl border-2 border-foreground hover:bg-accent transition-colors">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
              disabled={isDeleting}
              className="rounded-xl bg-red-500 hover:bg-red-600 border-2 border-foreground text-white font-bold transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
            >
              {isDeleting ? "Deleting..." : "Yes, Delete User"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageTransition>
  );
}
