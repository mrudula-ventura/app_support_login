from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from config import get_config

def db_connection(env):
    config = get_config(env)
    DATABASE_URL = f"postgresql://{config['DB_USER']}:{config['DB_PASSWORD']}@{config['DB_HOST']}/{config['DB_NAME']}"
    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(bind=engine)
    return SessionLocal()

app_support_session = db_connection("app_support")
sso_session = db_connection("sso_prod")
ipo_session = db_connection("ipo")
profile_session = db_connection("mpprod")
cash_session = db_connection("cash_prod")
