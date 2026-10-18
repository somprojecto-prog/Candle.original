import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const display = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const TITLE = "CTRL + SHIFT + CANDLE — Deep Work Candle";
const DESCRIPTION = "A focused candle for concentration, creativity, and flow.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  icons: "/brand/mark.svg",
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
};

// Valor interpolado no servidor: em produção o parâmetro ?story= nunca é lido.
const ALLOW_STORY_PARAM = process.env.NODE_ENV !== "production";

const INIT_SCRIPT = `(function(){
var d=document.documentElement;
d.classList.add("js");
var on=window.matchMedia("(min-width:900px)").matches;
${
  ALLOW_STORY_PARAM
    ? 'var q=new URLSearchParams(window.location.search).get("story");if(q==="on")on=true;if(q==="off")on=false;'
    : ""
}
d.dataset.story=on?"on":"off";
})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${sans.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: INIT_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
