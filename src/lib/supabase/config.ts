// Configuration centralisée Supabase
export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || "https://yzlcfrbdilzjrnbodszt.supabase.co",
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6bGNmcmJkaWx6anJuYm9kc3p0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1Mzg5OTIsImV4cCI6MjA2OTExNDk5Mn0.E1LT-3L6f32kq4dsFRftZz76IeTbEpw3IvssD6cLkfs",
}; 