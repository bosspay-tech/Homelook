import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://khsucxomoontucmiqfhc.supabase.co";
const SUPABASE_KEY = "sb_publishable_C17rSvnbWuNUDLoSJJZ28w_qjRsQnCG";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Qualifier → price tier index (0 = cheapest, 9 = most expensive)
const QUALIFIER_TIER = {
  student: 0, essential: 1, classic: 2, vibrant: 3, modern: 4,
  ergonomic: 5, premium: 6, professional: 7, deluxe: 8, elegant: 9,
};

// Price per type per tier — all multiples of ₹100, range ₹100–₹3000
const TYPE_PRICES = {
  "Pen":         [100, 200, 200, 300, 300, 400, 400, 500, 600, 700],
  "Notebook":    [300, 400, 500, 500, 600, 700, 800, 900, 1000, 1200],
  "Paper":       [300, 400, 400, 500, 500, 600, 700, 800, 900, 1000],
  "Art Supply":  [300, 500, 600, 700, 800, 1000, 1200, 1500, 2000, 2500],
  "Book":        [200, 400, 500, 600, 700, 800, 900, 1000, 1200, 1500],
  "Office Tool": [400, 500, 600, 700, 800, 1000, 1200, 1500, 2000, 2500],
  "Accessory":   [200, 300, 400, 400, 500, 600, 700, 800, 900, 1000],
  "Adhesive":    [100, 200, 200, 200, 300, 300, 400, 400, 500, 500],
  "Kit":         [500, 700, 800, 900, 1000, 1200, 1500, 2000, 2500, 3000],
  "Stationery":  [500, 700, 800, 900, 1000, 1200, 1500, 2000, 2500, 3000],
};

// Short combo label that replaces "Edition XX" — shown in the product title
const TYPE_LABEL = {
  "Pen":         "Pen Combo (10 Pack)",
  "Notebook":    "Notebook Set (5 Pack)",
  "Paper":       "Paper Ream (500 Sheets)",
  "Art Supply":  "Art Supply Kit",
  "Book":        "Book Bundle",
  "Office Tool": "Office Tool Kit",
  "Accessory":   "Stationery Pouch",
  "Adhesive":    "Adhesive Pack (10 Pcs)",
  "Kit":         "Stationery Kit",
  "Stationery":  "Stationery Combo Set",
};

// Descriptions per type (combo-focused)
const TYPE_DESC = {
  "Pen":         (q) => `10-pack combo of ${q} quality ball/gel pens. Smooth writing, long-lasting ink. Perfect for school, office, or home use.`,
  "Notebook":    (q) => `Set of 5 ${q} notebooks with ruled pages. Sturdy cover, acid-free paper. Great for notes, journaling, and studies.`,
  "Paper":       (q) => `${q} A4 printing paper — 500 sheets (1 ream). Bright white, 75 GSM, compatible with all inkjet and laser printers.`,
  "Art Supply":  (q) => `${q} art supply kit featuring colored pencils, sketch tools, and drawing accessories. Ideal for beginners and artists.`,
  "Book":        (q) => `Curated ${q} book bundle — perfect for students and avid readers. Great quality and great value.`,
  "Office Tool": (q) => `${q} office tool kit — includes stapler, punch, scissors, ruler, and essential desk accessories.`,
  "Accessory":   (q) => `${q} stationery pouch/organizer. Compact, durable, and stylish. Holds pens, pencils, erasers, and more.`,
  "Adhesive":    (q) => `10-piece ${q} adhesive combo — glue sticks, cello tape, double-sided tape. Essential for school and office.`,
  "Kit":         (q) => `Complete ${q} stationery kit — everything you need for school or office packed in one box. Great gifting option.`,
  "Stationery":  (q) => `Comprehensive ${q} stationery combo — pens, notebooks, sticky notes, and accessories bundled at great value.`,
};

