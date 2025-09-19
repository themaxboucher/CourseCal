import { Navbar } from "@/components/Navbar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <Navbar isApp={true} />
      {children}
    </main>
  );
}
