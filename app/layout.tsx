import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/ui/Header";

export const metadata: Metadata = {
  title: {
    default: "MEDER — Spot on.",
    template: "%s | MEDER",
  },
  description:
    "Tell MEDER what you're looking for. We'll help you choose your spot.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="overflow-x-hidden">
        <div className="min-h-screen w-full overflow-x-hidden">
          <Header />

          {children}

          <footer id="site-footer">
            {/* MEDER footer will be built later */}
          </footer>
        </div>
      </body>
    </html>
  );
}