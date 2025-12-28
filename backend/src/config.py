DATABASE_URL = "postgresql+psycopg2://bizflow_user:bizflow@localhost:5432/bizflow_dev"

#import os
"""
class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'a_default_secret_key'
    DEBUG = os.environ.get('DEBUG', 'False').lower() in ['true', '1']
    TESTING = os.environ.get('TESTING', 'False').lower() in ['true', '1']
    DATABASE_URI = os.environ.get('DATABASE_URI') or 'postgresql+psycopg2://bizflow_user:password@localhost:5432/bflow'
    CORS_HEADERS = 'Content-Type'
"""