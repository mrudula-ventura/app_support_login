CONFIG = {
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
    }

}

def get_config(env):
    return CONFIG[env]