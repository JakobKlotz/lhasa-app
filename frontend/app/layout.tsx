// import "./globals.css";
import { Inter } from "next/font/google";
import { PublicEnvScript } from 'next-runtime-env';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "🛰 LHASA forecast",
  description: "Current landslide predictions",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* see https://github.com/yurochka-dev/pet_project/blob/PTPJ7_docker_setup/frontend/src/app/layout.tsx */}
        <PublicEnvScript />
        <link rel="icon" href="/favicon.png" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
