import { cn } from "../../../utils/cn";

export const Card = ({ children, className }) => {
  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-slate-200 shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
};
