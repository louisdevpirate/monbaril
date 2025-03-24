import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://lamakhykbdoxeotcfafq.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhbWFraHlrYmRveGVvdGNmYWZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3NjQ3NjQsImV4cCI6MjA1ODM0MDc2NH0.urp6nb4LeHA2GeljItV6IBDl4H6_xGMPMWNMq3XhCSk"
);
