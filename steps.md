# A Projekt Lépései

Ez a dokumentum a projekt fejlesztési lépéseit és azok aktuális állapotát követi.

## Fázis 1: Tervezés és Előkészületek (Befejezve)
- [x] Projekt-specifikáció és szabályok értelmezése
- [x] Alap dokumentációs fájlok létrehozása (`specification.md`, `documentations.md`, `content_guides.md`, `steps.md`)
- [x] Technológiai stack megbeszélése és véglegesítése
- [x] Szükséges API kulcsok és hozzáférések összegyűjtése (`.env` fájl létrehozása)

## Fázis 2: Alaprendszer és Felhasználókezelés (Befejezve)
- [x] Next.js projekt inicializálása Tailwind CSS-sel
- [x] Adatbázis séma megtervezése (felhasználók, cikkek, stb.)
- [x] Bejelentkezési rendszer implementálása (NextAuth.js, SQLite, Prisma)
- [x] Első admin felhasználó létrehozása
- [x] Bejelentkezési és kijelentkezési folyamat tesztelése és hibajavítás
- [x] Felhasználói szerepkörök (admin, tag) és jogosultságok kialakítása az alkalmazásban
- [x] Védett útvonalak létrehozása (pl. csak bejelentkezett felhasználók számára elérhető oldalak)
- [x] Admin felület alapjainak létrehozása (UI a felhasználók listázásához és meghívásához)

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