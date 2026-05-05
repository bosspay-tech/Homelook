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
    "setPrice": 180
  },
  {
    "categoryKey": "notebook",
    "displayName": "Notebook",
    "unitBasis": "1 regular school/office notebook",
    "averageUnitPrice": 40,
    "setQuantity": 10,
    "setPrice": 400
  },
  {
    "categoryKey": "paper",
    "displayName": "Paper",
    "unitBasis": "1 A4 paper ream / 500-sheet pack",
    "averageUnitPrice": 414,
    "setQuantity": 10,
    "setPrice": 4140
  },
  {
    "categoryKey": "art_supply",
    "displayName": "Art Supply",
    "unitBasis": "1 basic art supply set / colour pencil / drawing kit",
    "averageUnitPrice": 291,
    "setQuantity": 10,
    "setPrice": 2910
  },
  {
    "categoryKey": "book",
    "displayName": "Book",
    "unitBasis": "1 paperback / study / general book",
    "averageUnitPrice": 250,
    "setQuantity": 10,
    "setPrice": 2500
  },
  {
    "categoryKey": "office_tool",
    "displayName": "Office Tool",
    "unitBasis": "1 office tool set / stapler-punch combo",
    "averageUnitPrice": 296,
    "setQuantity": 10,
    "setPrice": 2960
  },
  {
    "categoryKey": "accessory",
    "displayName": "Accessory",
    "unitBasis": "1 stationery accessory / ID holder / pencil pouch",
    "averageUnitPrice": 135,
    "setQuantity": 10,
    "setPrice": 1350
  },
  {
    "categoryKey": "adhesive",
    "displayName": "Adhesive",
    "unitBasis": "1 glue stick / adhesive item",
    "averageUnitPrice": 35,
    "setQuantity": 10,
    "setPrice": 350
  },
  {
    "categoryKey": "kit",
    "displayName": "Kit",
    "unitBasis": "1 school/office stationery kit",
    "averageUnitPrice": 351,
    "setQuantity": 10,
    "setPrice": 3510
  },
  {
    "categoryKey": "stationery",
    "displayName": "Stationery",
    "unitBasis": "1 general stationery combo/set",
    "averageUnitPrice": 464,
    "setQuantity": 10,
    "setPrice": 4640
  }
];

function cleanTitle(title) {
  // Remove previously prepended prefixes like "10 Set of ", "5 Pack of "
  return title.replace(/^\d+\s+(Set|Pack)\s+of\s+/i, '');
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
    const cleanName = cleanTitle(p.title);
    const titleLower = cleanName.toLowerCase();
    let productType = p.type ? p.type.toLowerCase() : "";
    let productCategories = p.categories ? p.categories.map(c => c.toLowerCase()).join(" ") : "";
    
    // Determine best matching rule based on type, then title
    let matchedRule = null;

    for (const rule of pricingRules) {
      const key = rule.categoryKey;
      const display = rule.displayName.toLowerCase();
      
      if (productType.includes(key) || productType.includes(display) || 
          productCategories.includes(key) || productCategories.includes(display)) {
        matchedRule = rule;
        break;
      }
    }

    if (!matchedRule) {
      // Fallback to searching in the title
      for (const rule of pricingRules) {
        const key = rule.categoryKey;
        const display = rule.displayName.toLowerCase();
        // handling some specific matches
        let searchKeys = [key, display];
        if (key === 'art_supply') searchKeys.push('art', 'paint', 'color', 'colour', 'crayon');
        if (key === 'office_tool') searchKeys.push('scissor', 'stapler', 'punch', 'calculator');
        if (key === 'accessory') searchKeys.push('bag', 'pouch', 'holder');
        if (key === 'adhesive') searchKeys.push('glue', 'tape', 'sticky', 'post-it');

        if (searchKeys.some(k => titleLower.includes(k))) {
          matchedRule = rule;
          break;
        }
      }
    }

    // Default to 'stationery' if no match
    if (!matchedRule) {
      matchedRule = pricingRules.find(r => r.categoryKey === 'stationery');
    }

    // Apply the rule
    const newPrice = matchedRule.setPrice;
    let newTitle = `${matchedRule.setQuantity} Set of ${cleanName}`;
    
    console.log(`Updating [${p.id}]`);
    console.log(`  Old Title: ${p.title} | New Title: ${newTitle}`);
    console.log(`  Old Price: ${p.base_price} | New Price: ${newPrice}`);

    const { error: updateError } = await supabase
      .from("products")
      .update({
        title: newTitle,
        base_price: newPrice
      })
      .eq("id", p.id);

    if (updateError) {
      console.error(`Failed to update product ${p.id}:`, updateError);
    }
  }

  console.log("Database update complete based on provided JSON rules!");
}

main();
