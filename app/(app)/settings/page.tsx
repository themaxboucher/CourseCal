import { ThemeSelector } from "@/components/ThemeSelector";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <>
      <section className="flex flex-col gap-2 max-w-[75rem] mx-auto px-8 py-16">
        <h1 className="heading-3">Settings</h1>
        <h2 className="text-lg font-medium">Profile</h2>
        <h2 className="text-lg font-medium">Theme</h2>
        <div>
          <ThemeSelector />
        </div>
        <h2 className="text-lg font-medium">Delete Account</h2>
        <p className="text-sm text-muted-foreground">
          This action is irreversible. All of your data will be permanently and
          irreversibly deleted.
        </p>
        <div>
          <Button variant="destructive">Delete account</Button>
        </div>
      </section>
    </>
  );
}
