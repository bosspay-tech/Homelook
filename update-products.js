import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://khsucxomoontucmiqfhc.supabase.co";
const SUPABASE_KEY = "sb_publishable_C17rSvnbWuNUDLoSJJZ28w_qjRsQnCG";
const STORE_ID = "pens-store";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("store_id", STORE_ID);

  if (error) {
    console.error("Error fetching products:", error);
    return;
  }

  for (const p of products) {
    let newPrice = 0;
    let newTitle = p.title;
    let isCombo = false;
    let comboCount = 1;

    const titleLower = p.title.toLowerCase();

    // Determine category / type to decide combo and price
    if (titleLower.includes("pen") || titleLower.includes("pencil") || titleLower.includes("marker") || titleLower.includes("eraser")) {
      // Cheap items: usually 10-50 each. Make combo.
      if (!titleLower.includes("set") && !titleLower.includes("pack")) {
        comboCount = [5, 10, 20, 50][getRandomInt(0, 3)];
        newTitle = `${comboCount} Set of ${p.title}`;
        isCombo = true;
        newPrice = comboCount * getRandomInt(20, 50); // 100 to 2500
      } else {
        newPrice = getRandomInt(150, 800);
      }
    } else if (titleLower.includes("notebook") || titleLower.includes("diary") || titleLower.includes("journal") || titleLower.includes("book")) {
      // Notebooks: usually 50-200 each.
      if (!titleLower.includes("set") && !titleLower.includes("pack")) {
        // Randomly make it a combo
        if (Math.random() > 0.4) {
          comboCount = [3, 5, 10][getRandomInt(0, 2)];
          newTitle = `${comboCount} Set of ${p.title}`;
          isCombo = true;
          newPrice = comboCount * getRandomInt(80, 250); // 240 to 2500
        } else {
          newPrice = getRandomInt(150, 400); // Single
        }
      } else {
        newPrice = getRandomInt(300, 1500);
      }
    } else if (titleLower.includes("file") || titleLower.includes("folder")) {
      // Files: usually 20-100 each.
      if (!titleLower.includes("set") && !titleLower.includes("pack")) {
        comboCount = [5, 10, 20][getRandomInt(0, 2)];
        newTitle = `${comboCount} Set of ${p.title}`;
        isCombo = true;
        newPrice = comboCount * getRandomInt(30, 80); // 150 to 1600
      } else {
        newPrice = getRandomInt(150, 600);
      }
    } else if (titleLower.includes("bag") || titleLower.includes("backpack")) {
      // Expensive, keep single
      newPrice = getRandomInt(800, 2999);
    } else if (titleLower.includes("art") || titleLower.includes("paint") || titleLower.includes("color")) {
      // Medium to Expensive
      if (Math.random() > 0.5) {
        newPrice = getRandomInt(200, 900);
      } else {
        newPrice = getRandomInt(1000, 2500);
      }
    } else {
      // Generic small item, make combo occasionally
      if (Math.random() > 0.5 && !titleLower.includes("set") && !titleLower.includes("pack")) {
        comboCount = [5, 10][getRandomInt(0, 1)];
        newTitle = `${comboCount} Pack of ${p.title}`;
        isCombo = true;
        newPrice = comboCount * getRandomInt(30, 150);
      } else {
        newPrice = getRandomInt(150, 800);
      }
    }

    // Clamp price just in case
    if (newPrice < 100) newPrice = getRandomInt(100, 150);
    if (newPrice > 3000) newPrice = getRandomInt(2500, 2999);
    
    // Round to nearest 10 for cleaner numbers
    newPrice = Math.round(newPrice / 10) * 10;

    let updatePayload = {
      base_price: newPrice,
      title: newTitle,
    };

    console.log(`Updating [${p.id}] ${p.title} -> ${newTitle} | Price: ${p.base_price} -> ${newPrice}`);

    const { error: updateError } = await supabase
      .from("products")
      .update(updatePayload)
      .eq("id", p.id);

    if (updateError) {
      console.error(`Failed to update product ${p.id}:`, updateError);
    }
  }

  console.log("Done updating all products!");
}

main();
