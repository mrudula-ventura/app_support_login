from flask import request, jsonify
from sqlalchemy import func
from db_connection import mf_session
from models import MutualFundPortfolio



def mf_details():
    client_id = request.args.get('clientId')
    # client_id = func.upper('18j018')
    mf_query = mf_session.query(MutualFundPortfolio.summary_json).filter(MutualFundPortfolio.client_id == func.upper(client_id)).first()
    
    if not mf_query:
        return jsonify({"message": "No MF data available for the client"})
    
    summary = mf_query[0]
    result = []
    
    for g_total, summary_data in summary.items(): # g_tot = g_tot, summary, client_details
        # print(summary, "---------")
        if 'g_tot' in g_total:

            result.append({
                'C_amnt': summary['g_tot']['c_amt'],
                "P_amt": summary['g_tot']['p_amt'],
                "XIRR": summary['g_tot']['xirr']
            })
            
        if 'summary' in g_total:
            for asset, scheme_name_and_data in summary_data.items(): # asset = liquid. etc / scheme_name_and_data = g_tot or schemes
                    for g_tot_or_schemes, schemes_data in scheme_name_and_data.items(): # g_tot = schemes / schemes_data = mf wise data                
                        if g_tot_or_schemes == 'schemes':
                            for scheme_name, data in schemes_data.items(): # scheme_name = mf names / data = m's respectiv data
                                result.append({
                                    # "c_amt": 
                                    "Scheme_name": data.get('s_name'),
                                    "Asset": asset,
                                    "Curent_amount": data.get('c_amt'),
                                    "Purchase_amount": data.get('p_amt'),
                                    "Units": data.get('units'),
                                    "Folio_Number": data.get('folio_no'),
                                    "Nav": data.get('nav'),
                                    "OnlineFlag": data.get('online_flag')
                                })
    # print(result)
    if not result:
        return jsonify({"message": "No result"})
    
    return jsonify({"Data": result})