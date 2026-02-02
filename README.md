# BizFlow

# SOFTWARE DEVELOPMENT PROJECT

# HOW TO SET UP
## BACKEND
1. Make sure you have Postgres SQL installed.
To install PostgreSQL, download the installer for your OS (Windows, macOS, or Linux) from the
official PostgreSQL website. Run the installer, accept default components (Server, pgAdmin, Command Line Tools), set a secure password for the "postgres" user, and keep the default port 5432.

2. Change URL in engine.py (/backend/src/infrastructure/databases/engine.py)
DATABASE_URL = "postgresql+psycopg2://postgres:123456@localhost:5432/bizflow_dev"
Change postgres:123456 to yourPostgresUsername:Password
Don't use localhost in deployment.

## FRONTEND
1. Make sure you have NodeJS installed
2. Locate to frontend folder and run "npm install"
3. If there are vulterabilities, follow what the messages in the terminal says.
4. Run "npm run dev" to test frontend.

the end
