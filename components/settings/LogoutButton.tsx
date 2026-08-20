"use client";

import { logout } from "@/lib/actions/auth.actions";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { ExitFilled } from "@/components/icons";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error(error); // TODO: Remove this
    }
  };
  return (
    <Button variant="outline" onClick={handleLogout}>
      <ExitFilled className="size-4" />
      Log out
    </Button>
  );
}
