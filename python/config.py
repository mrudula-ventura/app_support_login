CONFIG = {
    "app_support":{
        "DB_USER": "rm_admin",
        "DB_PASSWORD": "oswL5#7fspoxptl7acjncdkcl",
        "DB_HOST": "ventura1-prod-postgres-rds-referral-mgmt.cxsiogefb5hv.ap-south-1.rds.amazonaws.com",
        "DB_NAME": "app_support_db",
    },

}

def get_config(env):
    return CONFIG[env]