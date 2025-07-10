# Deepo.hu - SEO Tartalomgenerátor Eszköz

## Projekt Lényege

Egy olyan online eszközt hozunk létre a T-DEPO (www.t-depo.hu) marketingesei számára, amellyel a lehető leg SEO barátabb tartalmakat tudják létrehozni a webáruház számára.

**A cég profilja:** A T-DEPO egy online nagykereskedés, amely higiéniai és munkavédelmi termékek, tisztítószerek és takarítóeszközök széles választékát kínálja cégeknek, intézményeknek és magánszemélyeknek. Több mint 8000 terméket forgalmaznak, kiemelt márkáik a Hartmann, a Tork, a Mr. Proper Professional és a Schülke. A cég az innovatív, online és ügyfélközpontú szolgáltatásra fókuszál.

**Támogatott tartalomtípusok:**
- Blog cikkek
- Termékleírások
- Termékkategória leírások
- Hírlevél szövegek
- Social hirdetés szövegek

## Alapvető Funkciók

- **Zárt Rendszer:** Az alkalmazás a `deepo.ubli.hu` subdomainen fog futni, és csak bejelentkezés után lesz elérhető.
- **Felhasználókezelés:**
    - Bejelentkezés email címmel és jelszóval.
    - Adminisztrátori fiók, ami új tagokat tud felvenni a rendszerbe.
    - Meghívó küldése emailben az új felhasználóknak.
    - Jogosultságkezelési rendszer.
- **Technológia:**
    - A szöveggenerálás a ChatGPT API-n keresztül történik.
    - Az adatok (termékek, kategóriák) a webáruház Unas API-jából érkeznek.
    - Az automatizációs feladatokat (pl. időzített cikk generálás) n8n segítségével oldjuk meg.
- **Felhasználói Felület (UI):**
    - A különböző generátorok menüpontokba vannak rendezve.
    - A design letisztult, minimalista és intuitív, "glassmorphism" stílusjegyekkel.
    - Beépített, modern és ingyenes szövegszerkesztő.
- **Funkcionális követelmények:**
    - **SEO Ellenőrzés:** Egy pontrendszer mutatja minden generált szöveg SEO értékét.
    - **Interaktív Finomítás:** Minden generátornál lehetőség van egy input mezőn keresztül finomítani a generált tartalmakon a ChatGPT segítségével.
    - **Formázott Másolás:** A generált tartalmak egy gombnyomással, formázásukat megőrizve kimásolhatók, hogy más HTML szerkesztőkbe zökkenőmentesen beilleszthetők legyenek.

## Specifikus Generátorok

### Blog Generátor
- **Manuális generálás:**
    - Terjedelem (200-2000 szó, sliderrel).
    - Hangnem (Közvetlen, Szakmai).
    - Típus (Edukatív, Vicces, Érdekesség, Toplista, Termékajánló, Kategória ajánló, Márka ajánló).
    - Téma megadása kulcsszóval, vagy URL beillesztésével (több URL is lehetséges).
- **Automata generálás:**
    - Manuális indítással véletlenszerű cikk generálása.
    - Időzítve, minden nap 3 új cikk generálása.
- **Interfész:**
    - Naptár nézet a cikkek ütemezéséhez.
    - Lista nézet a cikkeknek, ahol a státuszuk (Vázlat, Jóváhagyva, Ütemezve, Élesítve) és a generálás módja (manuális/automata) is látszik.

### Kategória- és Termékleírás Generátor
- **Adatszinkronizáció:** Kategóriák és termékek napi szinkronizálása az Unas API-n keresztül.
- **Generálás:**
    - Automatikus leírásgenerálás a kategóriákhoz.
    - Rövid és hosszú leírás generálása a termékekhez (a hosszú formázott, képekkel, táblázatokkal).
- **Interfész:**
    - Lista nézet a termékeknek és kategóriáknak, keresési és szűrési lehetőséggel.
    - A listában megjelenik a leírások SEO pontszáma.
    - A leírások a beépített szövegszerkesztőben finomhangolhatók.

### Hírlevél Szöveg Generátor
- **Típusok:**
    - **Hétfői hírlevél:** Általános, nem tematikus akciókhoz.
    - **Szerdai hírlevél:** Tematikus, megadott márkára vagy kategóriára.
    - **Bejelentő hírlevél:** Input boxba írt szöveg AI általi átfogalmazása.
    - **Informatív hírlevél:** Megadott téma alapján, témajavasló funkcióval.
- **Funkciók:**
    - 5 alternatív szövegverzió generálása.
    - 10 alternatív email tárgy generálása.
    - Emoji használat és javaslatok.

