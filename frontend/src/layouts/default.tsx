import { Navbar } from "@/components/Navbar/navbar";
import Footer from "@/components/Footer";
import { siteConfig } from "@/config/site";

export default function DefaultLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen">
      <Navbar config={siteConfig} />
      <main className="container mx-auto max-w-7xl px-6 flex-grow pt-8">
        {children}
      </main>
      <footer className="w-full flex items-center justify-center py-3">
        <Footer />
      </footer>
    </div>
  );
}
