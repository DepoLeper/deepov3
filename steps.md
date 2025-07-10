# A Projekt Lépései

Ez a dokumentum a projekt fejlesztési lépéseit és azok aktuális állapotát követi.

## Fázis 1: Tervezés és Előkészületek (Folyamatban)
- [x] Projekt-specifikáció és szabályok értelmezése
- [x] Alap dokumentációs fájlok létrehozása (`specification.md`, `documentations.md`, `content_guides.md`, `steps.md`)
- [ ] Technológiai stack megbeszélése és véglegesítése
- [ ] Szükséges API kulcsok és hozzáférések összegyűjtése (`.env` fájl létrehozása)

## Fázis 2: Alaprendszer és Felhasználókezelés
- [ ] Next.js projekt inicializálása Tailwind CSS-sel
- [ ] Adatbázis séma megtervezése (felhasználók, cikkek, stb.)
- [ ] Bejelentkezési rendszer implementálása (NextAuth.js)
- [ ] Felhasználói szerepkörök (admin, tag) és jogosultságok kialakítása
- [ ] Admin felület a felhasználók meghívására és kezelésére

## Fázis 3: Tartalomgenerátor Modulok
- [ ] Blog generátor modul felületének (UI) létrehozása
- [ ] ChatGPT API integráció a szöveggeneráláshoz
- [ ] Modern, beágyazható szövegszerkesztő integrálása
- [ ] SEO pontozó rendszer alapjainak kidolgozása a `content_guides.md` alapján
- [ ] Generált tartalmak mentése az adatbázisba
- [ ] Blog cikkek listázása, státuszkezelése
- [ ] Termékleírás generátor modul fejlesztése (Unas API integrációval)
- [ ] Kategória leírás generátor modul fejlesztése
- [ ] Hírlevél szöveg generátor modul fejlesztése
- [ ] Social media poszt generátor modul fejlesztése

## Fázáis 4: Automatizáció és Haladó Funkciók
- [ ] Automata és időzített blogcikk generálás megvalósítása
- [ ] Blog naptár nézet létrehozása
- [ ] n8n integráció előkészítése (API végpontok létrehozása)

## Fázis 5: Tesztelés és Telepítés
- [ ] Rendszer alapos tesztelése
- [ ] Telepítés az AlmaLinux 8 szerverre (deepo.ubli.hu)
- [ ] Telepítési útmutató elkészítése 