### Social Media Poszt Generátor
- **Egyszerűsített működés:** Téma megadása után a generátor a platformok (Facebook, Instagram) specifikációit és karakterlimitjeit figyelembe véve hoz létre hirdetési szövegeket.

---

## Technológiai Stack

A projektet a következő technológiák felhasználásával építjük fel, a megbeszéltek alapján:

- **Keretrendszer: Next.js (React alapokon)**
  - **Indoklás:** Modern, SEO-barát keretrendszer, ami gyors és hatékony webalkalmazások készítését teszi lehetővé. Ideális választás a projekt céljaihoz.

- **Felhasználói Felület (UI): Tailwind CSS**
  - **Indoklás:** Egy "utility-first" CSS keretrendszer, ami lehetővé teszi a gyors, egyedi és reszponzív designok építését, beleértve a kért "glassmorphism" stílust is.

- **Adatbázis: SQLite**
  - **Indoklás:** A projekt kezdeti fázisában egy egyszerű, fájl-alapú adatbázist használunk. Ez meggyorsítja a fejlesztést, nem igényel külön telepítést és karbantartást. Tökéletesen elegendő a kezdeti felhasználói terheléshez, és később, szükség esetén, könnyen cserélhető egy robusztusabb megoldásra (pl. PostgreSQL).

- **Authentikáció: NextAuth.js**
  - **Indoklás:** Biztonságos és rugalmas, kifejezetten a Next.js-hez fejlesztett authentikációs könyvtár, ami minden szükséges funkciót (bejelentkezés, jogosultságkezelés) lefed.

- **Szövegszerkesztő: TipTap**
  - **Indoklás:** Modern, ingyenes és könnyen testreszabható szövegszerkesztő komponens a generált tartalmak formázásához.

---

## Megvalósítási Megjegyzések és Hibaelhárítás

Ez a szekció a fejlesztés során felmerült specifikus technikai kihívásokat és az azokra alkalmazott megoldásokat dokumentálja.

### 1. Git és PowerShell Működési Problémák
- **Jelenség:** Windows PowerShell környezetben a `git add`, `git commit` és `git push` parancsok gyakran "elakadnak", nem adnak azonnali visszajelzést, vagy megszakadnak.
- **Megoldás:** A parancsok a háttérben általában sikeresen lefutnak. A sikerességet mindig egy független ellenőrző paranccsal (`git status` vagy `git remote show origin`) erősítjük meg, ahelyett, hogy a parancs visszajelzésére várnánk. A `&&` operátor használatát a parancsok összekapcsolására kerüljük, helyette külön-külön futtatjuk őket.

### 2. NextAuth.js JWT Session Hiba (`decryption operation failed`)
- **Jelenség:** Sikeres bejelentkezés után a felhasználó a főoldalra érkezve azonnal kijelentkezik. A szerver logjában `[next-auth][error][JWT_SESSION_ERROR] decryption operation failed` hibaüzenet látható.
- **Oka:** A hiba arra utal, hogy a session token (JWT) titkosításához és visszafejtéséhez használt `AUTH_SECRET` kulcs nem konzisztens. Ezt a Next.js belső gyorsítótára (`.next` mappa) okozta, ami egy régi, hibás `.env` konfigurációt használt.
- **Megoldás:** A probléma végleges megoldása egy "kemény újraindítás":
  1. A fejlesztői szerver leállítása (`taskkill /F /IM node.exe`).
  2. A `.next` mappa teljes törlése.
  3. A szerver újraindítása (`npm run dev`), ami tiszta gyorsítótárral, a helyes `.env` fájl beolvasásával indul.
  4. A böngészőben a `localhost`-hoz tartozó sütik törlése a tesztelés előtt.

### 3. Prisma Adatbázis Seedelés Windows Alatt
- **Jelenség:** A `npx prisma db seed` parancs hibával leállt, hivatkozva a `ts-node` parancs értelmezési problémáira a `package.json`-ben (`SyntaxError: Expected property name or '}' in JSON` vagy `TypeError: Unknown file extension ".ts"`).
- **Oka:** A Windows parancssor (PowerShell) eltérően kezeli az idézőjeleket és a Node.js modulrendszereket, mint a Linux-alapú rendszerek.
- **Végső Megoldás:** Egy ideiglenes `temp_seed.js` script létrehozása, ami a `child_process` modul segítségével, programatikusan futtatja a `ts-node` parancsot a helyes beállításokkal. Ez a módszer kikerüli a parancssor-értelmezési hibákat. A futtatás után a `temp_seed.js` fájlt töröljük. 