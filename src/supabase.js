import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://aeprkxactbaysfsbkkss.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_IHZdvt9jujRTx3smyO-nrg_DsrStkoN";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
