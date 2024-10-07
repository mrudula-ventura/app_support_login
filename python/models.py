from sqlalchemy import Column, String, Integer, DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
import pytz

Base = declarative_base()

# Setting up the IST timezone
IST = pytz.timezone('Asia/Kolkata')

class ServiceStatus(Base):
    __tablename__ = 'service_status'
    __table_args__ = {'schema': 'public'}  # Specify the 'public' schema

    id = Column(Integer, primary_key=True, autoincrement=True)
    service_name = Column(String(255), nullable=False)
    status = Column(String(50), nullable=False)
    remark = Column(String(255), nullable=True)
    service_tiggered_by = Column(String(255), nullable=True)  # Match the DB column name with the typo
    unique_id = Column(String(255), unique=True, nullable=False)
    updatedAt = Column(DateTime(timezone=True), default=lambda: datetime.now(IST), onupdate=lambda: datetime.now(IST))

    def __repr__(self):
        return f"<ServiceStatus(id={self.id}, service_name={self.service_name}, status={self.status}, updatedAt={self.updatedAt}, service_tiggered_by={self.service_tiggered_by})>"
