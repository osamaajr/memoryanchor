import { PersonData } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface PatientScreenProps {
  person: PersonData;
  isTransitioning?: boolean;
  className?: string;
  compact?: boolean;
}

const PatientScreen = ({ person, isTransitioning = false, className, compact = false }: PatientScreenProps) => {
  const isAlone = !person.name;

  return (
    <div
      className={cn(
        "relative w-full max-w-sm mx-auto bg-card rounded-3xl border-4 border-border/50 overflow-hidden transition-all duration-500",
        isTransitioning && "scale-95 opacity-80",
        className
      )}
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      {/* Screen bezel effect */}
      <div className="absolute inset-0 rounded-3xl border border-border/20 pointer-events-none" />
      
      {/* Screen content */}
      <div className={cn(
        "flex flex-col transition-all duration-500",
        compact ? "min-h-[300px] p-4 lg:min-h-[340px]" : "p-6 lg:p-8 min-h-[400px] lg:min-h-[480px]",
        isAlone ? "bg-gradient-to-br from-teal-light via-background to-lavender-light" : "bg-card"
      )}>
        {isAlone ? (
          /* Alone/Default State */
          <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-in">
            <div
              className={cn(
                "rounded-full bg-muted flex items-center justify-center animate-pulse-soft",
                compact ? "mb-4 h-16 w-16" : "w-20 h-20 lg:w-24 lg:h-24 mb-6"
              )}
            >
              <span className={cn(compact ? "text-3xl" : "text-4xl lg:text-5xl")}>🏠</span>
            </div>
            <h3 className={cn("font-semibold text-foreground mb-2", compact ? "text-lg" : "text-xl lg:text-2xl")}>
              All is calm
            </h3>
            <p className={cn("text-muted-foreground", compact ? "text-sm" : "text-base lg:text-lg")}>
              Waiting for a visitor...
            </p>
            <div className={cn("flex items-center gap-2 text-muted-foreground", compact ? "mt-5 text-xs" : "mt-8 text-sm")}>
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse-soft" />
              <span>System ready</span>
            </div>
          </div>
        ) : (
          /* Active Person State */
          <div className="flex-1 flex flex-col animate-fade-in">
            {/* Header with avatar and name */}
            <div className={cn("flex items-start gap-4", compact ? "mb-4" : "mb-6")}>
              <div
                className={cn(
                  "rounded-2xl bg-gradient-to-br from-teal-light to-lavender-light flex items-center justify-center flex-shrink-0",
                  compact ? "h-14 w-14" : "w-16 h-16 lg:w-20 lg:h-20"
                )}
              >
                <span className={cn(compact ? "text-2xl" : "text-3xl lg:text-4xl")}>{person.avatar}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={cn("font-bold text-foreground truncate", compact ? "text-lg" : "text-xl lg:text-2xl")}>
                  {person.name}
                </h3>
                <p className={cn("text-primary font-medium", compact ? "text-sm" : "text-base lg:text-lg")}>
                  {person.relation} {person.age && `· Age ${person.age}`}
                </p>
                <div className={cn("flex items-center gap-2 mt-1 text-muted-foreground", compact ? "text-xs" : "text-sm")}>
                  <span>Last visit:</span>
                  <span className="font-medium text-foreground">{person.lastVisit}</span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className={cn("h-px bg-border/50", compact ? "mb-4" : "mb-5")} />

            {/* Last conversation */}
            <div className={cn(compact ? "mb-4" : "mb-5")}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">💬</span>
                <h4 className={cn("font-semibold text-muted-foreground uppercase tracking-wide", compact ? "text-xs" : "text-sm")}>
                  Last Conversation
                </h4>
              </div>
              <p className={cn("text-foreground leading-relaxed", compact ? "text-sm" : "text-base lg:text-lg")}>
                {person.conversationSummary}
              </p>
            </div>

            {/* Current update */}
            <div className="mt-auto">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">✨</span>
                <h4 className={cn("font-semibold text-muted-foreground uppercase tracking-wide", compact ? "text-xs" : "text-sm")}>
                  Current Update
                </h4>
              </div>
              <div className={cn("rounded-2xl bg-gradient-to-r from-teal-light to-lavender-light border border-primary/10", compact ? "p-3" : "p-4")}>
                <p className={cn("text-foreground leading-relaxed font-medium", compact ? "text-sm" : "text-base lg:text-lg")}>
                  {person.currentUpdate}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom bar (like a device) */}
      <div className="h-2 bg-border/30" />
    </div>
  );
};

export default PatientScreen;
