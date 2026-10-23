# PrivacyGuard — MERN MVP
A privacy-conscious sensitive-text pattern scanner built with MongoDB, Express, React and Node.js.

## Run locally
Requirements: Node.js LTS and npm.

Terminal 1:
```bash
cd server
npm install
copy .env.example .env
# Set MONGODB_URI in server/.env to enable persistent history
npm run dev
```
Terminal 2:
```bash
cd client
npm install
copy .env.example .env
npm run dev
```
Open http://localhost:5173. The frontend proxies `/api` to port 5000.

## Privacy and limitations
The scanner uses regular expressions for selected email, phone-like, API-key-like and password-like patterns. It may have false positives and false negatives. Risk scores are educational indicators, not a guarantee of safety. Original scanned text and detected raw values are not stored in MongoDB history. Use synthetic test data only. Without `MONGODB_URI`, scanning works but history is not persistent.
