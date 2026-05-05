import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://khsucxomoontucmiqfhc.supabase.co";
const SUPABASE_KEY = "sb_publishable_C17rSvnbWuNUDLoSJJZ28w_qjRsQnCG";
const STORE_ID = "pens-store";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const categoryImages = {
  "Pen": [
    "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?q=80&w=800&auto=format&fit=crop", // elegant pen
    "https://images.unsplash.com/photo-1581345939223-10d65b7463f5?q=80&w=800&auto=format&fit=crop", // fountain pen
    "https://images.unsplash.com/photo-1520121401995-928cb50bc41a?q=80&w=800&auto=format&fit=crop", // notebook with pen
    "https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=800&auto=format&fit=crop"
  ],
  "Notebook": [
    "https://images.unsplash.com/photo-1531346878377-a5be20888e57?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1516414447565-b14be0adf13e?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?q=80&w=800&auto=format&fit=crop"
  ],
  "Paper": [
    "https://images.unsplash.com/photo-1603504381830-dfa0544521bd?q=80&w=800&auto=format&fit=crop", // stack of paper
    "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=80&w=800&auto=format&fit=crop", // blank paper
    "https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=800&auto=format&fit=crop"
  ],
  "Art Supply": [
    "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&auto=format&fit=crop", // brushes
    "https://images.unsplash.com/photo-1544711617-6db27f8a37f5?q=80&w=800&auto=format&fit=crop", // colored pencils
    "https://images.unsplash.com/photo-1502758763784-069002f232ee?q=80&w=800&auto=format&fit=crop", // crayons
    "https://images.unsplash.com/photo-1515228525701-f1eb94dc5dc1?q=80&w=800&auto=format&fit=crop"  // painting set
  ],
  "Book": [
    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop", // open book
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=800&auto=format&fit=crop"
  ],
  "Office Tool": [
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop", // desk items
    "https://images.unsplash.com/photo-1542452255-1f9e160e11ba?q=80&w=800&auto=format&fit=crop", // stapler / pins
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop"
  ],
  "Accessory": [
    "https://images.unsplash.com/photo-1621510499681-36b13b19280b?q=80&w=800&auto=format&fit=crop", // pencil pouch
    "https://images.unsplash.com/photo-1558231038-f9ff2f87a3cb?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1587883012610-e3df17d41270?q=80&w=800&auto=format&fit=crop"
  ],
  "Adhesive": [
    "https://images.unsplash.com/photo-1583089456248-c87d6cf33765?q=80&w=800&auto=format&fit=crop", // tape
    "https://images.unsplash.com/photo-1605333067757-55df934f07a0?q=80&w=800&auto=format&fit=crop", // washi tape
    "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop"
  ],
  "Kit": [
    "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=800&auto=format&fit=crop", // gift wrap / kit
    "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?q=80&w=800&auto=format&fit=crop", // desk set
    "https://images.unsplash.com/photo-1533560904424-a0c61dc306fc?q=80&w=800&auto=format&fit=crop"
  ],
  "Stationery": [
    "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=800&auto=format&fit=crop", // flatlay stationery
    "https://images.unsplash.com/photo-1505322022379-7c3353ee6291?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?q=80&w=800&auto=format&fit=crop"
  ]
};

function getRandomElement(arr) {
  if (!arr || arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  console.log("Deleting old inactive products...");
  
  const { error: deleteError } = await supabase
    .from("products")
    .delete()
    .eq("store_id", STORE_ID)
    .eq("is_active", false);

  if (deleteError) {
    console.error("Error deleting old products:", deleteError);
  } else {
    console.log("Successfully deleted old products.");
  }

  console.log("Fetching active products to update images...");
  
  const { data: activeProducts, error: fetchError } = await supabase
    .from("products")
    .select("id, type")
    .eq("store_id", STORE_ID)
    .eq("is_active", true);

  if (fetchError) {
    console.error("Error fetching active products:", fetchError);
    return;
  }

  console.log(`Found ${activeProducts.length} active products to update.`);
  
  let successCount = 0;
  for (const product of activeProducts) {
    const images = categoryImages[product.type] || categoryImages["Stationery"];
    const newImageUrl = getRandomElement(images);

    const { error: updateError } = await supabase
      .from("products")
      .update({ image_url: newImageUrl })
      .eq("id", product.id);

    if (updateError) {
      console.error(`Failed to update product ${product.id}:`, updateError);
    } else {
      successCount++;
    }
  }

  console.log(`Successfully updated images for ${successCount} products.`);
}

main();
