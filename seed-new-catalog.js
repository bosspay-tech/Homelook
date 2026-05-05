import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://khsucxomoontucmiqfhc.supabase.co";
const SUPABASE_KEY = "sb_publishable_C17rSvnbWuNUDLoSJJZ28w_qjRsQnCG";
const STORE_ID = "pens-store";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const pricingRules = [
  {
    "categoryKey": "pen",
    "displayName": "Pen",
    "unitBasis": "1 basic ball/gel pen",
    "averageUnitPrice": 18,
    "setQuantity": 10,
    "setPrice": 180,
    "keywords": "pen,writing"
  },
  {
    "categoryKey": "notebook",
    "displayName": "Notebook",
    "unitBasis": "1 regular school/office notebook",
    "averageUnitPrice": 40,
    "setQuantity": 10,
    "setPrice": 400,
    "keywords": "notebook,diary"
  },
  {
    "categoryKey": "paper",
    "displayName": "Paper",
    "unitBasis": "1 A4 paper ream / 500-sheet pack",
    "averageUnitPrice": 414,
    "setQuantity": 10,
    "setPrice": 4140,
    "keywords": "paper,stack"
  },
  {
    "categoryKey": "art_supply",
    "displayName": "Art Supply",
    "unitBasis": "1 basic art supply set / colour pencil / drawing kit",
    "averageUnitPrice": 291,
    "setQuantity": 10,
    "setPrice": 2910,
    "keywords": "art,paint,drawing"
  },
  {
    "categoryKey": "book",
    "displayName": "Book",
    "unitBasis": "1 paperback / study / general book",
    "averageUnitPrice": 250,
    "setQuantity": 10,
    "setPrice": 2500,
    "keywords": "book,reading"
  },
  {
    "categoryKey": "office_tool",
    "displayName": "Office Tool",
    "unitBasis": "1 office tool set / stapler-punch combo",
    "averageUnitPrice": 296,
    "setQuantity": 10,
    "setPrice": 2960,
    "keywords": "office,stapler,scissor"
  },
  {
    "categoryKey": "accessory",
    "displayName": "Accessory",
    "unitBasis": "1 stationery accessory / ID holder / pencil pouch",
    "averageUnitPrice": 135,
    "setQuantity": 10,
    "setPrice": 1350,
    "keywords": "pouch,stationary"
  },
  {
    "categoryKey": "adhesive",
    "displayName": "Adhesive",
    "unitBasis": "1 glue stick / adhesive item",
    "averageUnitPrice": 35,
    "setQuantity": 10,
    "setPrice": 350,
    "keywords": "glue,tape"
  },
  {
    "categoryKey": "kit",
    "displayName": "Kit",
    "unitBasis": "1 school/office stationery kit",
    "averageUnitPrice": 351,
    "setQuantity": 10,
    "setPrice": 3510,
    "keywords": "kit,stationery"
  },
  {
    "categoryKey": "stationery",
    "displayName": "Stationery",
    "unitBasis": "1 general stationery combo/set",
    "averageUnitPrice": 464,
    "setQuantity": 10,
    "setPrice": 4640,
    "keywords": "stationery,desk"
  }
];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate realistic adjectives for naming variations
const adjectives = ["Premium", "Classic", "Modern", "Essential", "Professional", "Student", "Deluxe", "Ergonomic", "Vibrant", "Elegant"];

async function main() {
  console.log("Deactivating existing products...");
  const { error: deactivateError } = await supabase
    .from("products")
    .update({ is_active: false })
    .eq("store_id", STORE_ID)
    .eq("is_active", true);

  if (deactivateError) {
    console.error("Error deactivating products:", deactivateError);
    return;
  }
  console.log("Old products successfully deactivated.");

  console.log("Generating and inserting new catalog...");
  
  const newProducts = [];
  let globalIndex = 1;

  for (const rule of pricingRules) {
    const categoryName = rule.displayName;
    const catKeys = rule.keywords.split(",");
    
    // We want 20 items per category
    for (let i = 1; i <= 20; i++) {
      let isSet = (i === 20); // The 20th item is the combo set
      
      let title = "";
      let price = 0;
      
      const randomAdjective = adjectives[getRandomInt(0, adjectives.length - 1)];

      if (isSet) {
        title = `${rule.setQuantity} Set of ${randomAdjective} ${categoryName}`;
        price = rule.setPrice;
      } else {
        title = `${randomAdjective} ${categoryName} Edition 0${i}`;
        // Jitter the price around averageUnitPrice by +/- 20%, ensuring it's an integer
        const variance = rule.averageUnitPrice * 0.2;
        price = Math.round(rule.averageUnitPrice + (Math.random() * variance * 2) - variance);
        if (price <= 0) price = 10; // safety floor
      }
      
      // Use loremflickr for beautiful distinct category-specific images
      const searchKeyword = catKeys[getRandomInt(0, catKeys.length - 1)];
      const imageUrl = `https://loremflickr.com/800/800/${searchKeyword}?lock=${globalIndex}`;

      newProducts.push({
        store_id: STORE_ID,
        title: title,
        base_price: price,
        type: categoryName,
        categories: [categoryName, "batch_v2"],
        image_url: imageUrl,
        is_active: true,
        description: isSet 
            ? `A comprehensive ${rule.setQuantity}-piece set of ${categoryName.toLowerCase()}s. This ${categoryName.toLowerCase()} is perfect for all your needs. ${rule.unitBasis}.` 
            : `A high-quality ${randomAdjective.toLowerCase()} ${categoryName.toLowerCase()} for daily use. This ${categoryName.toLowerCase()} is perfect for all your needs. ${rule.unitBasis}.`,
        created_at: new Date().toISOString()
      });
      
      globalIndex++;
    }
  }

  console.log(`Inserting ${newProducts.length} new products into Supabase...`);
  
  // Insert in batches of 50 to avoid any potential payload limits
  for (let i = 0; i < newProducts.length; i += 50) {
    const batch = newProducts.slice(i, i + 50);
    const { error: insertError } = await supabase
      .from("products")
      .insert(batch);
      
    if (insertError) {
      console.error(`Error inserting batch ${i / 50 + 1}:`, insertError);
    } else {
      console.log(`Successfully inserted batch ${i / 50 + 1}`);
    }
  }
  
  console.log("Database seed complete! 200 fresh products are now live.");
}

main();
