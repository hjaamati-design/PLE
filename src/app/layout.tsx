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
      <body>
        {children}
      </body>
    </html>
  );
}
