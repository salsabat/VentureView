# 📈 VentureView

A smart forecasting assistant for small businesses. Upload a CSV, describe your forecast needs in plain English, and get predictions powered by machine learning and natural language understanding.

---

## 🚀 Features

- 🔐 Email-based login system (FastAPI + PostgreSQL)
- 📁 CSV upload with per-user storage in the database
- 🧠 Natural language parsing using Gemini LLM
- 📊 Time-series forecasting with Facebook Prophet
- 📉 Dynamic graph generation with confidence intervals
- 🗣 AI-generated explanation of the forecast
- 🌐 Clean frontend built with React (Vite)

---

## 🧰 Tech Stack

| Layer     | Tools                                 |
|-----------|----------------------------------------|
| Frontend  | React (Vite), Vanilla CSS              |
| Backend   | FastAPI, SQLAlchemy, PostgreSQL, Gemini|
| Forecast  | Facebook Prophet, Pandas, Matplotlib   |
| Auth      | Email-based login                      |

---

## 📄 How It Works

1. Login with your email
2. Upload a CSV file containing `date`, `product`, and `revenue`
3. Type a prompt like:

   ```
   Forecast revenue for notebooks for the next 14 days
   ```

4. The app:
   - Parses your prompt using Gemini
   - Validates and filters your uploaded CSV
   - Runs a Prophet forecast
   - Returns a graph + natural language explanation

---

## ⚙️ .env Template

Create a `.env` file in the project root with:

```
LLM_API_KEY=your-gemini-api-key
DATABASE_URL=postgresql://username:password@localhost:5432/yourdbname
```

> Replace `username`, `password`, and `yourdbname` with your actual PostgreSQL credentials.

---

## 🛠 Setup Instructions

### 1. Backend (Python)

```bash
# From the project root
python -m venv venv
source venv/bin/activate

pip install -r requirements.txt

# Run the backend server
python backend/main.py
```

---

### 2. Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

---

## 🧪 Sample CSV Format

```csv
date,product,revenue
2024-01-01,Notebooks,100
2024-01-02,Notebooks,120
...
```

---

## 👨‍💻 Author

**Sajal Sabat**
