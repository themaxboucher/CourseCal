import { Navbar } from "@/components/Navbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <Navbar isApp={true} />
      {children}
    </main>
  );
}
