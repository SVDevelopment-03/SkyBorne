import type { Metadata } from "next";
import "./globals.css";
import RouteWrapper from "./RouteWrapper";
import { ReduxProvider } from "./provider";
import { Toaster } from "react-hot-toast";
import TopLoaderClient from "./TopLoader";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ConsoleSilencer from "@/components/ConsoleSilencer";

export const metadata: Metadata = {
  title: "Skyborne Drop",
    icons: {
    icon: '/skyborne-logo.png',
  },
  description:
    "Skyborne Drop offers expert-led yoga, fitness, zumba, and nutrition for balanced living.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
        >
          <ConsoleSilencer />
          <TopLoaderClient />
          <ReduxProvider>
            <RouteWrapper>
              {children}
              <Toaster position="top-right" />
            </RouteWrapper>
          </ReduxProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