// Real Unsplash storage-format photo IDs (format: timestamp-hash)
// Scraped directly from Unsplash search pages — verified format
const TYPE_PHOTOS = {
  "Pen": [
    "1617175093937-1eef16d106e3", "1701363529491-e646b9d11e98",
    "1628621317388-6ebde0c18574", "1610371228900-bdec68ba452c",
    "1687931162474-48e7e1a3f943", "1672338335611-006fb5b60479",
    "1550403347-9bc78e0cde30",   "1672338099451-f9f7c11a02a4",
    "1568871391149-449702439177","1518082091569-ccaa5d0c845a",
    "1774878488110-a1da46f5dc5b","1580567381231-95129c8aff42",
    "1634442490908-dc90210c8bce","1767116291082-8a34a33554d9",
    "1672866939730-066e2daaac58","1585336261022-680e295ce3fe",
    "1542810634-71277d95dcbb",   "1520121401995-928cb50bc41a",
    "1558231038-f9ff2f87a3cb",   "1621510499681-36b13b19280b",
  ],
  "Notebook": [
    "1496181133206-80ce9b88a853","1612367980327-7454a7276aa7",
    "1620275765334-4ed948bb4502","1501618669935-18b6ecb13d6d",
    "1498050108023-c5249f4df085","1695131020187-d3dcdab5016b",
    "1611186871348-b1ce696e52c9","1483546416237-76fd26bbcdd1",
    "1581431886211-6b932f8367f2","1623697899811-f2403f50685e",
    "1591195852468-03a01d1375d6","1554757387-fa0367573d09",
    "1544947950-fa07a98d237f",   "1495446815901-a7297e633e8d",
    "1512820790803-83ca734da794","1568871391149-449702439177",
    "1550403347-9bc78e0cde30",   "1610371228900-bdec68ba452c",
    "1672338335611-006fb5b60479","1518082091569-ccaa5d0c845a",
  ],
  "Paper": [
    "1503694978374-8a2fa686963a","1516409590654-e8d51fc2d25c",
    "1693592772086-e80960b134ed","1422036306541-00138cae4dbc",
    "1693031630189-a39e6d70bf22","1586162481176-7abc53f1f7c2",
    "1632047094596-851f985c6c85","1572533717789-543da73adb20",
    "1662001234358-45b7493d2bc0","1590410684548-807410022ef6",
    "1590326815757-2a287c1f1638","1705416199488-a6817f1a05ea",
    "1727159166219-37f6cb5be063","1641853988042-5443649c4319",
    "1576080871434-33d8e561213d","1496181133206-80ce9b88a853",
    "1612367980327-7454a7276aa7","1620275765334-4ed948bb4502",
    "1501618669935-18b6ecb13d6d","1483546416237-76fd26bbcdd1",
  ],
  "Art Supply": [
    "1635772367394-0bb3e8af80a3","1697122331614-515a8d2e275b",
    "1697122347902-9e01a0927b6e","1630004007975-3b60e1652cb1",
    "1588014328030-b82fb9b89ba3","1588014327854-d661babe8654",
    "1588014327911-a2aa31738d6a","1661019977720-4b570f4e7876",
    "1541535193313-a132e126fb1c","1641741490451-b7aa8f364de9",
    "1769432743402-b92f17e4fb25","1766159595257-eddd0cebe03e",
    "1752401984778-ef591cc5ba3e","1540292618247-e7fc8c43c709",
    "1643532863419-34635b131a01","1515228525701-f1eb94dc5dc1",
    "1513364776144-60967b0f800f","1502758763784-069002f232ee",
    "1544711617-6db27f8a37f5",   "1568871391149-449702439177",
  ],
  "Book": [
    "1709159057219-80439fbeddce","1599488059863-ac95a7f49193",
    "1728766001290-14e878a3d096","1760840414854-36cd365d14f1",
    "1614548428893-5fa2cb74a442","1542725752-e9f7259b3881",
    "1760840415479-438f61268bed","1604778367959-4ca516d798a7",
    "1639705123772-14bf5c45925b","1640726750945-14e894ad64e9",
    "1640726764994-de0c30491514","1599488059966-a42a2ab36991",
    "1709159124025-025379104e2f","1709159124070-f64ec4516bca",
    "1774215915219-0daacf6e5977","1544947950-fa07a98d237f",
    "1495446815901-a7297e633e8d","1512820790803-83ca734da794",
    "1496181133206-80ce9b88a853","1591195852468-03a01d1375d6",
  ],
  "Office Tool": [
    "1510070009289-b5bc34383727","1601485770484-909114dba7c0",
    "1544654251-72c96bce6af0",   "1654870525756-f3d84cf2a507",
    "1670507928573-5b02942f83d1","1764025851210-9ad5ed83e01f",
    "1642166900939-4f6b9db890ca","1542621302-f29ecbec2784",
    "1589412336918-bcae3dd7df0e","1773504356184-1c44d381743c",
    "1685478236074-3c9a2a62bd5a","1523634450041-0d0fbceb4036",
    "1507831342385-ad6240968054","1705851280899-e680bfbc0305",
    "1589412712926-0e263eb8e4df","1503694978374-8a2fa686963a",
    "1516409590654-e8d51fc2d25c","1586162481176-7abc53f1f7c2",
    "1590410684548-807410022ef6","1590326815757-2a287c1f1638",
  ],
  "Accessory": [
    "1632822300275-9867abf24bbe","1609126788187-323a73f38a4e",
    "1606417465691-cd430ee3f624","1759002321159-9e657a3bb2d2",
    "1567634088512-20ec1da1e1a5","1759344362782-28f9e1e9ce69",
    "1620093349352-3d6c6eec7fc4","1581605405631-12fa479fd9b6",
    "1581553676644-d47b1ecf00e1","1725953236941-ec8efc71b0fc",
    "1725953386283-d918bb2ac9bb","1758398332771-0a79c5df74a3",
    "1590167167718-9d345c3b52c9","1688296524545-612afbf3bf1c",
    "1671272980555-11236fd5c8c5","1558231038-f9ff2f87a3cb",
    "1621510499681-36b13b19280b","1587883012610-e3df17d41270",
    "1568871391149-449702439177","1610371228900-bdec68ba452c",
  ],
  "Adhesive": [
    "1587145717234-bc7fae25ed38","1536356915696-c6bf1c01da46",
    "1731575131075-bf333f0194ea","1771440048459-d6a088f92d41",
    "1580567379258-3795e5c3cfef","1642867501898-985eac67f30a",
    "1630513911702-cbc47361fdb0","1691519966106-45999baac06f",
    "1623673252214-e09d1080a83c","1771440048480-2e52efc74c7f",
    "1705286897249-9c58a094ecf4","1633002161416-8e2fafa0996b",
    "1536786724684-63545518d243","1731575131336-9756ecd34dbc",
    "1605333067757-55df934f07a0","1583089456248-c87d6cf33765",
    "1513519245088-0e12902e5a38","1558231038-f9ff2f87a3cb",
    "1621510499681-36b13b19280b","1587883012610-e3df17d41270",
  ],
  "Kit": [
    "1615988938302-bd2a5a7023bc","1589412336918-bcae3dd7df0e",
    "1726726192184-f06b888b9d5a","1661732017125-723f22e4f8c4",
    "1589412712926-0e263eb8e4df","1628198968052-932d5002619c",
    "1726726192153-254ea6658ca3","1584628805011-382667dc3229",
    "1693045181254-08462917f681","1726726192150-b775b921acad",
    "1755094686587-1fdc6757a69b","1730705786610-574890c9142a",
    "1661732017167-fedfee92b602","1584628805114-3e1d90e0bfed",
    "1599652300924-c8341cb74d0b","1635772367394-0bb3e8af80a3",
    "1588014328030-b82fb9b89ba3","1513364776144-60967b0f800f",
    "1544947950-fa07a98d237f",   "1495446815901-a7297e633e8d",
  ],
  "Stationery": [
    "1606327054536-e37e655d4f4a","1513077202514-c511b41bd4c7",
    "1487846698364-db1316e3d140","1765917393220-78ed33e7e07b",
    "1764044371318-c7a7d546859c","1776762249708-31d7e1579748",
    "1776762249715-525ae7025e0a","1672611500713-7f9b4693259d",
    "1527049174080-a87281343ddf","1691600252552-c39f81792a5f",
    "1635254216305-fad20e1ac9c0","1767216418975-9853643c4f10",
    "1767216516661-deb40df6f489","1541140530491-72014d42db95",
    "1615988938302-bd2a5a7023bc","1584628805011-382667dc3229",
    "1589412336918-bcae3dd7df0e","1635772367394-0bb3e8af80a3",
    "1513364776144-60967b0f800f","1544947950-fa07a98d237f",
  ],
};

