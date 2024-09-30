from sqlalchemy import VARCHAR, Column, Integer, String, DateTime, Boolean, BigInteger, TIMESTAMP, Float, JSON, Numeric
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

class UserInfo(Base):
    __table_args__ = {"schema": "login_v4"}
    __tablename__ = 'user_info'
    client_id = Column(VARCHAR, primary_key=True)
    account_status=Column(VARCHAR)
    isequity=Column(VARCHAR)
    iscommodity=Column(VARCHAR)
    mtfflag=Column(VARCHAR)
    mflogin=Column(VARCHAR)
    mtfflagdetective=Column(VARCHAR)
    nsecash=Column(VARCHAR)
    nsefno=Column(VARCHAR)
    bsecash=Column(VARCHAR)
    nseslbm=Column(VARCHAR)
    nsecds=Column(VARCHAR)
    poa=Column(VARCHAR)
    accesstype=Column(VARCHAR)
    
class ApplicantDetailsModel(Base):
    __tablename__ = 'applicant_details'
    __table_args__ = {"schema": 'ipo'}
    applicant_id = Column(Integer, primary_key=True)
    fname = Column(String(50))
    lname = Column(String(250))
    is_client = Column(Boolean, nullable=False)
    client_id = Column(String(20))
    mobile_number = Column(String(250))
    email = Column(String(250))
    pan = Column(String(250))
    demat_number = Column(String(16))
    depository = Column(String(20))
    investor_type =Column(String(50))
    created_dttm = Column(DateTime, nullable=False)
    updated_dttm = Column(DateTime, nullable=False)
    created_by = Column(String(25), nullable=False)
    updated_by = Column(String(25))

class IpoApplicationModel(Base):
    __tablename__ = 'ipo_application'
    __table_args__ = {"schema": 'ipo'}
    application_id = Column(Integer, primary_key=True)
    ipo_id = Column(Integer)
    applicant_id = Column(Integer)
    bid_quantity = Column(Integer)
    bid_amount = Column(Integer)
    ip_address = Column(String(30))
    upi_id = Column(String(250))
    allotment_status = Column(String(50))
    created_datetime = Column(DateTime, nullable=False)
    updated_datetime = Column(DateTime, nullable=False)
    created_by = Column(String(25))
    updated_by = Column(String(25))
    application_mode = Column(String(50))
    payment_status = Column(String(50))
    application_no = Column(Integer) 
    payment_date = Column(DateTime, nullable=False)
    application_status = Column(String(50))
    allotted_shares = Column(BigInteger)
    pay_reason = Column(String(100))
    payment_mandate_sent = Column(Boolean)
    payment_mandate_sent_date = Column(DateTime, nullable=True)
    application_cancelled = Column(Boolean)

class IpoDetailsModel(Base):
    __tablename__ = 'ipo_details'
    __table_args__ = {"schema": 'ipo'}
    ipo_id = Column(Integer, primary_key=True)
    accord_ipo_code = Column(Integer)
    company_name = Column(String(255))
    price_high = Column(Float)
    price_low = Column(Float)
    lot_size = Column(Integer)
    min_lot_size = Column(Integer)
    min_issue_size = Column(Float)
    max_issue_size = Column(Float)
    min_investment = Column(Integer)
    # max_bid_amount = Column(Integer)
    open_date = Column(DateTime, nullable=True)
    close_date = Column(DateTime, nullable=True)
    listing_date = Column(DateTime, nullable=True)
    allotment_date = Column(DateTime, nullable=True)
    refund_initiation = Column(DateTime, nullable=True)
    demat_transfer = Column(DateTime, nullable=True)
    created_dttm = Column(DateTime, nullable=True)
    last_updated_dttm = Column(DateTime, nullable=True)
    logo_url = Column(String(255))
    listing_price = Column(Numeric)
    price_difference = Column(Numeric)
    pct_change = Column(Numeric)
    drhp_url = Column(String(255))
    v_research_url = Column(String(255))
    added_by = Column(String(300))
    updated_by = Column(String(300))
    v_view = Column(String(255))
    notes = Column(String(100))
    about  = Column(String(5000))
    company_url = Column(String(255))
    revenue = Column(JSON)
    total_assets = Column(JSON)
    profit = Column(JSON)
    post_listing_mcap = Column(Numeric)
    promoter_pct_change = Column(Numeric)
    subscription = Column(Numeric)
    symbol_of_company = Column(String(20))