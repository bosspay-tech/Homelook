import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://khsucxomoontucmiqfhc.supabase.co";
const SUPABASE_KEY = "sb_publishable_C17rSvnbWuNUDLoSJJZ28w_qjRsQnCG";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 20 unique Unsplash photo IDs per category — sourced from live Unsplash search results
const PHOTO_MAP = {
  "Pen": [
    "jAn8D0wFpRA", "d_eLSvL4v9w", "oJG9HOVKGMs", "19j818eW0s8", "T10L2G79_f4",
    "JDPDMaINjko", "FHCVK6Vyvwc", "LFGAatMUDvc", "GX04izVr8J0", "Q5Sb5Pq-T1s",
    "1lbmrKTx8gQ", "N3o-leQyFsI", "wW8pabUQ3Ts", "9-kKRL6aiik", "uNzsvDXXQQQ",
    "_oP5ErcnVXE", "4VZQkcMVSUE", "h2QUaIqhK64", "s55xuIpXMlA", "F2gePrhUQZo"
  ],
  "Notebook": [
    "7lbwo1IphY0", "23DJT9jCaCM", "MbFjW6bIWeA", "Fex5h-pTaGg", "BflbjyCfCMw",
    "unG0JXWL1qg", "CZzsObIgY8A", "aoHxE-YDQ3w", "QKmXZW9js3Y", "X0UhINgPVNA",
    "7dDCTqgpRKo", "YmHsOd8Z9A0", "pcpk5a6-Lss", "anRJHETloCM", "ZGMmMDu6P6s",
    "27ONlfrPb2Y", "vkW3NyTp7wU", "8BwV7ljV7DA", "-60GBgGrkCU", "ajSG_cVll_k"
  ],
  "Paper": [
    "VrtpFQxMSKA", "Wq4lqogZKMY", "IT3vmbEHNiw", "RDFuXgo2mzE", "pDC58dnDADA",
    "R_J3nOqe9Kw", "HAPxiYXMrYM", "KAO2-CRZXTE", "UjjEB5Aw3XI", "pX9-dfmqGG4",
    "CYrYxz-uvE4", "g9_KP2fvFII", "2Kzy6ibhwJk", "YUkJoaEdZBU", "QRykXu51r_0",
    "p6F7fWJ_Sco", "18XAbiTc1hU", "Tzm3Oyu_6sk", "PtabTe6iJ_8", "CGnoRQZGWmw"
  ],
  "Art Supply": [
    "2xy-iRP6ElE", "l3N9Q27zULw", "tYnnY7gKyZs", "2LJ4rqK2qfU", "YuV5-o2UChg",
    "Fe3xy9C9wow", "49iJ7bzbCoI", "Ef9iOXzS6o0", "taJrbotABJ8", "vZCc-uJCpns",
    "STe5HONyfhM", "nNe4HwY_iY0", "WeprDvVOi2c", "nKF2QcKsYx4", "-MDJDYKQz6E",
    "ytCgBnQrylI", "ChUolzd2xTI", "rngTKHXumy0", "dnGgAIRNnsE", "xMPwYAoVEh4"
  ],
  "Book": [
    "v_JlQ0O1Iuo", "zMRLZh40kms", "9pw4TKvT3po", "WWD93Icc30Y", "TQ_HBbATnYY",
    "is6wQqySb_8", "2nMotuZOpk4", "2tviiXahtlY", "90gz3pn2AdQ", "QD5ZaqtZgW4",
    "heNLI144X7Y", "OhFBfI36-Ak", "2fy_cREFuT0", "lIGbgwYamhU", "Iw3FRNx8aEI",
    "U-AxzNL54UQ", "ev-RMgGI_Ck", "4TQ0ScETMT8", "cAnUiVqBBUE", "X2WqPoPcGE8"
  ],
  "Office Tool": [
    "UK1_hixzRtg", "7_bz84zOU7g", "wunVFNvqhfE", "KkP3sVoD7Tg", "9OKGEVJiTKk",
    "zv5QSKaP8G8", "fr7SSrc43AQ", "AdV3Nds-Uog", "n205UbNhy7E", "UHqfUTDmdC4",
    "McomGcCj6IQ", "iCzesDdn_gQ", "ZDYN7azwO6c", "6nFDw-XZQlI", "mvrjtnA9l-s",
    "ESU6-sf0wPQ", "J8aCh0qKCXY", "flhooV2fbdg", "K4QYxZlabUE", "UKIRZGCbtU4"
  ],
  "Accessory": [
    "7L7u-lg-Be8", "Q5Sb5Pq-T1s", "9nuHmadulLk", "AmOm6BDUcMM", "unRHoOg8FPM",
    "06CE33PclHg", "6BC7k2i7Ds4", "C7eQtdkINpc", "aSCqImNEmkk", "wMzhBrzvQ8s",
    "621JeIPLux4", "9gWNfJehqhQ", "mZ3DEHZU_HU", "jggSkHxMRug", "55tvNfo6Lp4",
    "AtpjYtfoUAg", "zS5bPnNuIfw", "f-GGGLZSte8", "KnyUKDQAkBU", "mn-S1NQjDpw"
  ],
  "Adhesive": [
    "uNY9ldu247k", "IDaeLeKiie0", "uYGlkouvs0c", "8pYVLSL9c5Q", "is3HFrt08-U",
    "0yqzZGfpPx4", "E3IcPzvtawE", "lBGdqqMBZvc", "SjaIXkbzCoQ", "AbzVFD8WpJ8",
    "83JGQvynR5Y", "Q8T6uXXx2ek", "Z8GO3NdiIIU", "p10qtOive_E", "ICby_SuqtgI",
    "nPjvPEJycMc", "mD_hhSKTZow", "PD0mkhOrrLs", "2OnDGsZBOkY", "TRDqPtcN58o"
  ],
  "Kit": [
    "mZ3DEHZU_HU", "J_galDuu4kc", "JcMURhAPNGk", "U2wo_lbSs4c", "tetoRESP8D0",
    "4ZsQt8OtSSs", "Vq1sd62o0us", "a_XCQcs2iYA", "BzoXzWDWXMQ", "r63-psbUCwk",
    "JwWD6sb12Bw", "lZgzdzSZa8k", "OAtnClpgunk", "SAjMYUuCFm4", "7_bz84zOU7g",
    "6BC7k2i7Ds4", "uHeFocdiILU", "AgqqKnn0n98", "6CgtAUsFcUI", "f0KqSCQIJm0"
  ],
  "Stationery": [
    "VbLUQFCvGtw", "KigTvXqetXA", "7_bz84zOU7g", "zv5QSKaP8G8", "NPfRJYnTjSw",
    "bF2vsubyHcQ", "9OKGEVJiTKk", "fr7SSrc43AQ", "UKIRZGCbtU4", "UPFj-YdsnUw",
    "hF7I1Bka8e0", "xygwKLIjDJ4", "AdV3Nds-Uog", "uWh-hYisqAw", "E8tfVlVdtOo",
    "PyaJJf5kK0o", "5lfT46WujFg", "CNsHjjU3BTo", "NS8LH7G2bxw", "lNSgyatImTA"
  ]
};

function buildImageUrl(photoId) {
  return `https://images.unsplash.com/photo-${photoId}?q=80&w=800&auto=format&fit=crop`;
}

async function main() {
  let totalUpdated = 0;
  let totalFailed = 0;

  for (const [type, photoIds] of Object.entries(PHOTO_MAP)) {
    const { data: products, error } = await supabase
      .from("products")
      .select("id, title, type")
      .eq("type", type)
      .order("title");

    if (error) {
      console.error(`Error fetching ${type} products:`, error);
      continue;
    }

    console.log(`\n=== ${type} (${products.length} products) ===`);

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const photoId = photoIds[i % photoIds.length];
      const newImageUrl = buildImageUrl(photoId);

      const { error: updateError } = await supabase
        .from("products")
        .update({ image_url: newImageUrl })
        .eq("id", product.id);

      if (updateError) {
        console.error(`  FAILED [${product.title}]:`, updateError.message);
        totalFailed++;
      } else {
        console.log(`  ✓ ${product.title}`);
        console.log(`    → photo-${photoId}`);
        totalUpdated++;
      }
    }
  }

  console.log(`\n========================================`);
  console.log(`Done. Updated: ${totalUpdated} | Failed: ${totalFailed}`);
}

main();
