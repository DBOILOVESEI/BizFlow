# BizFlow

# SOFTWARE DEVELOPMENT PROJECT

# HOW TO SET UP
## BACKEND
1. Make sure you have Postgres SQL installed.</br>
To install PostgreSQL, download the installer for your OS (Windows, macOS, or Linux) from the
official PostgreSQL website. Run the installer, accept default components (Server, pgAdmin, Command Line Tools), set a secure password for the "postgres" user, and keep the default port 5432.

2. Change URL in engine.py (/backend/src/infrastructure/databases/engine.py)</br>
DATABASE_URL = "postgresql+psycopg2://postgres:123456@localhost:5432/bizflow_dev"</br>
Change postgres:123456 to yourPostgresUsername:Password</br>
(Don't use localhost in deployment.)

3. Locate to backend folder and create virtual environment</br>
## Windows:
```bash
py -m venv .venv
```
## Unix/MacOS:
```bash
python3 -m venv .venv
```
4. Activate virtual environment
## Windows:
```bash
.venv\Scripts\activate.ps1
```
## Unix/MacOS:
```bash
source .venv/bin/activate</br>
```
Or if you're using fish:</br>
```bash
source .venv/bin/activate.fish
```
5. Install libraries:
```bash
pip install -r requirements.txt
```
6. Run the app
```bash
python3 src/app.py
```
## FRONTEND
1. Make sure you have NodeJS installed
2. Locate to frontend folder and run
```bash
npm install
```
3. If there are vulterabilities, follow what the messages in the terminal says.
4. Run
```bash
npm run dev
```
to test frontend.

the end
