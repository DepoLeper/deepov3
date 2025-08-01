# Unas API Integráció - Tanulságok és Tapasztalatok

## 📅 Projekt: Phase 6 - Unas API v3.0 (2025.08.01)

### 🎯 **Cél elérve**: 1 termék 100% hibamentes lekérése minden adattal

---

## 🔑 **1. Azonosítás és Token kezelés**

### ✅ **Működik:**
```typescript
// API kulcs alapú login
const loginXml = `<?xml version="1.0" encoding="UTF-8"?><Params><ApiKey>${apiKey}</ApiKey></Params>`;

// Token válasz struktúra
parsed.Login.Token        // Token string
parsed.Login.Expire       // "2025.08.01 10:55:13" formátum  
parsed.Login.ShopId       // "29055"
parsed.Login.Subscription // "vip-100000"
```

### 📊 **Token kezelés:**
- **Érvényesség**: 2 óra
- **Újrafelhasználható**: Igen, több híváshoz
- **API limit**: VIP csomag = 6000 hívás/óra
- **❌ Gyakori hiba**: `parsed.Token` helyett `parsed.Login.Token`

---

## 📦 **2. Termék lekérés - getProduct**

### ✅ **Működő paraméterek:**
```xml
<Params>
  <Id>1306870988</Id>           <!-- Konkrét termék ID -->
  <StatusBase>1</StatusBase>    <!-- Csak aktív termékek -->
  <State>live</State>           <!-- Csak létező termékek -->
  <ContentType>full</ContentType> <!-- Minden mező -->
  <LimitNum>5</LimitNum>        <!-- Max eredmény szám -->
</Params>
```

### 🏷️ **Működő termék ID-k:**
- `1306870988` - Pro Formula Jegyzettömb 
- `1306869978` - Szemüvegtörlő
- `1306862343` - Bögre  
- `1303516158` - Smart Cif Pro Pack ⭐ (van akciós ár!)
- `1303329663` - Core Pack

---

## 💰 **3. Ár típusok (KRITIKUS TANULSÁG!)**

### 🔥 **Valódi akciós árak:**
```xml
<!-- Időszakos akció -->
<Price>
  <Type>sale</Type>
  <Start>2025.07.30</Start>
  <End>2025.08.05</End>
  <Net>5740.1575</Net>
  <Gross>7290.000025</Gross>
</Price>

<!-- Vevőcsoport akció -->
<Price>
  <Type>special</Type>
  <Group>200</Group>
  <SaleNet>629.9212</SaleNet>
  <SaleGross>800</SaleGross>
  <SaleStart>2017.01.01</SaleStart>
  <SaleEnd>2017.12.31</SaleEnd>
</Price>
```

### 👥 **Vevőcsoport árak (NEM akció!):**
```xml
<Price>
  <Type>special</Type>
  <Group>1230684</Group>
  <GroupName><![CDATA[Kiemelt vásárló Bronz -6%]]></GroupName>
  <Net>2354.3307</Net>
  <Gross>2989.999989</Gross>
</Price>
```

### ⚠️ **Kritikus megkülönböztetés:**
- **Akciós**: `Type="sale"` VAGY `SaleNet/SaleGross` mezők
- **Vevőcsoport**: `Type="special"` + `Group` (normál ár, nem akció!)

---

## 🏷️ **4. Kategóriák**

### 📊 **Struktúra:**
```xml
<Categories>
  <Category>
    <Type>base</Type>          <!-- base = fő kategória -->
    <Id>919110</Id>
    <Name><![CDATA[Termékválogatások|Tisztítószer csomagok]]></Name>
  </Category>
  <Category>
    <Type>alt</Type>           <!-- alt = alternatív kategória -->
    <Id>103082</Id>
    <Name><![CDATA[Top Márkáink|Cif]]></Name>
  </Category>
</Categories>
```

### 📈 **Tapasztalat:**
- **1-15 kategória** / termék
- **Pipe szeparátor**: `|` a kategória hierarchiában
- **CDATA**: Mindig `__cdata` property-ben

---

## 🖼️ **5. Képek és média**

### ✅ **Működő URL-ek:**
```typescript
imageUrl: "https://t-depo.hu/shop_ordered/29055/shop_pic/PROFORMTOMB.jpg"
imageSefUrl: "https://t-depo.hu/img/29055/PROFORMTOMB/PROFORMTOMB.jpg?time=1752565659"
```

### 📊 **Struktúra:**
- **Medium size**: `Image.Url.Medium`
- **SEF URL**: SEO friendly verzió timestamp-tel
- **Alt text**: `Image.Alt.__cdata`

---

## ⚙️ **6. Paraméterek**

### 📋 **Típusok:**
```xml
<Param>
  <Id>5627990</Id>
  <Type>text</Type>
  <Name><![CDATA[Nagyobb mennyiség esetén várható szállítási idő]]></Name>
  <Group><![CDATA[[UNAS - ne töröld ki a paramétert]]]></Group>
  <Value><![CDATA[4]]></Value>
</Param>
```

