from flask import request, jsonify
from sqlalchemy import text
from db_connection import cash_session

import datetime
import json

def wallet_details():
    client_id = request.args.get('clientId')

    wallet_query = '''
        select * from(
        select
            created_date as "Timestamp",
            case
                when true then 'INTENT'
            end as "Transaction type",
            amount as "amount",
            ventura_ref_no as "Reference no",
            case
                when hdfc_create_payment_res_data::text like '%SUCCESS%' then 'SUCCESS'
                else 'FAILED'
            end as "Bank Status",
            accord_hdfc_data_req_res_data::text as "accord status",
            rs_payin_api_res_data::text as "RS Status",
            final_status as "final Status",
            wallet.intent_txns_new.client_code
        from
            wallet.intent_txns_new
        union
        select
            wallet.payment_request.created_date as "Timestamp",
            wallet.payment_request.payment_mode::text as "Transaction type",
            total_amount as "amount",
            wallet.payment_request.ventura_ref_no as "Reference no",
            case
                when trans_status = 'SUCCESS' then 'SUCCESS'
                when trans_status in ('FAILED', 'REJECTED') then 'FAILED'
            end as "Bank Status",
            'NA' as "accord status",
            'NA' as "RS Status",
            trans_status as "final Status",
            wallet.payment_request.client_code
        from
            wallet.payment_request
        left join
            wallet.payment_response
        on
            wallet.payment_request.req_id_incr = wallet.payment_response.req_id
        union
        select
            wallet.netbanking_txns.created_date as "Timestamp",
            'NETBANKING' as "Transaction type",
            wallet.netbanking_txns.total_amount as "amount",
            wallet.netbanking_txns.mvp_ref_no as "Reference no",
            bank_status as "Bank Status",
            'NA' as "accord status",
            rs_status as "RS Status",
            final_status as "final Status",
            wallet.netbanking_txns.client_id
        from
            wallet.netbanking_txns
        union
        select
            wallet.payout_txns.created_date as "Timestamp",
            'PAYOUT' as "Transaction type",
            payout_amount as "amount",
            payout_req_id_incr::text as "Reference no",
            'NA' as "Bank Status",
            'NA' as "accord status",
            'NA' as "RS Status",
            case
                when payout_status = 'processed' then 'SUCCESS'
                when payout_status = 'cancelled' then 'FAILED'
            end as "final Status",
            wallet.payout_txns.client_code
        from
            wallet.payout_txns
        ) as sub_query
        where client_code like upper(:client_code)
        order by 1 desc;
    '''

    try:
        result = cash_session.execute(text(wallet_query), {"client_code": f'%{client_id}%'})
        result_fetch = result.fetchall()

        columns = result.keys()
        wallet_data = []
        for row in result_fetch:
            wallet = {}
            for column, value in zip(columns, row):
                # print(column, "-------------------------")
                if column == 'Timestamp' and value  is not None:
                    if isinstance(value, str):
                        dt = datetime.datetime.strptime(value, '%a, %d %b %Y %H:%M:%S %Z')
                    elif isinstance(value, datetime.datetime):
                        dt = value
                    else:
                        continue    
                    wallet[column] = dt.strftime('%d-%m-%Y %H:%M')
                elif column == 'RS Status' and value is not None:
                    try:
                        status = json.loads(value)
                        wallet[column] = status.get('status')
                    except json.JSONDecodeError:
                        wallet[column] = "NA"
                else:
                    wallet[column] = value
            wallet_data.append(wallet)
                    

        if not wallet_data:
            return jsonify({"message": "No data available"}), 404

        return jsonify({"message": "Data retrieved successfully", "walletData": wallet_data})
    
    except Exception as e:
        return jsonify({"message": f"Error occurred: {str(e)}"}), 500