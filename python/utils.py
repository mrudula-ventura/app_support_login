from sqlalchemy import VARCHAR, Column, Integer, String, DateTime, Boolean, BigInteger, TIMESTAMP
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.dialects.postgresql import BYTEA

Base = declarative_base()

class Users(Base):
    __tablename__ = 'users'
    __table_args__ = {"schema": 'public'}
    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(VARCHAR)
    password = Column(VARCHAR)
    is_super_user = Column(Boolean)
    is_user_readonly = Column(Boolean)
    is_active = Column(Boolean)
    added_by = Column(VARCHAR)
    created_dttm = Column(TIMESTAMP)
    
