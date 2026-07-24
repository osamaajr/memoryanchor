import { lazy, Suspense, useCallback, useState } from "react";
import {
  Camera,
  Check,
  ScanFace,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PatientScreen from "@/components/PatientScreen";
import {
  howItWorksSteps,
  mockPeople,
} from "@/data/mockData";
import type { PersonData } from "@/data/mockData";
import { cn } from "@/lib/utils";

const FaceManager = lazy(() => import("@/components/FaceManager"));
const FaceScanner = lazy(() => import("@/components/FaceScanner"));

type ViewMode = "home" | "recognition" | "manage" | "guide";
type PageTransitionPhase = "idle" | "exiting" | "entering";

const PAGE_EXIT_MS = 260;
const PAGE_ENTER_MS = 560;
const PAGE_ENTER_START_DELAY_MS = 36;

interface HomeAction {
  id: Exclude<ViewMode, "home">;
  title: string;
  buttonClass: string;
}

const blackPillButton =
  "border border-[#171a1d] bg-[#080a0c] text-white shadow-[inset_0_1px_0_rgb(255_255_255_/_0.32),0_1px_2px_rgb(9_11_13_/_0.22),0_10px_20px_-15px_rgb(9_11_13_/_0.9)] hover:bg-[#14171a]";

const whitePillButton =
  "border border-[#090b0d]/12 bg-[linear-gradient(180deg,rgb(255_255_255_/_0.95),rgb(255_255_255_/_0.68))] text-[#090b0d] shadow-[inset_0_1px_0_rgb(255_255_255_/_1),inset_0_-12px_24px_rgb(255_255_255_/_0.28),0_2px_4px_rgb(9_11_13_/_0.08),0_18px_38px_-22px_rgb(9_11_13_/_0.42)] backdrop-blur-xl hover:bg-[linear-gradient(180deg,rgb(255_255_255_/_1),rgb(255_255_255_/_0.78))]";

const homeActions: HomeAction[] = [
  {
    id: "recognition",
    title: "Scan Face",
    buttonClass: blackPillButton,
  },
  {
    id: "manage",
    title: "Manage Faces",
    buttonClass: whitePillButton,
  },
  {
    id: "guide",
    title: "How It Works",
    buttonClass: whitePillButton,
  },
];

const viewCopy: Record<Exclude<ViewMode, "home">, { title: string; description: string }> = {
  recognition: {
    title: "Scan Face",
    description: "Run the scanner and show a calm patient-facing reminder when someone is recognized.",
  },
  manage: {
    title: "Manage Faces",
    description: "Caregivers can add familiar people, relationship context, and recent updates.",
  },
  guide: {
    title: "How It Works",
    description: "A short walkthrough of the recognition flow and the responsible design boundaries.",
  },
};

const workspaceBackdrop = (
  <>
    <div
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(circle at 18% 10%, hsl(186 70% 91% / 0.62) 0%, transparent 30rem), radial-gradient(circle at 80% 16%, hsl(92 55% 88% / 0.54) 0%, transparent 28rem), linear-gradient(135deg, hsl(154 42% 28%) 0%, hsl(169 45% 30%) 46%, hsl(95 32% 61%) 100%)",
      }}
    />
    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background/35 via-background/10 to-transparent" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(174_62%_90%_/_0.18)_0%,transparent_48%)]" />
  </>
);

