import { useState, useEffect } from "react";
import { X, Zap } from "lucide-react";
import { FieldLabel } from "./ui/FieldLabel";
import { FieldInput } from "./ui/FieldInput";
import { FieldSelect } from "./ui/FieldSelect";
import { PrimaryBtn } from "./ui/PrimaryBtn";
import { SecondaryBtn } from "./ui/SecondaryBtn";

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

interface PointAward {
  id: string;
  user: string;
  action: string;
  points: string;
  time: string;
}

// ─── Award Points Form ───
export const AwardPointsForm = ({
  users,
  onAward,
  onCancel,
  loading = false,
}: {
  users: UserData[];
  onAward: (userId: string, userName: string, points: number, reason: string) => void;
  onCancel: () => void;
  loading?: boolean;
}) => {
  const [selectedUser, setSelectedUser] = useState(users[0]?.id || "");
  const [points, setPoints] = useState(100);
  const [reason, setReason] = useState("");

  // Sync selected user when users list loads
  useEffect(() => {
    if (users.length > 0 && !selectedUser) {
      setSelectedUser(users[0].id);
    }
  }, [users, selectedUser]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
          <div>
            <FieldLabel>User</FieldLabel>
            <FieldSelect value={selectedUser} onChange={e => setSelectedUser(e.target.value)}>
              {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </FieldSelect>
          </div>
          <div>
            <FieldLabel>Points</FieldLabel>
            <FieldInput type="number" value={points} onChange={e => setPoints(Number(e.target.value))} />
          </div>
        </div>
        <div>
          <FieldLabel>Reason</FieldLabel>
          <FieldInput value={reason} onChange={e => setReason(e.target.value)} placeholder="e.g. Manual award for outstanding contribution" />
        </div>
        <div className="flex items-center gap-2 pt-2">
          <PrimaryBtn 
            onClick={() => {
              const user = users.find(u => u.id === selectedUser);
              if (user && reason.trim()) onAward(user.id, user.name, points, reason.trim());
            }} 
            disabled={!reason.trim() || !points || loading}
          >
            {loading ? <div className="w-3.5 h-3.5 border-2 border-background/20 border-t-background rounded-full animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
            Award Points
          </PrimaryBtn>
          <SecondaryBtn onClick={onCancel}>Cancel</SecondaryBtn>
        </div>
    </div>
  );
};
