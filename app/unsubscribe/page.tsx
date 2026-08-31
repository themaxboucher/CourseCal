import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import UnsubscribePanel from "@/components/UnsubscribePanel";

export const metadata: Metadata = {
  title: "Unsubscribe",
  robots: { index: false, follow: false },
};

// Reached from a link in an email, so it has to render for someone with no
// session. The panel below is a Client Component because the token it needs
// lives in the URL fragment, which never reaches the server.
export default function UnsubscribePage() {
  return (
    <main>
      <Navbar />
      <UnsubscribePanel />
    </main>
  );
}
