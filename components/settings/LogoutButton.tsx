"use client";

import { logout } from "@/lib/actions/users.actions";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

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
      <LogOut className="size-4" />
      Log out
    </Button>
  );
}
