import type { Metadata } from "next";
import { roboto } from "./(ui)/fonts";
import "./globals.css";
import { NextAuthProvider } from "./providers";

export const metadata: Metadata = {
  title: "Administración Lacta ConsejosCreate Next App",
  description:
    "Administración de Lacta Consejos, aqui se suben los artículos que se publican en las aplicaciones moviles.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={roboto.className} suppressHydrationWarning={true}>
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  );
}
