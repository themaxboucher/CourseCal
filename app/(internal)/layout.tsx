import { Navbar } from "@/components/Navbar";

export default function InternalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <Navbar isLoggedIn={true} />
      {children}
    </main>
  );
}
