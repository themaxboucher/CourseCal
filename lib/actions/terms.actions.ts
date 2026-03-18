"use server";

import { createClient } from "../supabase/server";

export async function getCurrentTerm() {
    const supabase = await createClient();
    const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
  
    const { data, error } = await supabase
      .from("terms")
      .select("*")
      .lte("start_date", today)
      .gte("end_date", today)
      .single();
  
    if (error) {
      console.error(error);
      throw new Error(error.message);
    }
    return data;
  }
