import { Navbar } from "@/components/Navbar";
import DeleteAccount from "@/components/settings/DeleteAccount";
import { LogoutButton } from "@/components/settings/LogoutButton";
import UpdateProfileForm from "@/components/settings/UpdateProfileForm";
import { ThemeSelector } from "@/components/ThemeSelector";
import { Button } from "@/components/ui/button";
import { getLoggedInUser } from "@/lib/actions/users.actions";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await getLoggedInUser();
  if (!user) {
    redirect("/");
  }

  return (
    <>
      <Navbar />
      <section className="flex flex-col gap-2 max-w-[45rem] mx-auto px-8 py-12">
        <div className="space-y-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/schedule">
                  <ArrowLeft className="size-6" />
                </Link>
              </Button>
              <h1 className="heading-3">Settings</h1>
            </div>
            <p className="text-muted-foreground">
              💬 Got feedback? Send questions, feature requests, bug reports,
              love letters, or hate mail to{" "}
              <a href="mailto:max@maxboucher.com" className="text-primary">
                max@maxboucher.com
              </a>
              .
            </p>
          </div>
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-medium">Account</h2>
              <p className="text-muted-foreground">
                Currently logged in as{" "}
                <span className="font-medium">{user?.email}</span>
              </p>
            </div>
            <LogoutButton />
          </div>
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Profile</h2>
            <UpdateProfileForm user={user} />
          </div>
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Appearance</h2>
            <ThemeSelector />
          </div>
          <div className="space-y-4 p-6 border rounded-lg bg-destructive/10 border-destructive/30 shadow-xs">
            <div>
              <h2 className="text-lg font-medium">Delete Account</h2>
              <p className="text-muted-foreground">
                This action is irreversible. All of your data will be
                permanently and irreversibly deleted.
              </p>
            </div>

            <DeleteAccount user={user} />
          </div>
        </div>
      </section>
    </>
  );
}
