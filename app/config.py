CONFIG = {
    "CASH_HOLDING_LIST_V1_URL": "http://internal-cash-backend-apis-alb-1698875002.ap-south-1.elb.amazonaws.com:8002/txn/holding/v1/get",
        "CASH_HOLDING_SUMMARY_V2_URL": "http://internal-cash-backend-apis-alb-1698875002.ap-south-1.elb.amazonaws.com:8002/txn/holding/v2/summary",
        "X_API_KEY": "emhT0wJcEaQ5hHOpdP54J81Vl9Zdigital",
        "CASH_POSITION_LIST_V2_URL": "http://internal-cash-backend-apis-alb-1698875002.ap-south-1.elb.amazonaws.com:8002/txn/positions/v2/list",
        "CASH_POSITION_SUMMARY_V2_URL": "http://internal-cash-backend-apis-alb-1698875002.ap-south-1.elb.amazonaws.com:8002/txn/positions/v2/summary",
        "HOLDING_LIST_V1_PAYLOAD": {
                                    "sort_by": 1,
                                    "size": 0,
                                    "page": 0,
                                    "searchKey": ""
                                    },
        "HOLDING_SUMMARY_V2_PAYLOAD": {"client_id":"^^"},
        "POSITION_LIST_V2_PAYLOAD": {},
        "POSITION_SUMMARY_V2_PAYLOAD": {},
    "app_support":{
        "DB_USER": "rm_admin",
        "DB_PASSWORD": "oswL5#7fspoxptl7acjncdkcl",
        "DB_HOST": "ventura1-prod-postgres-rds-referral-mgmt.cxsiogefb5hv.ap-south-1.rds.amazonaws.com",
        "DB_NAME": "app_support_db",
    },
    "sso_prod":{
        "DB_USER": "sso_readuser",
        "DB_PASSWORD": "rReaDdUusSEr123sSor",
        "DB_HOST": "ventura1-prod-postgres-rds-sso-mvp.cxsiogefb5hv.ap-south-1.rds.amazonaws.com",
        "DB_NAME": "ssodb"
    },
    "ipo":{
        "DB_USER": "ipo_readonly",
        "DB_PASSWORD": "WsfgHJedWse346Mng",
        "DB_HOST": "ventura-prod-rds-ipo-opensection.cxsiogefb5hv.ap-south-1.rds.amazonaws.com",
        "DB_NAME": "ipo"
    },"mpprod":{
        "DB_USER": "myprofile_user",
        "DB_PASSWORD": "WsDFGT45Mn237GDEMnU",
        "DB_HOST": "ventura-prod-cob-support-myprofile-rds.cmy1micvvxjq.ap-south-1.rds.amazonaws.com",
        "DB_NAME": "myprofile"
    },"cash_prod":{
        "DB_USER":"metabase",
        "DB_HOST":"cash-prod-rds-postgres.cs6gkdopmrcl.ap-south-1.rds.amazonaws.com",
        "DB_PASSWORD":"met%40b%40$E_%40%40dMin",
        "DB_NAME":"cash_equities"
    },
    "mfprod":{
        "DB_USER": "mf_prod_readonly",
        "DB_PASSWORD": "QEadZc%40341#2",
        "DB_HOST": "mf-prod-rds-postgress.cpcx0uidjlpk.ap-south-1.rds.amazonaws.com",
        "DB_NAME": "prod_mf_db"
    },
    "cobprod":{
        "DB_USER": "co_readonly",
        "DB_PASSWORD": "WsDFG#237GDEMnU",
        "DB_HOST": "ventura-prod-cob-support-myprofile-rds.cmy1micvvxjq.ap-south-1.rds.amazonaws.com",
        "DB_NAME": "client_onboarding_db"
    }
}

def get_config(env):
    return CONFIG[env]