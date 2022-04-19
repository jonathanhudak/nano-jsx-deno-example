export * from "https://deno.land/x/nano_jsx@v0.0.30/mod.ts";
import { setup } from "https://esm.sh/twind";
import {
  shim,
  virtualSheet,
  getStyleTag,
  TW,
  Configuration,
  VirtualSheet,
} from "https://esm.sh/twind/shim/server";
// import typography from "https://esm.sh/@twind/typography";

let SHEET_SINGLETON: VirtualSheet | null = null;
function createSheet(twOptions = {}) {
  return (SHEET_SINGLETON ??= setupSheet(twOptions));
}

// Setup TW sheet singleton
function setupSheet(twOptions: Configuration) {
  const sheet = virtualSheet();
  setup({ ...twOptions, sheet, plugins: {} });
  return sheet;
}

export interface SSRSettings {
  pathname?: string;
  clearState?: boolean;
  tw?: TW;
}

export function buildStyleTagForSSR(ssr: string, options?: SSRSettings) {
  const sheet = createSheet(options?.tw);
  sheet.reset();
  shim(ssr, { tw: options?.tw });
  const styleTag = getStyleTag(sheet);
  return styleTag;
}