const Index = () => {
  const [activeView, setActiveView] = useState<ViewMode>("home");
  const [isScanning, setIsScanning] = useState(false);
  const [currentPerson, setCurrentPerson] = useState<PersonData>(mockPeople.alone);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);
  const [pageTransitionPhase, setPageTransitionPhase] = useState<PageTransitionPhase>("idle");

  const transitionToView = useCallback((view: ViewMode) => {
    if (view === activeView || isPageTransitioning) {
      return;
    }

    setIsPageTransitioning(true);
    setPageTransitionPhase("exiting");

    window.setTimeout(() => {
      setActiveView(view);
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      setPageTransitionPhase("entering");

      window.setTimeout(() => {
        setPageTransitionPhase("idle");
      }, PAGE_ENTER_START_DELAY_MS);

      window.setTimeout(() => {
        setIsPageTransitioning(false);
      }, PAGE_ENTER_MS + PAGE_ENTER_START_DELAY_MS);
    }, PAGE_EXIT_MS);
  }, [activeView, isPageTransitioning]);

  const handlePersonDetected = useCallback((person: PersonData | null) => {
    if (!person) {
      setCurrentPerson(mockPeople.alone);
      return;
    }

    setCurrentPerson((previousPerson) => {
      if (person.id === previousPerson.id) {
        return previousPerson;
      }

      setIsTransitioning(true);
      window.setTimeout(() => {
        setCurrentPerson(person);
        setIsTransitioning(false);
      }, 300);

      return previousPerson;
    });
  }, []);

  const goHome = () => {
    transitionToView("home");
    setIsScanning(false);
    setCurrentPerson(mockPeople.alone);
    setIsTransitioning(false);
  };

  const renderBackButton = () => (
    <button
      type="button"
      onClick={goHome}
      className={cn(
        "absolute left-6 top-6 z-20 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-colors sm:left-10 sm:top-10 lg:left-16 lg:top-16",
        whitePillButton
      )}
    >
      Back
    </button>
  );

  const renderHome = () => (
    <main className="relative z-10 flex min-h-screen items-center justify-center">
      <section
        className="relative flex min-h-screen w-full overflow-hidden bg-sky text-[#090b0d] animate-fade-in"
        style={{
          backgroundImage:
            "linear-gradient(180deg, hsl(184 74% 91% / 0.34) 0%, hsl(184 64% 94% / 0.18) 38%, hsl(103 57% 72% / 0.02) 100%), url('/memoryanchor-hero-landscape.png')",
          backgroundPosition: "center bottom",
          backgroundSize: "cover",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at center, hsl(178 80% 98% / 0.42) 0%, hsl(178 80% 98% / 0.22) 30%, hsl(178 80% 98% / 0.06) 52%, transparent 68%)",
          }}
        />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-sky/35 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-primary/18 via-primary/[0.02] to-transparent" />

        <div className="relative z-10 flex w-full flex-col">
          <nav className="flex items-center justify-between px-6 py-5 sm:px-10 lg:px-16">
            <button
              type="button"
              onClick={goHome}
              className="font-serif text-lg font-semibold italic tracking-tight text-[#090b0d]"
              aria-label="MemoryAnchor home"
            >
              MemoryAnchor
            </button>

            <div className="hidden items-center gap-8 text-[11px] font-medium text-[#090b0d]/80 md:flex">
              <button type="button" onClick={() => transitionToView("home")} className="transition-colors hover:text-[#090b0d]">
                Home
              </button>
              <button type="button" onClick={() => transitionToView("recognition")} className="transition-colors hover:text-[#090b0d]">
                Recognition
              </button>
              <button type="button" onClick={() => transitionToView("manage")} className="transition-colors hover:text-[#090b0d]">
                Faces
              </button>
              <button type="button" onClick={() => transitionToView("guide")} className="transition-colors hover:text-[#090b0d]">
                Guide
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => transitionToView("recognition")}
                className={cn("rounded-full px-5 py-2 text-[11px] font-medium transition-colors", blackPillButton)}
              >
                Start
              </button>
            </div>
          </nav>

          <div className="relative mx-auto flex flex-1 max-w-5xl flex-col items-center justify-center px-6 pb-28 pt-16 text-center sm:px-10 lg:pt-8">
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[24rem] w-[min(58rem,92vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f5fffb]/20 blur-3xl" />
            <h1
              className="relative max-w-4xl font-serif text-5xl font-semibold leading-[0.98] tracking-tight text-[#090b0d] sm:text-6xl lg:text-7xl"
              style={{
                textShadow:
                  "0 2px 30px hsl(178 80% 98% / 0.95), 0 1px 0 hsl(178 80% 98% / 0.7)",
              }}
            >
              Bring{" "}
              <span className="relative -mx-2 inline-block px-2 py-1 align-baseline">
                <span
                  className="relative inline-block px-1 italic text-[hsl(154_42%_28%)]"
                  style={{
                    lineHeight: 1.08,
                    textShadow: "0 1px 0 hsl(178 80% 98% / 0.5), 0 12px 30px hsl(154 42% 28% / 0.3)",
                  }}
                >
                  clarity
                </span>
              </span>{" "}
              to every conversation
            </h1>
            <p className="relative mx-auto mt-6 max-w-2xl text-sm font-normal leading-relaxed text-[#090b0d]/60 sm:text-base">
              MemoryAnchor gives caregivers one calm place to recognize familiar faces, manage memory notes, and support meaningful moments.
            </p>

            <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              {homeActions.map((action) => {
                return (
                  <button
                    key={action.id}
                    type="button"
                    onClick={() => transitionToView(action.id)}
                    className={cn(
                      "group flex min-h-9 min-w-[5.5rem] items-center justify-center rounded-full px-5 py-2 text-[11px] font-medium backdrop-blur transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#090b0d]/35 focus-visible:ring-offset-2",
                      action.buttonClass
                    )}
                  >
                    {action.title}
                  </button>
                );
              })}
            </div>
          </div>

          <p className="mx-auto w-full max-w-3xl px-6 pb-5 text-center text-[9px] font-medium leading-snug text-[#090b0d]/35 sm:px-10">
            Prototype only. Not for medical or emergency use. Use with consent and review privacy/biometric requirements before real use.
          </p>
        </div>
      </section>
    </main>
  );

  const renderViewHeader = (view: Exclude<ViewMode, "home">, compact = false) => {
    const copy = viewCopy[view];

    return (
      <div className={cn("relative flex flex-col items-center text-center", compact ? "mb-5 pt-8" : "mb-10 pt-10")}>
        <div className="flex max-w-3xl flex-col items-center">
          <h1
            className={cn(
              "font-serif font-semibold leading-[0.95] tracking-tight text-white",
              "text-5xl sm:text-6xl lg:text-7xl"
            )}
          >
            {copy.title}
          </h1>
          <p
            className={cn(
              "max-w-2xl leading-relaxed text-white/78",
              compact ? "mt-3 text-xs sm:text-sm" : "mt-6 text-sm sm:text-base"
            )}
          >
            {copy.description}
          </p>
        </div>
      </div>
    );
  };

  const renderRecognition = () => (
    <main className="relative z-10 h-screen w-full overflow-hidden bg-primary text-primary-foreground">
      {workspaceBackdrop}
      {renderBackButton()}

      <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col px-4 pb-4 sm:px-6 lg:px-8 lg:pb-6">
        {renderViewHeader("recognition", true)}

        <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_380px]">
          <section className="flex min-h-0 flex-col rounded-2xl border border-border/70 bg-card/80 p-4 shadow-card backdrop-blur">
            <div className="mb-3 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-foreground">Camera Scanner</h2>
                <p className="text-xs text-muted-foreground">
                  Local prototype recognition for now. Rekognition can replace this service layer later.
                </p>
              </div>
              <Button variant="soft" size="sm" onClick={() => transitionToView("manage")}>
                Manage
              </Button>
            </div>
            <Suspense
              fallback={
                <div className="flex min-h-[260px] flex-1 items-center justify-center rounded-2xl border border-border/70 bg-background/60 text-muted-foreground">
                  Loading scanner...
                </div>
              }
            >
              <FaceScanner
                onPersonDetected={handlePersonDetected}
                isScanning={isScanning}
                onScanningChange={setIsScanning}
                compact
                className="min-h-0 flex-1 justify-center"
              />
            </Suspense>
          </section>

          <section className="flex min-h-0 flex-col rounded-2xl border border-border/70 bg-card/80 p-4 shadow-card backdrop-blur">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-foreground">Patient Display</h2>
                <p className="text-xs text-muted-foreground">The calm reminder screen the patient sees.</p>
              </div>
              <span
                className={cn(
                  "rounded-full px-3 py-1 text-[10px] font-bold uppercase",
                  isScanning ? "bg-teal-light text-primary" : "bg-muted text-muted-foreground"
                )}
              >
                {isScanning ? "Live" : "Ready"}
              </span>
            </div>
            <PatientScreen
              person={currentPerson}
              isTransitioning={isTransitioning}
              compact
              className="max-w-none"
            />
          </section>
        </div>
      </div>
    </main>
  );

  const renderManage = () => (
    <main className="relative z-10 min-h-screen w-full overflow-hidden bg-primary text-primary-foreground">
      {workspaceBackdrop}
      {renderBackButton()}

      <div className="container relative z-10 mx-auto px-4 pb-16 sm:px-6 lg:px-8">
        {renderViewHeader("manage")}

        <section className="rounded-3xl border border-border/70 bg-card/80 p-5 shadow-card backdrop-blur lg:p-8">
          <Suspense
            fallback={
              <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-border/70 bg-background/60 text-muted-foreground">
                Loading face manager...
              </div>
            }
          >
            <FaceManager />
          </Suspense>
        </section>
      </div>
    </main>
  );

  const renderGuide = () => (
    <main className="relative z-10 min-h-screen w-full">
      <section className="relative flex min-h-screen w-full overflow-hidden bg-primary p-6 text-primary-foreground sm:p-10 lg:p-16">
        {workspaceBackdrop}
        {renderBackButton()}

        <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center justify-center text-center">
          <h1 className="font-serif text-5xl font-semibold leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
            How It Works
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-white/78 sm:text-base">
            A familiar face is enrolled once, recognized when they visit, then shown with gentle context for the moment.
          </p>

          <div className="mt-14 grid w-full gap-4 md:grid-cols-3">
            {howItWorksSteps.map((step) => (
              <article
                key={step.step}
                className="relative flex min-h-[22.5rem] flex-col overflow-hidden rounded-2xl border border-white/18 bg-white/[0.13] p-5 text-left shadow-[inset_0_1px_0_rgb(255_255_255_/_0.2),0_24px_60px_-36px_rgb(9_11_13_/_0.45)] backdrop-blur"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-base font-bold text-white">{step.title}</h2>
                    <p className="mt-3 max-w-[17rem] text-[11px] leading-relaxed text-white/68">
                      {step.description}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-white/78">{step.step}</span>
                </div>

                {step.step === 1 && (
                  <div className="mt-auto flex h-[12.75rem] items-end justify-center pt-8">
                    <div className="h-[11.25rem] w-full max-w-[18rem] rounded-[1.7rem] border border-white/24 bg-white/[0.08] p-3 shadow-glow">
                      <div className="grid h-full grid-rows-[5.75rem_3.25rem] gap-3">
                        <div className="grid h-full grid-cols-[3.5rem_1.25rem_minmax(0,1fr)] items-center gap-2 rounded-[1.35rem] border border-white/22 bg-white/[0.06] p-2">
                          <div className="flex h-14 w-14 items-center justify-center rounded-[1rem] border border-white/30 bg-white/[0.12] text-white">
                            <div className="relative flex h-10 w-10 items-center justify-center rounded-[0.75rem] border border-white/28">
                              <ScanFace className="h-6 w-6 text-white/88" strokeWidth={1.7} />
                              <span className="absolute left-1/2 top-1 h-8 w-px -translate-x-1/2 bg-white/18" />
                              <span className="absolute left-1 top-1/2 h-px w-8 -translate-y-1/2 bg-white/18" />
                            </div>
                          </div>

                          <svg
                            aria-hidden="true"
                            className="h-5 w-5 text-white/70"
                            viewBox="0 0 28 28"
                            fill="none"
                          >
                            <path
                              d="M5 14H21"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                            <path
                              d="M15 8L21 14L15 20"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>

                          <div className="flex h-[4.75rem] min-w-0 flex-col justify-center rounded-[1rem] bg-white p-2 text-[#090b0d] shadow-[0_18px_38px_-24px_rgb(9_11_13_/_0.52)]">
                            <div className="flex items-center justify-between gap-2 text-[10px] font-bold leading-none">
                              <span className="truncate">Face enrolled</span>
                              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-teal-light text-primary">
                                <Check className="h-3 w-3" />
                              </span>
                            </div>
                            <div className="mt-1.5 flex items-center gap-2 rounded-[0.85rem] bg-muted p-1.5">
                              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                                V
                              </span>
                              <div className="min-w-0">
                                <div className="truncate text-[10px] font-bold">Visitor</div>
                                <div className="mt-0.5 truncate text-[9px] font-semibold text-muted-foreground">Saved face</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid h-full grid-cols-[2rem_minmax(0,1fr)] items-center gap-3 rounded-[1.1rem] border border-white/14 bg-white/[0.12] px-3 py-2 text-white">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/18">
                            <Check className="h-4 w-4" />
                          </span>
                          <div className="min-w-0">
                            <div className="text-[10px] font-bold uppercase text-white/62">Profile saved</div>
                            <div className="truncate text-xs font-bold">Ready for recognition</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step.step === 2 && (
                  <div className="mt-auto flex h-[12.75rem] items-end justify-center pt-8">
                    <div className="h-[11.25rem] w-full max-w-[18rem] rounded-[1.7rem] border border-white/24 bg-white/[0.08] p-3 shadow-glow">
                      <div className="grid h-full grid-rows-[5.75rem_3.25rem] gap-3">
                        <div className="grid h-full grid-cols-[3.5rem_1.25rem_minmax(0,1fr)] items-center gap-2 rounded-[1.35rem] border border-white/22 bg-white/[0.06] p-2">
                            <div className="flex h-14 w-14 items-center justify-center rounded-[1rem] border border-white/24 bg-white/[0.1] text-white">
                              <Camera className="h-7 w-7 text-white/72" strokeWidth={1.6} />
                            </div>

                            <svg
                              aria-hidden="true"
                              className="h-5 w-5 text-white/70"
                              viewBox="0 0 28 28"
                              fill="none"
                            >
                              <path
                                d="M5 14H21"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                              />
                              <path
                                d="M15 8L21 14L15 20"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>

                            <div className="flex h-[4.75rem] min-w-0 flex-col justify-center rounded-[1rem] bg-white px-2 py-2 text-[#090b0d] shadow-[0_18px_38px_-24px_rgb(9_11_13_/_0.52)]">
                              <div className="text-center text-[13px] font-extrabold leading-none">
                                Match detected
                              </div>
                              <div className="mt-2 grid grid-cols-[1.65rem_minmax(0,1fr)_2.35rem] items-center gap-2">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-primary/10 bg-white text-primary shadow-[0_12px_26px_-18px_rgb(9_11_13_/_0.45)]">
                                  <Check className="h-3.5 w-3.5" strokeWidth={2.6} />
                                </span>
                                <div className="h-2 overflow-hidden rounded-full bg-primary/12">
                                  <div className="h-full w-[82%] rounded-full bg-primary" />
                                </div>
                                <span className="justify-self-end rounded-full border border-primary/10 bg-white px-2 py-0.5 text-[10px] font-extrabold text-primary shadow-[0_10px_22px_-18px_rgb(9_11_13_/_0.5)]">
                                  98%
                                </span>
                              </div>
                            </div>
                        </div>

                        <div className="grid h-full grid-cols-[2rem_minmax(0,1fr)] items-center gap-3 rounded-[1.1rem] border border-white/14 bg-white/[0.12] px-3 py-2 text-white shadow-[inset_0_1px_0_rgb(255_255_255_/_0.16)]">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/18">
                            <Check className="h-4 w-4" />
                          </span>
                          <div className="min-w-0">
                            <div className="text-[10px] font-bold uppercase text-white/62">Detection ready</div>
                            <div className="truncate text-xs font-bold">Visitor profile ready</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step.step === 3 && (
                  <div className="mt-auto flex h-[12.75rem] items-end justify-center pt-8">
                    <div className="h-[11.25rem] w-full max-w-[18rem] rounded-[1.7rem] border border-white/24 bg-white/[0.08] p-3 shadow-glow">
                      <div className="grid h-full grid-rows-[5.75rem_3.25rem] gap-3">
                        <div className="grid h-full grid-cols-[3.5rem_1.25rem_minmax(0,1fr)] items-center gap-2 rounded-[1.35rem] border border-white/22 bg-white/[0.06] p-2">
                          <div className="flex h-14 w-14 items-center justify-center rounded-[1rem] border border-white/24 bg-white/[0.1] text-white">
                            <Check className="h-7 w-7 text-white/78" strokeWidth={1.8} />
                          </div>

                          <svg
                            aria-hidden="true"
                            className="h-5 w-5 text-white/70"
                            viewBox="0 0 28 28"
                            fill="none"
                          >
                            <path
                              d="M5 14H21"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                            <path
                              d="M15 8L21 14L15 20"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>

                          <div className="flex h-[4.75rem] min-w-0 flex-col justify-center rounded-[1rem] bg-white p-2 text-[#090b0d] shadow-[0_18px_38px_-24px_rgb(9_11_13_/_0.52)]">
                            <div className="mb-2 flex items-center justify-between gap-3">
                              <span className="truncate text-[11px] font-bold">Visitor profile</span>
                              <span className="rounded-full bg-teal-light px-1.5 py-0.5 text-[9px] font-bold text-primary">Ready</span>
                            </div>
                            <div className="flex items-center gap-2 rounded-[0.85rem] bg-muted p-1.5">
                              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                                V
                              </span>
                              <div className="min-w-0">
                                <div className="truncate text-[10px] font-bold">Known visitor</div>
                                <div className="mt-0.5 truncate text-[9px] font-semibold text-primary">Family member</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid h-full grid-cols-[2rem_minmax(0,1fr)] items-center gap-3 rounded-[1.1rem] border border-white/14 bg-white/[0.12] px-3 py-2 text-white shadow-[inset_0_1px_0_rgb(255_255_255_/_0.16)]">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/18">
                            <Check className="h-4 w-4" />
                          </span>
                          <div className="min-w-0">
                            <div className="text-[10px] font-bold uppercase text-white/62">Memory cue</div>
                            <div className="truncate text-xs font-bold">Conversation context ready</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );

  return (
    <div className="relative min-h-screen overflow-x-hidden gradient-hero">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div
        className={cn(
          "page-shell-transition min-h-screen origin-center transform-gpu will-change-[opacity,transform,filter] motion-reduce:transform-none",
          pageTransitionPhase === "exiting" && "scale-[0.985] opacity-0 blur-[1px]",
          pageTransitionPhase === "entering" && "scale-[0.992] opacity-0 blur-[1px]",
          pageTransitionPhase === "idle" && "scale-100 opacity-100 blur-0"
        )}
      >
        {activeView === "home" && renderHome()}
        {activeView === "recognition" && renderRecognition()}
        {activeView === "manage" && renderManage()}
        {activeView === "guide" && renderGuide()}
      </div>

      <div
        className={cn(
          "page-transition-overlay pointer-events-none fixed inset-0 z-50 bg-[radial-gradient(circle_at_center,hsl(174_62%_90%_/_0.28)_0%,hsl(154_42%_28%_/_0.07)_40%,transparent_72%)]",
          pageTransitionPhase === "exiting" && "opacity-28",
          pageTransitionPhase === "entering" && "opacity-16",
          pageTransitionPhase === "idle" && "opacity-0"
        )}
      />
    </div>
  );
};

export default Index;
