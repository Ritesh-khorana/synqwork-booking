import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import "@/app/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://synqwork.com"),
  title: "Synq.work | Book Meeting Rooms Instantly",
  description:
    "Investor-ready meeting room booking platform for premium workspaces, boardrooms, and collaborative hubs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="relative min-h-screen overflow-x-hidden">
          <Navbar />
          <main>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
