import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { createAdminAccount } from "@/hooks/useAuth";
import { InitAdmin } from "@/components/InitAdmin";
import { ToastProvider } from "@/components/ui/toast";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "Alumni Portal | Stay Connected with Your School Community",
  description:
    "Join our alumni network to connect with classmates, discover opportunities, and stay updated with school events.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={geist.variable}>
        <InitAdmin />
        <ToastProvider />
        {children}
      </body>
    </html>
  );
}
