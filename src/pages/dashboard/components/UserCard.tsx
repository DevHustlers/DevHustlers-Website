import { Eye, Pencil, Trash2 } from "lucide-react";
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
  streak: number;
  isDeleted: boolean;
}

interface UserCardProps {
  user: UserData;
  onView: (user: UserData) => void;
  onEdit: (user: UserData) => void;
  onDelete: (id: string) => void;
}

export const UserCard = ({ user, onView, onEdit, onDelete }: UserCardProps) => {
  return (
    <div className={`bg-background/80 backdrop-blur-sm border border-border rounded-2xl p-3 sm:p-5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 group cursor-pointer ${user.isDeleted ? 'opacity-60 grayscale-[0.5]' : ''}`}>
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent border border-border flex items-center justify-center text-[12px] sm:text-[14px] font-bold font-mono text-foreground shrink-0 rounded-xl group-hover:scale-110 group-hover:border-primary/30 transition-all duration-300">
            {user.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <div className="min-w-0">
            <p className="text-[13px] sm:text-[14px] font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {user.name}
            </p>
            <p className="text-[10px] sm:text-[11px] text-muted-foreground font-mono line-clamp-1 group-hover:text-foreground/70 transition-colors">
              {user.email}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
        <span className={`text-[9px] sm:text-[10px] font-mono px-1.5 sm:px-2 py-0.5 border uppercase tracking-wider group-hover:border-primary/50 transition-colors ${roleBadge(user.role)}`}>
          {user.role}
        </span>
        <span className={`text-[9px] sm:text-[10px] font-mono px-1.5 sm:px-2 py-0.5 border uppercase tracking-wider group-hover:border-primary/50 transition-colors ${statusBadge(user.status)}`}>
          {user.status}
        </span>
        {user.isDeleted && (
          <span className="text-[9px] sm:text-[10px] font-mono px-1.5 sm:px-2 py-0.5 border border-red-500/50 bg-red-500/10 text-red-500 uppercase tracking-wider">
            Deleted
          </span>
        )}
      </div>

      <div className="flex items-center justify-between pt-2.5 sm:pt-3 border-t border-border group-hover:border-primary/20 transition-colors">
        <div className="flex gap-4">
          <div>
            <p className="text-[10px] sm:text-[11px] text-muted-foreground font-mono">Points</p>
            <p className="text-[14px] sm:text-[16px] font-bold font-mono text-foreground group-hover:text-primary transition-colors">
              {user.points.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-[10px] sm:text-[11px] text-muted-foreground font-mono">Matches</p>
            <p className="text-[14px] sm:text-[16px] font-bold font-mono text-foreground group-hover:text-primary transition-colors">
              {user.attendanceCount || 0}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-0.5 sm:gap-1">
          <button onClick={() => onView(user)} className="p-1.5 sm:p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-200 group/btn" title="View">
            <Eye className="w-3.5 h-4 group-hover/btn:scale-110 transition-transform" />
          </button>
          <button onClick={() => onEdit(user)} className="p-1.5 sm:p-2 text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10 rounded-lg transition-all duration-200 group/btn" title="Edit">
            <Pencil className="w-3.5 h-4 group-hover/btn:scale-110 transition-transform" />
          </button>
          <button 
            onClick={() => onDelete(user.id)} 
            disabled={user.isDeleted}
            className={`p-1.5 sm:p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all duration-200 group/btn ${user.isDeleted ? 'invisible' : ''}`} 
            title="Delete"
          >
            <Trash2 className="w-3.5 h-4 group-hover/btn:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
