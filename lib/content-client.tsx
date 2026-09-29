"use client";

import { createContext, useContext } from "react";
import type { Content } from "@/lib/content-types";

/**
 * Server components await getContent(); client components read it here.
 * The root layout fetches once and provides it, so both see the same
 * merged document without any prop drilling.
 */
const Ctx = createContext<Content | null>(null);

export function ContentProvider({
  value,
  children,
}: {
  value: Content;
  children: React.ReactNode;
}) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useContent(): Content {
  const c = useContext(Ctx);
  if (!c) throw new Error("useContent must be used inside <ContentProvider>");
  return c;
}
