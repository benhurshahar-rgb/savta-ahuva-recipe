# ספר המתכונים של סבתא אהובה

אפליקציית אנדרואיד עם כל המתכונים מהמחברת של סבתא אהובה.

**להורדה:** https://github.com/benhurshahar-rgb/savta-ahuva-recipe/releases/latest/download/savta-recipes.apk

## איך זה בנוי
- `www/` – האפליקציה עצמה (HTML/JS), כולל המתכונים (`data.js`), התמונות, הדפים מהמחברת והגופנים.
- Capacitor עוטף אותה כאפליקציית אנדרואיד.
- GitHub Actions בונה APK חתום בכל שינוי ומפרסם אותו ב־Releases.
- תיקונים, תמונות ומתכונים חדשים נשמרים ב־Firebase (Firestore) ומשותפים לכל המשפחה.
- קריאת כתב יד: Gemini. המפתח נשמר כסוד `GEMINI_API_KEY` במאגר.
