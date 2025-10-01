import { Navbar } from "@/components/Navbar";
import { getAuthUser } from "@/lib/actions/users.actions";
import { redirect } from "next/navigation";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthUser();
  if (!user) {
    redirect("/");
  }

  return (
    <main>
      <Navbar isApp={true} />
      {children}
    </main>
  );
}
