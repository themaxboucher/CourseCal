import { PostHogIdentify } from "@/components/PostHogIdentify";
import { getLoggedInUser } from "@/lib/actions/users.actions";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // `/schedule` is reachable without an account — see the matcher in
  // `proxy.ts` — so there is not always someone to identify here.
  const user = await getLoggedInUser();

  return (
    <main>
      {user && <PostHogIdentify user={user} />}
      {children}
    </main>
  );
}