function extractQualifier(title) {
  const lower = title.toLowerCase();
  for (const q of Object.keys(QUALIFIER_TIER)) {
    if (lower.includes(q)) return q;
  }
  return "modern";
}

function extractEditionNum(title) {
  // Matches "Edition 013" → "13", "Edition 01" → "1"
  const match = title.match(/edition\s+0*(\d+)/i);
  if (match) return parseInt(match[1], 10);
  return null;
}

function buildTitle(qualifier, type, editionNum) {
  const cap = qualifier.charAt(0).toUpperCase() + qualifier.slice(1);
  const label = TYPE_LABEL[type];
  if (editionNum !== null) {
    return `${cap} ${label} - No.${editionNum}`;
  }
  // "10 Set of ..." products get no edition suffix
  return `${cap} ${label}`;
}

async function main() {
  let totalUpdated = 0;
  let totalFailed = 0;

  for (const type of Object.keys(TYPE_PRICES)) {
    const { data: products, error } = await supabase
      .from("products")
      .select("id, title, type")
      .eq("type", type)
      .order("title");

    if (error) {
      console.error(`Error fetching ${type}:`, error);
      continue;
    }

    console.log(`\n=== ${type} (${products.length} products) ===`);

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const qualifier = extractQualifier(product.title);
      const tier = QUALIFIER_TIER[qualifier] ?? 4;
      const price = TYPE_PRICES[type][Math.min(tier, TYPE_PRICES[type].length - 1)];
      const editionNum = extractEditionNum(product.title);
      const title = buildTitle(qualifier, type, editionNum);
      const photoIds = TYPE_PHOTOS[type];
      const imageUrl = `https://images.unsplash.com/photo-${photoIds[i % photoIds.length]}?q=80&w=800&auto=format&fit=crop`;
      const qualifierCap = qualifier.charAt(0).toUpperCase() + qualifier.slice(1);
      const description = TYPE_DESC[type](qualifierCap);

      const { error: updateError } = await supabase
        .from("products")
        .update({ title, base_price: price, image_url: imageUrl, description })
        .eq("id", product.id);

      if (updateError) {
        console.error(`  FAILED [${product.id}]:`, updateError.message);
        totalFailed++;
      } else {
        console.log(`  ✓ ${title}  →  ₹${price}`);
        totalUpdated++;
      }
    }
  }

  console.log(`\n========================================`);
  console.log(`Done.  Updated: ${totalUpdated}  |  Failed: ${totalFailed}`);
}

main();
