"use server";

import { createClient } from "../supabase/server";

export async function sendMagicLink(email: string) {
  // Check if the email is a valid UCalgary email
  if (!email.toLowerCase().endsWith("@ucalgary.ca")) {
    throw new Error("Invalid email");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL!}/verify`,
    },
  });

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data;
}

export async function verifyMagicLink(code: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data;
}

export async function logout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return true;
}