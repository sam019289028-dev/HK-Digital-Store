const SUPABASE_URL = "https://pfudrowsqtbtsenltdvj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_Rii-VztSYVlFEEeMx5dhoA_KOBmcMIx";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
window.SUPABASE_URL = SUPABASE_URL;
window.SUPABASE_PUBLISHABLE_KEY = SUPABASE_PUBLISHABLE_KEY;
window.supabaseClient = supabaseClient;
