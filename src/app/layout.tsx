import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PLE - L'excellence événementielle",
  description: "Découvrez bientôt notre nouveau catalogue de matériel technique et simplifiez vos demandes de devis.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/3DAsset/Meshy_AI_Neon_Screen_Cube_compressed.glb" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/ScreenDisplay/front.webm" as="video" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
