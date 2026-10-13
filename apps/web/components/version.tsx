"use client";

export default function Version() {
  return (
    <div className="text-[0.67em] text-muted-foreground fixed p-4 right-4 bottom-0">
      <div className="">
        <i>MyCorpora v{process.env.NEXT_PUBLIC_APP_VERSION} (API v{process.env.NEXT_PUBLIC_API_VERSION})</i>
      </div>
    </div>
  );
}