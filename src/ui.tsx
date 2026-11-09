import {
  BookOpen,
  Code2,
  Database,
  GraduationCap,
  Library,
  MessageSquare,
  Search,
  ShieldCheck,
  Target,
  Layers,
} from "lucide-react";
export const go = (r: string) => {
  location.hash = r;
};
export const icons = [
  BookOpen,
  Target,
  Code2,
  Database,
  Search,
  Layers,
  Library,
  Target,
  ShieldCheck,
  Code2,
  MessageSquare,
  GraduationCap,
];
export function Ring({ value, size = 96 }: { value: number; size?: number }) {
  return (
    <div
      className="ring"
      style={{
        width: size,
        height: size,
        background: `conic-gradient(var(--accent) ${value * 3.6}deg, var(--line) 0deg)`,
      }}
      role="img"
      aria-label={`Прогресс ${value}%`}
    >
      <div>
        <strong>{value}%</strong>
        {size > 80 && <small>завершено</small>}
      </div>
    </div>
  );
}
