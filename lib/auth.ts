import { createClient } from "./supabase/client";

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
