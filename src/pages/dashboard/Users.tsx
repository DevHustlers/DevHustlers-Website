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

interface UserData {
  id: string;
  name: string;
  email: string;
  joined: string;
  points: number;
  status: "active" | "inactive" | "banned";
  role: "member" | "moderator" | "admin";
  bio: string;
}

// Helper to map DB profile to UI UserData
const mapProfileToUserData = (profile: Tables<'profiles'>): UserData => ({
  id: profile.id,
  name: profile.full_name || profile.name || "Unknown User",
  email: profile.email || "",
  joined: profile.created_at ? new Date(profile.created_at).toLocaleDateString() : "Unknown",
  points: profile.points || 0,
  status: (profile.status as any) || "active",
  role: profile.role === "admin" ? "admin" : profile.role === "mod" ? "moderator" : "member",
  bio: profile.bio || "",
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
  const { users: dbUsers, loading } = useRealtimeUsers();
  const [userFormMode, setUserFormMode] = useState<"none" | "create" | "edit">("none");
  const [editingUser, setEditingUser] = useState<UserData | undefined>();
  const [viewingUser, setViewingUser] = useState<UserData | null>(null);

  const users = dbUsers.map(mapProfileToUserData);

  const saveUser = async (user: UserData) => {
    if (userFormMode === "edit") {
      const { error } = await updateUserRoleAndPoints(user.id, mapUserDataToProfileUpdate(user));
      // Realtime hook will handle the UI update
    } else {
      // In a real app, you'd call a createUserService here. 
      // Profiles are usually created via Auth signup.
    }
    setUserFormMode("none");
    setEditingUser(undefined);
  };

  const deleteUser = async (id: string) => {
    await deleteUserService(id);
    // Realtime hook will handle the UI update
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
              onDelete={deleteUser}
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
          onSave={saveUser as any} // Using any temporarily for fast merge
          onCancel={() => {
            setUserFormMode("none");
            setEditingUser(undefined);
          }}
        />
      </BottomDrawer>

      <BottomDrawer open={!!viewingUser} onClose={() => setViewingUser(null)} title="User Details">
        {viewingUser && <UserDetail user={viewingUser} />}
      </BottomDrawer>
    </PageTransition>
  );
}
