import { Manrope, Merriweather } from "next/font/google";

const resumeSerif = Merriweather({
  variable: "--font-resume-serif",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

const resumeModern = Manrope({
  variable: "--font-resume-modern",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const resumeRouteFontVariables = [
  resumeSerif.variable,
  resumeModern.variable,
].join(" ");
