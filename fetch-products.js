import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://khsucxomoontucmiqfhc.supabase.co";
const SUPABASE_KEY = "sb_publishable_C17rSvnbWuNUDLoSJJZ28w_qjRsQnCG";
const STORE_ID = "pens-store";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("store_id", STORE_ID);

  if (error) {
    console.error("Error fetching products:", error);
    return;
  }

  console.log(JSON.stringify(products, null, 2));
}

main();
