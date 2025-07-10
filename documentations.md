# Dokumentációk

Ebbe a fájlba gyűjtjük a projekt során használt külső rendszerek, technológiák és API-k hivatalos dokumentációinak linkjeit.

## Technológiai Stack
- **Next.js:** [Hivatalos dokumentáció](https://nextjs.org/docs)
- **Tailwind CSS:** [Hivatalos dokumentáció](https://tailwindcss.com/docs)
- **NextAuth.js:** [Hivatalos dokumentáció](https://next-auth.js.org/getting-started/introduction)
- **n8n:** [Hivatalos dokumentáció](https://docs.n8n.io/)

## API-k
- **OpenAI (ChatGPT):** [Hivatalos dokumentáció](https://platform.openai.com/docs/api-reference)
- **Unas API:** [Hivatalos dokumentáció](...) (Ezt majd pótoljuk, amint megkapjuk a linket.)
- **SEO Ellenőrző API:** (...) (Ezt majd pótoljuk, ha választottunk eszközt.)

## Fejlesztési Megjegyzések

### .env Fájl Kezelése
A `.env` fájl a Cursor globalIgnore védelme alatt áll, ezért közvetlenül nem szerkeszthető az AI asszisztens által. 

**Megoldás:** Ha módosítani kell a `.env` fájlt:
1. Az AI asszisztens megadja a teljes új tartalmat
2. A felhasználó manuálisan bemásolja a `.env` fájlba

**Fontos:** A `.env` fájl a `.gitignore`-ban szerepel, így nem kerül fel a GitHubra.

**Példa struktúra (`env.example`):**
```
# Prisma
DATABASE_URL="file:./prisma/dev.db"

# NextAuth
AUTH_SECRET="your-auth-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# OpenAI
CHATGPT_API_KEY="your-openai-api-key-here"
``` 