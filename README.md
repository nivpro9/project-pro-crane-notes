# Project Pro — מנופאים | לוח פתקים ומשימות

מערכת פנימית לניהול פתקים ומשימות עבור צוות Project Pro Crane Operators.

---

## תכונות

- **לוח פתקים** — יצירת פתקים צבעוניים עם שיוך "מי מטפל" ושם עובד
- **לוח משימות** — ניהול משימות נפרד לאנה ולדורי עם סטטוסים: לא בוצע / בטיפול / בוצע
- **נתונים משותפים** — כל המשתמשים רואים את אותם הנתונים בזמן אמת
- **ייצוא לאקסל** — ייצוא פתקים ומשימות לקובץ Excel, כולל פילטור לפי עובד
- **ממשק בעברית** — RTL מלא, פשוט לשימוש

---

## משתמשים

| משתמש | תפקיד |
|-------|--------|
| אנה   | משתמש |
| דורי  | משתמש |

---

## התקנה והרצה מקומית

```bash
# התקנת תלויות
npm install

# הרצת השרת
npm start
```

השרת יעלה על `http://localhost:3000`

---

## מבנה הפרויקט

```
├── public/
│   ├── index.html   # האפליקציה (client)
│   └── logo.png     # לוגו Project Pro
├── server.js        # שרת Express + REST API
├── package.json
├── data.json        # נתונים (נוצר אוטומטית)
└── .gitignore
```

---

## פריסה ל-Railway

1. העלה את הקוד ל-GitHub
2. היכנס ל-[railway.app](https://railway.app)
3. **New Project → Deploy from GitHub repo**
4. בחר את ה-repo — Railway מזהה אוטומטית את `npm start`
5. תוך דקה יש URL ציבורי

---

## API

| Method | Endpoint | תיאור |
|--------|----------|-------|
| GET | `/api/notes` | קבלת כל הפתקים |
| POST | `/api/notes` | יצירת פתק חדש |
| DELETE | `/api/notes/:id` | מחיקת פתק |
| GET | `/api/tasks` | קבלת כל המשימות |
| POST | `/api/tasks` | יצירת משימה חדשה |
| PATCH | `/api/tasks/:id` | עדכון סטטוס משימה |
| DELETE | `/api/tasks/:id` | מחיקת משימה |

---

*Project Pro Crane Operators — Since 2013*
