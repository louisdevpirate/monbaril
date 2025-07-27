import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://yzlcfrbdilzjrnbodszt.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6bGNmcmJkaWx6anJuYm9kc3p0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1Mzg5OTIsImV4cCI6MjA2OTExNDk5Mn0.E1LT-3L6f32kq4dsFRftZz76IeTbEpw3IvssD6cLkfs"
);
