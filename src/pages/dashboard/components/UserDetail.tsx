import { Mail } from "lucide-react";
import { roleBadge, statusBadge } from "./ui/badges";

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
}

export const UserDetail = ({ user }: { user: UserData }) => {
  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-accent border border-border flex items-center justify-center text-[16px] sm:text-[20px] font-bold font-mono text-foreground shrink-0 rounded-xl">
          {user.name.split(" ").map((n) => n[0]).join("")}
        </div>
        <div className="flex-1 space-y-2 sm:space-y-3 w-full">
          <div>
            <h4 className="text-[16px] sm:text-[18px] font-bold text-foreground">{user.name}</h4>
            <p className="text-[12px] sm:text-[13px] text-muted-foreground flex items-center gap-2">
              <Mail className="w-3.5 h-3.5" /> {user.email}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className={`text-[9px] sm:text-[10px] font-mono px-1.5 sm:px-2 py-0.5 border uppercase tracking-wider ${statusBadge(user.status)}`}>
              {user.status}
            </span>
            <span className={`text-[9px] sm:text-[10px] font-mono px-1.5 sm:px-2 py-0.5 border uppercase tracking-wider ${roleBadge(user.role)}`}>
              {user.role}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-2">
            <div className="border border-border p-2 sm:p-3">
              <p className="text-[10px] sm:text-[11px] text-muted-foreground font-mono uppercase">Points</p>
              <p className="text-[16px] sm:text-[20px] font-bold font-mono text-foreground">{user.points.toLocaleString()}</p>
            </div>
            <div className="border border-border p-2 sm:p-3">
              <p className="text-[10px] sm:text-[11px] text-muted-foreground font-mono uppercase">Joined</p>
              <p className="text-[12px] sm:text-[14px] font-medium text-foreground">{user.joined}</p>
            </div>
            <div className="border border-border p-2 sm:p-3">
              <p className="text-[10px] sm:text-[11px] text-muted-foreground font-mono uppercase">Attended</p>
              <p className="text-[12px] sm:text-[15px] font-bold text-primary font-mono tabular-nums">{user.attendanceCount || 0}</p>
            </div>
          </div>
          {user.bio && (
            <div className="pt-2">
              <p className="text-[10px] sm:text-[11px] text-muted-foreground font-mono uppercase mb-1">Bio</p>
              <p className="text-[12px] sm:text-[13px] text-foreground">{user.bio}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