### 🎯 **Gyakori paraméterek:**
- Szállítási idő
- Google Feed címkék  
- Árukereső feed adatok
- Várható szállítási dátum

---

## 🛠️ **7. XML feldolgozás - fast-xml-parser**

### ✅ **Működő konfiguráció:**
```typescript
const xmlParser = new XMLParser({
  ignoreAttributes: false,
  parseAttributeValue: true,
  processEntities: true,
  trimValues: true,
  cdataPropName: "__cdata",
  parseCDATA: true
});
```

### ⚠️ **CDATA kezelés:**
```typescript
// ❌ ROSSZ
name: product.Name  // {__cdata: "termék név"}

// ✅ JÓ  
name: product.Name?.__cdata || product.Name
```

---

## 🎯 **8. Hibakezelés tapasztalatok**

### ❌ **Gyakori hibák:**
1. **Token hiba**: `parsed.Token` → `parsed.Login.Token`
2. **Port hiba**: 3000 → 3002 (Next.js auto-switch)
3. **Paraméter hiány**: `StatusBase`, `State` kötelező
4. **CDATA**: `__cdata` property nem használata

### ✅ **Hibamentes fejlesztés:**
- **Fokozatos tesztelés**: login → termék → teljes adatok
- **Console logging**: minden lépésnél
- **Raw XML vizsgálat**: parsing előtt
- **Külön debug endpoint-ok**: izolált tesztelés

---

## 📊 **9. Performance és limitek**

### 🚀 **Tapasztalatok:**
- **Login**: ~60ms
- **Termék lekérés**: ~250ms  
- **Token újrafelhasználás**: Működik, 2 óráig
- **Rate limit**: VIP = 6000/óra, bőven elég

### 💡 **Optimalizáció:**
- Token cache-elés ✅
- Bulk termék lekérés (LimitNum parameter)
- Csak szükséges mezők (ContentType)

---

## 🎉 **10. Sikeresen implementált funkciók**

### ✅ **UnasApiClient v1.0:**
```typescript
class UnasApiClient {
  async login(): Promise<UnasLoginResponse>
  async getProduct(id?: string): Promise<UnasProductBasic | UnasProductBasic[]>  
  async getProductFull(id: string): Promise<UnasProductFull>
  
  // Helper methods
  private parseCategories()
  private parseSalePrice()
  private parseGroupSalePrices() 
  private parseSpecialPrices()
}
```

### 🎨 **Product Viewer UI:**
- ✅ Minden termék adat megjelenítése
- ✅ Akciós árak kiemelése (AKTÍV/LEJÁRT)
- ✅ Vevőcsoport árak elkülönítése  
- ✅ Kategóriák listázása
- ✅ Responsive design

---

## 🚀 **Következő lépések**

### 📋 **Phase 6 befejezése:**
1. **Prisma Product modell**
2. **Database persistence** 
3. **Batch sync**
4. **Error monitoring**

### 🎯 **Production készség:**
- ✅ Token management
- ✅ Error handling
- ✅ Rate limiting awareness
- ✅ Data validation
- ✅ UI/UX complete

---

## 💎 **Kulcs tanulságok:**

1. **API dokumentáció != valóság**: Gyakran kell kísérletezni
2. **CDATA mindenhol**: `__cdata` property kötelező
3. **Ár típusok**: 3 különböző típus helyes megkülönböztetése kritikus
4. **Fokozatos építkezés**: Kis lépésekben, folyamatos teszteléssel
5. **Debug tooling**: Külön endpoint-ok a fejlesztéshez

---

## 🧠 **Smart Discovery Architektúra (2025.08.01 - Smart Enhancement)**

### ✅ **Kombinált Szinkronizáció Stratégia**
- **Discovery + Incremental**: Intelligens kombinált megközelítés
- **Frequency-based discovery**: Minden N-edik futásnál új termék keresés
- **Efficient filtering**: Meglévő vs. új termékek automatikus szűrése

### 🔧 **Implementáció Tanulságok:**
1. **syncRunCounter**: Persistent futásszámláló a discovery triggerhez
2. **getProductList API**: Batch-based product listing új termékek detektálásához
3. **Set-based filtering**: `seenProductIds` és `existingIdSet` a duplikáció elkerülésére
4. **Combined results**: Discovery és incremental eredmények összefésülése
5. **Configuration management**: Environment variables a discovery tuning-hoz

### 📊 **Smart Discovery Teljesítmény:**
- **60 termék ellenőrizve** (API + DB)
- **10 új termék detektálva és szinkronizálva**
- **18 változás a meglévő termékekben**
- **19.4 másodperc** kombinált futásidő
- **0% hibaarány**

---

## 📈 **Eredmény: Phase 6 COMPLETE++ (Smart Enhanced)! ✅🧠**

**Intelligens termék szinkronizáció minden szinten - TELJESÍTVE!** 