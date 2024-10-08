from sqlalchemy import VARCHAR, Column, Integer, String, DateTime, Boolean, BigInteger, TIMESTAMP, Float, JSON, Numeric
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.dialects.postgresql import JSONB

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
    __tablename__ = 'user_info'
    __table_args__ = {"schema": "login_v4"}
    user_id_incr = Column(BigInteger, primary_key=True, autoincrement=True, nullable=False)
    client_id = Column(String(256), nullable=False)
    is_dealer = Column(Boolean, nullable=False)
    first_name = Column(String(50), nullable=False)
    middle_name = Column(String(50))
    last_name = Column(String(50), nullable=False)
    dob = Column(String(256), nullable=False)
    country_code = Column(String(4), nullable=True)
    mobile_no = Column(String(256), nullable=False)
    is_nri = Column(String(256), nullable=False)
    email_id = Column(String(256), nullable=False)
    pan_no = Column(String(256), nullable=False)
    first_time_user = Column(Boolean, nullable=False)
    account_lock_expiry_dttm = Column(DateTime, nullable=True)
    is_new_user_otp_validated = Column(Boolean, nullable=False)
    is_new_user_validated = Column(Boolean, nullable=False)
    is_new_user_pin_set = Column(Boolean, nullable=False)
    pwd = Column(String(100), nullable=False)
    account_status = Column(String(50), nullable=False)
    is_locked = Column(Boolean, nullable=False)
    migration_source = Column(String(100), nullable=True)
    created_by = Column(String(50), nullable=False)
    updated_by = Column(String(50), nullable=True)
    client_type = Column(String(10), nullable=False)
    folio_number = Column(String(256), nullable=True)
    aadharnumber = Column(String(256), nullable=True)
    isequity = Column(String(1), nullable=True)
    iscommodity = Column(String(1), nullable=True)
    mtfflag = Column(String(1), nullable=True)
    mflogin = Column(String(20), nullable=True)
    mtfflagdetective = Column(String(1), nullable=True)
    nsecash = Column(String(1), nullable=True)
    nsefno = Column(String(1), nullable=True)
    bsecash = Column(String(1), nullable=True)
    nseslbm = Column(String(1), nullable=True)
    nsecds = Column(String(1), nullable=True)
    poa = Column(String(1), nullable=True)
    accesstype = Column(String(30), nullable=True)
    sso_migrated = Column(Boolean, nullable=False)
    created_dttm = Column(DateTime, nullable=False)
    updated_dttm = Column(DateTime, nullable=False)
    
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

class ProfileOnboardingModel(Base):
    __tablename__ = "client_onboarding_details"
    __table_args__ = {"schema": "profile"}
    client_detail_id_incr = Column(Integer, primary_key=True, nullable=False)
    client_id = Column(String(10))
    salutation = Column(String)
    first_name = Column(String(50))
    middle_name = Column(String(50))
    last_name = Column(String(50))
    phone_no = Column(String(256))
    email_id = Column(String(256))
    dob = Column(String(256))
    gender = Column(String)
    pan_no = Column(String(256))
    pan_father_name = Column(String(100))
    marital_status = Column(String)
    income_range = Column(Integer)
    occupation = Column(Integer)
    residential_status = Column(String)
    residency_country = Column(String(50))
    tax_residency_country = Column(String(50))
    political_exposed_status = Column(String)
    is_client_minor = Column(Boolean)
    account_type = Column(String)
    client_mgmt_id = Column(Integer)
    is_existing_client = Column(Boolean)
    is_whatsapp_enabled = Column(Boolean)
    is_aadhar_linked_pan = Column(Boolean)
    is_fatca_verified = Column(Boolean)
    is_kyc_compliant = Column(Boolean)
    is_kra_verified = Column(Boolean)
    is_bank_verified = Column(Boolean)
    pan_login_attempt = Column(Integer)
    created_by = Column(String(50))
    created_timestamp = Column(String, nullable=False)
    updated_by = Column(String(50))
    updated_timestamp = Column(String, nullable=False)

class BankDetailsModel(Base):
    __tablename__ = 'bank_details'
    __table_args__ = {"schema": 'profile'}
    bank_detail_id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    client_detail_id = Column(Integer)
    account_type = Column(String)
    account_no = Column(String(256), nullable=False)
    verified_source = Column(String, nullable=False)
    client_upi = Column(String(100))
    is_active = Column(Boolean, nullable=False)
    is_primary_bank = Column(Boolean, nullable=False)
    ifsc_code = Column(String(11))
    supporting_document = Column(String)
    document_url = Column(String)
    is_pass_required = Column(Boolean)
    created_by = Column(String(50))
    created_timestamp = Column(String, nullable=False)
    updated_by = Column(String(50))
    updated_timestamp = Column(String, nullable=False)
    password = Column(String(150), nullable=False)
    is_bank_verified = Column(Boolean, nullable=False)
    bank_account_status =  Column(String(100))


class SegmentModel(Base):
    __tablename__ = 'segment_details'
    __table_args__ = {"schema": 'profile'}
    segment_detail_id_incr = Column(BigInteger, primary_key=True, autoincrement=True, nullable=False)
    client_detail_id = Column(Integer)
    segment_type = Column(Integer)
    is_active = Column(Boolean)
    created_timestamp = Column(String, nullable=False)
    updated_timestamp = Column(String, nullable=False)
    segment_status = Column(String(20))

class MutualFundPortfolio(Base):
    __tablename__ = 'portfolio_pcook'
    __table_args__ = {"schema": 'report'}
    client_id = Column(VARCHAR, primary_key=True)
    summary_json = Column(JSONB)
    out_json_summary = Column(JSONB)