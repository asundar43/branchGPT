'use client';

export function BackgroundBranches() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      <div className="absolute inset-0">
        <svg className="h-full w-full opacity-[0.02]">
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M.5 50V.5H50" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        <div className="absolute inset-0">
          <div className="absolute h-full w-full animate-branch">
            <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path
                className="text-primary/5"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                d="M50,0 L50,100 M50,50 L75,25 M50,50 L25,75"
                pathLength="1"
                strokeDasharray="1"
                strokeDashoffset="1"
              />
            </svg>
          </div>
          <div className="absolute h-full w-full animate-branch-delayed">
            <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path
                className="text-primary/5"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                d="M25,0 L75,100 M75,50 L100,25 M25,50 L0,75"
                pathLength="1"
                strokeDasharray="1"
                strokeDashoffset="1"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
} 