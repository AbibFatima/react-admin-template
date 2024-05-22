# flask import
from flask import Flask, request, jsonify, session
from flask import redirect, url_for
from flask_session import Session
from flask_bcrypt import Bcrypt
from flask_cors import CORS, cross_origin
from functools import wraps
from datetime import datetime, timedelta
from sqlalchemy import func, case
from flask_migrate import Migrate

# project db, config import 
from models import db, User, ChrunTrend, ClientInfos, Sous_segment, Profiles
from config import ApplicationConfig 

#from utils import generate_sitemap, APIException 

from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager

import joblib
import pandas as pd
## ==============================|| FLASK - BACKEND ||============================== ##

app = Flask(__name__)
app.config['SECRET_KEY'] = 'vbjvsieomvdpognszvzrivnbeoib864531648531'
app.config.from_object(ApplicationConfig)
app.config['JWT_SECRET_KEY'] = 'JWT_SECRET_KEY'
jwt = JWTManager(app)

bcrypt = Bcrypt(app) 
server_session = Session(app)
CORS(app, supports_credentials=True)

db.init_app(app)  
with app.app_context():
    db.create_all()

migrate = Migrate(app,db)

# Loading pre-trained XGBoost model
model = joblib.load('Models\Xgboost_model.joblib')

#_________________________________________________

# Middleware to check if user is authenticated
# def login_required(f):
#     @wraps(f)
#     def decorated_function(*args, **kwargs):
#         if 'user_id' not in session:
#             return jsonify({"error": "Unauthorized"}), 401
#         return f(*args, **kwargs)
#     return decorated_function

#_________________________________________________
#_________________________________________________
# Dashboard route accessible only if user is authenticated
# @app.route("/dashboard/default")
# #@login_required
# def dashboard_username():
#     user_id = session.get('user_id')
    
#     if not user_id:
#         return jsonify({"error": "Unauthorized Access"}), 401
    
#     user = User.query.filter_by(id=user_id).first()
    
#     if not user:
#         return jsonify({"error": "User not found"}), 404
    
#     return jsonify({
#         "id": user.id, 
#         "firstname": "user.firstname"
#     })

@app.route("/info")
def Get_Current_User():
    user_id=session.get('user_id')

    if not user_id:
        return jsonify({'error': 'Unauthorized '}), 401

    user= User.query.filter_by(id=user_id).first()
    
    return jsonify({
        "id": user.id,
        "email": user.email
    })

#_________________________________________________
#             Dashboard first row
#_________________________________________________
def predict_dataset():
    client_infos = ClientInfos.query.all()
    
    data = []
    for client in client_infos:
        data.append({
            'Tenure': client.tenure,
            'Seg_Tenure': client.seg_tenure,
            'Pasivity_G': client.pasivity_g,
            'Value_Segment': client.value_segment,
            'CNT_OUT_VOICE_ONNET_M6': client.cnt_out_voice_onnet_m6,
            'CNT_OUT_VOICE_ONNET_M5': client.cnt_out_voice_onnet_m5,
            'CNT_OUT_VOICE_OFFNET_M6': client.cnt_out_voice_offnet_m6,
            'CNT_OUT_VOICE_OFFNET_M5': client.cnt_out_voice_offnet_m5,
            'REV_OUT_VOICE_OFFNET_W4': client.rev_out_voice_offnet_w4,
            'TRAF_OUT_VOICE_OFFNET_W4': client.traf_out_voice_offnet_w4,
            'CNT_OUT_VOICE_ROAMING_W4': client.cnt_out_voice_roaming_w4,
            'REV_DATA_PAG_W4': client.rev_data_pag_w4,
            'REV_REFILL_M5': client.rev_refill_m5,
            'CNT_REFILL_M6': client.cnt_refill_m6,
            'CNT_REFILL_M5': client.cnt_refill_m5,
            'CNT_REFILL_W4': client.cnt_refill_w4,
            'REV_REFILL_W4': client.rev_refill_w4,
            'FLAG_Inactive_3Days': client.flag_inactive_3days,
            'Count_Inactive_3Days': client.count_inactive_3days,
            'Count_Inactive_4Days': client.count_inactive_4days,
            'Count_Inactive_5Days': client.count_inactive_5days,
            'Count_Inactive_10Days_and_more': client.count_inactive_10days_and_more,
            'CONSUMER_TYPE_M5': client.consumer_type_m5,
            'CONSUMER_TYPE_M6': client.consumer_type_m6,
            'TRAF_IN_VOICE_ONNET_M5': client.traf_in_voice_onnet_m5,
            'CNT_IN_VOICE_INTERNATIONAL_M5': client.cnt_in_voice_international_m5,
            'CNT_IN_SMS_ONNET_M4': client.cnt_in_sms_onnet_m4,
            'TRAF_IN_VOICE_INTERNATIONAL_W4': client.traf_in_voice_international_w4,
            'CNT_IN_SMS_OFFNET_W4': client.cnt_in_sms_offnet_w4,
            'SLOPE_SD_VI_ONNET_DUR': client.slope_sd_vi_onnet_dur,
            'DEGREES_SD_VI_ONNET_DUR': client.degrees_sd_vi_onnet_dur,
            'SLOPE_VI_OFFNET_DUR': client.slope_vi_offnet_dur,
            'SLOPE_D__FREE_VOL': client.slope_d__free_vol,
            'Rev_Month_Before_Current_Month': int(client.rev_month_before_current_month),
            'TRAF_OUT_VOICE_ONNET_M6': client.traf_out_voice_onnet_m6,
            'TRAF_OUT_VOICE_ONNET_M4': client.traf_out_voice_onnet_m4,
            'TRAF_OUT_VOICE_ONNET_M3': client.traf_out_voice_onnet_m3,
            'REV_BUNDLE_M6': client.rev_bundle_m6,
            'TRAF_OUT_VOICE_ONNET_W4': client.traf_out_voice_onnet_w4,
            'CNT_OUT_VOICE_ONNET_W4': client.cnt_out_voice_onnet_w4,
            'SLOPE_V_ONNET_DUR': client.slope_v_onnet_dur,
            'SLOPE_SD_VI_OFFNET_DUR': client.slope_sd_vi_offnet_dur,
            'flag' : client.flag
        })
        
    df = pd.DataFrame(data)
    print(df)
    
    X = df.drop(columns=['flag'])
    y = df['flag']
    y_pred = model.predict(X)
    
    print(y_pred)

    return y_pred
   
@app.route('/dashboard/analytics', methods=["GET"])
def get_analytics():
    try:
        
        y_pred = predict_dataset()
    
        # Convert y_pred to a pandas Series
        y_pred_series = pd.Series(y_pred.flatten())
        
        # Count how many 1s and 0s are in y_pred_series
        churners_count = y_pred_series.value_counts().get(1, 0)
        non_churners_count = y_pred_series.value_counts().get(0, 0)
        total_count = y_pred_series.count()

        churners_percentage = (churners_count / total_count) * 100 if total_count > 0 else 0
        non_churners_percentage = (non_churners_count / total_count) * 100 if total_count > 0 else 0

        analytics_data = {
            'totalCount': int(total_count),
            'churnersCount': int(churners_count),
            'nonChurnersCount': int(non_churners_count),
            'churnersPercentage': float(churners_percentage),
            'nonChurnersPercentage': round(float(non_churners_percentage), 3)
        }

        return jsonify(analytics_data), 200
    except Exception as e:
        print('Error fetching analytics data:', e)
        return jsonify({'error': 'Internal Server Error'}), 500

#______________________________________________________
#               Dashboard second row
#______________________________________________________
# Line Chart : Total Churn Number Per Day and Per Month 
@app.route('/dashboard/linechartdata', methods=['GET'])
def get_line_chart_data():
    try:
        # Retrieve the interval from the query parameters
        interval = request.args.get('interval', 'day')

        # Set the default date format and interval for the query
        date_format = "%Y-%m-%d"
        interval_func = func.date_trunc('day', ChrunTrend.churn_date)
        
        # Adjust the interval and date format for month aggregation
        if interval == 'month':
            date_format = "%Y-%m"
            interval_func = func.date_trunc('month', ChrunTrend.churn_date)
        
        # Query the database based on the specified interval
        churn_data = db.session.query(interval_func.label('interval'), func.sum(ChrunTrend.churnernumber).label('total_churner_number')) \
            .group_by(interval_func) \
            .order_by(interval_func) \
            .all()


        # Format the data as per the interval
        formatted_data = [{'ChurnDate': date.strftime(date_format), 'ChurnerNumber': churner_number}
                          for date, churner_number in churn_data]

        return jsonify(formatted_data), 200
    except Exception as e:
        print('Error fetching line chart data:', e)
        return jsonify({'error': 'Internal Server Error'}), 500

# Donut Chart : Churn Per Value Segment 
@app.route('/dashboard/donutchartdata', methods=['GET'])
def get_donut_chart_data():
    try:
        # data = db.session.query(ClientInfos.value_segment, func.count(ClientInfos.flag)).group_by(ClientInfos.value_segment).all()
        data = db.session.query(
            Sous_segment.value_segment, func.count(ClientInfos.flag)
        ).join(
            ClientInfos, ClientInfos.value_segment == Sous_segment.id_segment
        ).group_by(
            Sous_segment.value_segment
        ).all()
        result = [{'valueSegment': row[0], 'flagCount': row[1]} for row in data]
        
        return jsonify(result), 200
    except Exception as e:
        print('Error fetching donut chart data:', e)
        return jsonify({'error': 'Internal Server Error'}), 500


#______________________________________________________
#               Dashboard fourth row
#______________________________________________________
# Column Chart : Churn Per Tariff Profile
@app.route('/dashboard/columnchartdata', methods=['GET'])
def get_column_chart_data_tarif():
    try:
        client_infos = ClientInfos.query.all()
        
        data = []
        for client in client_infos:
            data.append({
                'Tenure': client.tenure,
                'Seg_Tenure': client.seg_tenure,
                'Pasivity_G': client.pasivity_g,
                'Value_Segment': client.value_segment,
                'Tariff_Profile': client.tariff_profile,
                'CNT_OUT_VOICE_ONNET_M6': client.cnt_out_voice_onnet_m6,
                'CNT_OUT_VOICE_ONNET_M5': client.cnt_out_voice_onnet_m5,
                'CNT_OUT_VOICE_OFFNET_M6': client.cnt_out_voice_offnet_m6,
                'CNT_OUT_VOICE_OFFNET_M5': client.cnt_out_voice_offnet_m5,
                'REV_OUT_VOICE_OFFNET_W4': client.rev_out_voice_offnet_w4,
                'TRAF_OUT_VOICE_OFFNET_W4': client.traf_out_voice_offnet_w4,
                'CNT_OUT_VOICE_ROAMING_W4': client.cnt_out_voice_roaming_w4,
                'REV_DATA_PAG_W4': client.rev_data_pag_w4,
                'REV_REFILL_M5': client.rev_refill_m5,
                'CNT_REFILL_M6': client.cnt_refill_m6,
                'CNT_REFILL_M5': client.cnt_refill_m5,
                'CNT_REFILL_W4': client.cnt_refill_w4,
                'REV_REFILL_W4': client.rev_refill_w4,
                'FLAG_Inactive_3Days': client.flag_inactive_3days,
                'Count_Inactive_3Days': client.count_inactive_3days,
                'Count_Inactive_4Days': client.count_inactive_4days,
                'Count_Inactive_5Days': client.count_inactive_5days,
                'Count_Inactive_10Days_and_more': client.count_inactive_10days_and_more,
                'CONSUMER_TYPE_M5': client.consumer_type_m5,
                'CONSUMER_TYPE_M6': client.consumer_type_m6,
                'TRAF_IN_VOICE_ONNET_M5': client.traf_in_voice_onnet_m5,
                'CNT_IN_VOICE_INTERNATIONAL_M5': client.cnt_in_voice_international_m5,
                'CNT_IN_SMS_ONNET_M4': client.cnt_in_sms_onnet_m4,
                'TRAF_IN_VOICE_INTERNATIONAL_W4': client.traf_in_voice_international_w4,
                'CNT_IN_SMS_OFFNET_W4': client.cnt_in_sms_offnet_w4,
                'SLOPE_SD_VI_ONNET_DUR': client.slope_sd_vi_onnet_dur,
                'DEGREES_SD_VI_ONNET_DUR': client.degrees_sd_vi_onnet_dur,
                'SLOPE_VI_OFFNET_DUR': client.slope_vi_offnet_dur,
                'SLOPE_D__FREE_VOL': client.slope_d__free_vol,
                'Rev_Month_Before_Current_Month': int(client.rev_month_before_current_month),
                'TRAF_OUT_VOICE_ONNET_M6': client.traf_out_voice_onnet_m6,
                'TRAF_OUT_VOICE_ONNET_M4': client.traf_out_voice_onnet_m4,
                'TRAF_OUT_VOICE_ONNET_M3': client.traf_out_voice_onnet_m3,
                'REV_BUNDLE_M6': client.rev_bundle_m6,
                'TRAF_OUT_VOICE_ONNET_W4': client.traf_out_voice_onnet_w4,
                'CNT_OUT_VOICE_ONNET_W4': client.cnt_out_voice_onnet_w4,
                'SLOPE_V_ONNET_DUR': client.slope_v_onnet_dur,
                'SLOPE_SD_VI_OFFNET_DUR': client.slope_sd_vi_offnet_dur
            })
        
        df = pd.DataFrame(data)
        
        # Perform prediction
        X = df.drop(columns=['Tariff_Profile'])
        y_pred = model.predict(X)
        
        # Add predictions to the DataFrame
        df['flag'] = y_pred
        
        # Query profiles from the database
        profiles = Profiles.query.all()
        
        # Create a mapping of tariff profile IDs to names
        profile_mapping = {profile.id_profile: profile.tariff_profile for profile in profiles}
        
        
        # Replace tariff profile IDs with names in the DataFrame
        df['Tariff_Profile'] = df['Tariff_Profile'].map(profile_mapping)
        
        # Group by tariff profile and calculate churner and non-churner counts
        grouped = df.groupby('Tariff_Profile').flag.value_counts().unstack(fill_value=0)
        grouped.columns = ['nonchurnersCount', 'churnersCount']  # Rename columns for clarity
        grouped = grouped.reset_index()
        
        # Format the data for JSON response
        formatted_data = grouped.to_dict(orient='records')
        
        print(formatted_data)
        
        return jsonify(formatted_data), 200
    except Exception as e:
        print('Error fetching column chart data:', e)
        return jsonify({'error': 'Internal Server Error'}), 500


#______________________________________________________
@app.route('/dashboard/maxchurnprofile', methods=['GET'])
def get_max_churn_profile():
    try:
        data = db.session.query(
            Profiles.tariff_profile.label('tariff_profile'),
            func.sum(case((ClientInfos.flag == 1, 1), else_=0)).label('churnersCount')
        ).join(Profiles, ClientInfos.tariff_profile_id == Profiles.id_profile)\
         .group_by(Profiles.tariff_profile)\
         .order_by(func.sum(case((ClientInfos.flag == 1, 1), else_=0)).desc())\
         .first()
        
        if data:
            result = {
                'tariff_profile': data.tariff_profile,
                'churnersCount': data.churnersCount
            }
        else:
            result = {'tariff_profile': None, 'churnersCount': 0}
        
        return jsonify(result), 200
    except Exception as e:
        print('Error fetching max churn profile:', e)
        return jsonify({'error': 'Internal Server Error'}), 500

#______________________________________________________
#                     Uplift Page
#______________________________________________________
#_________________________________________________
# Predict all dataset and calculate uplift
def uplift_method():
    client_infos = ClientInfos.query.all()
    
    data = []
    for client in client_infos:
        data.append({
            'Tenure': client.tenure,
            'Seg_Tenure': client.seg_tenure,
            'Pasivity_G': client.pasivity_g,
            'Value_Segment': client.value_segment,
            'CNT_OUT_VOICE_ONNET_M6': client.cnt_out_voice_onnet_m6,
            'CNT_OUT_VOICE_ONNET_M5': client.cnt_out_voice_onnet_m5,
            'CNT_OUT_VOICE_OFFNET_M6': client.cnt_out_voice_offnet_m6,
            'CNT_OUT_VOICE_OFFNET_M5': client.cnt_out_voice_offnet_m5,
            'REV_OUT_VOICE_OFFNET_W4': client.rev_out_voice_offnet_w4,
            'TRAF_OUT_VOICE_OFFNET_W4': client.traf_out_voice_offnet_w4,
            'CNT_OUT_VOICE_ROAMING_W4': client.cnt_out_voice_roaming_w4,
            'REV_DATA_PAG_W4': client.rev_data_pag_w4,
            'REV_REFILL_M5': client.rev_refill_m5,
            'CNT_REFILL_M6': client.cnt_refill_m6,
            'CNT_REFILL_M5': client.cnt_refill_m5,
            'CNT_REFILL_W4': client.cnt_refill_w4,
            'REV_REFILL_W4': client.rev_refill_w4,
            'FLAG_Inactive_3Days': client.flag_inactive_3days,
            'Count_Inactive_3Days': client.count_inactive_3days,
            'Count_Inactive_4Days': client.count_inactive_4days,
            'Count_Inactive_5Days': client.count_inactive_5days,
            'Count_Inactive_10Days_and_more': client.count_inactive_10days_and_more,
            'CONSUMER_TYPE_M5': client.consumer_type_m5,
            'CONSUMER_TYPE_M6': client.consumer_type_m6,
            'TRAF_IN_VOICE_ONNET_M5': client.traf_in_voice_onnet_m5,
            'CNT_IN_VOICE_INTERNATIONAL_M5': client.cnt_in_voice_international_m5,
            'CNT_IN_SMS_ONNET_M4': client.cnt_in_sms_onnet_m4,
            'TRAF_IN_VOICE_INTERNATIONAL_W4': client.traf_in_voice_international_w4,
            'CNT_IN_SMS_OFFNET_W4': client.cnt_in_sms_offnet_w4,
            'SLOPE_SD_VI_ONNET_DUR': client.slope_sd_vi_onnet_dur,
            'DEGREES_SD_VI_ONNET_DUR': client.degrees_sd_vi_onnet_dur,
            'SLOPE_VI_OFFNET_DUR': client.slope_vi_offnet_dur,
            'SLOPE_D__FREE_VOL': client.slope_d__free_vol,
            'Rev_Month_Before_Current_Month': int(client.rev_month_before_current_month),
            'TRAF_OUT_VOICE_ONNET_M6': client.traf_out_voice_onnet_m6,
            'TRAF_OUT_VOICE_ONNET_M4': client.traf_out_voice_onnet_m4,
            'TRAF_OUT_VOICE_ONNET_M3': client.traf_out_voice_onnet_m3,
            'REV_BUNDLE_M6': client.rev_bundle_m6,
            'TRAF_OUT_VOICE_ONNET_W4': client.traf_out_voice_onnet_w4,
            'CNT_OUT_VOICE_ONNET_W4': client.cnt_out_voice_onnet_w4,
            'SLOPE_V_ONNET_DUR': client.slope_v_onnet_dur,
            'SLOPE_SD_VI_OFFNET_DUR': client.slope_sd_vi_offnet_dur,
            'flag' : client.flag
        })
        
    df = pd.DataFrame(data)
    print(df)
    
    X = df.drop(columns=['flag'])
    y = df['flag']
    y_pred = model.predict(X)
    predicted_probabilities = model.predict_proba(X)

    # Create DataFrames for predicted flags and probabilities
    predicted_proba_df = pd.DataFrame(predicted_probabilities, columns=[f'Prob_{i}' for i in range(predicted_probabilities.shape[1])])
    true_labels_df = pd.Series(y, name='True_Label')
    predicted_labels_df = pd.Series(y_pred.flatten(), name='Pred_Label')
    combined_df = pd.concat([predicted_proba_df, true_labels_df, predicted_labels_df], axis=1)

    # Sort combined DataFrame by 'Prob_1' in descending order
    combined_df_sorted = combined_df.sort_values(by='Prob_1', ascending=False)

    ########### DECILE ###############
    # Add percentile column based on 'Prob_1'
    combined_df_sorted['Percentile'] = pd.qcut(combined_df_sorted['Prob_1'], q=10, labels=list(range(9, -1, -1)))
    print(combined_df_sorted)

    # Calculate the mean of 'Prob_1' for each percentile
    percentile_avg_sorted = combined_df_sorted.groupby('Percentile')['Prob_1'].mean().sort_values(ascending=False)
    print(percentile_avg_sorted)
    
    # Calculate the average of Prob_1 for each percentile
    percentile_sum = combined_df_sorted.groupby('Percentile')['True_Label'].sum()
    percentile_sum = percentile_sum.sort_values(ascending=False)

    # Calculer le nombre de churners dans chaque décile par rapport à toute la population
    churners_count = combined_df_sorted['True_Label'].sum()
    churners_per_decile = []
    num_decile = 1
    for decile in percentile_sum:
        churners_percentage = decile / churners_count * 100
        churners_per_decile.append({'Decile': num_decile,  'Churners_Percentage': churners_percentage})
        num_decile = num_decile + 1 
    
    return churners_per_decile

@app.route('/uplift', methods=['GET'])
def get_column_chart_data():
    try:
        uplift_df = uplift_method()
        print(uplift_df)
        
        return jsonify(uplift_df), 200
    except Exception as e:
        print('Error fetching column chart data:', e)
        return jsonify({'error': 'Internal Server Error'}), 500

#_________________________________________________
#               Prediction Form 
#_________________________________________________
@app.route("/prediction", methods=["POST"])
def predict_custumer():
    try: 
        id_client = request.json["idClient"]
  
        client = ClientInfos.query.filter_by(id_client=id_client).first()
  
        if client is None:
            return jsonify({"error": "ID Client doesn't exist"}), 401
        
        # Convert client data to a pandas DataFrame
        client_data_dict = {
            "Tenure": client.tenure,
            "Seg_Tenure": client.seg_tenure,
            "Pasivity_G": client.pasivity_g,
            "Value_Segment": client.value_segment,
            "CNT_OUT_VOICE_ONNET_M6": client.cnt_out_voice_onnet_m6,
            "CNT_OUT_VOICE_ONNET_M5": client.cnt_out_voice_onnet_m5,
            "CNT_OUT_VOICE_OFFNET_M6": client.cnt_out_voice_offnet_m6,
            "CNT_OUT_VOICE_OFFNET_M5": client.cnt_out_voice_offnet_m5,
            "REV_OUT_VOICE_OFFNET_W4": client.rev_out_voice_offnet_w4,
            "TRAF_OUT_VOICE_OFFNET_W4": client.traf_out_voice_offnet_w4,
            "CNT_OUT_VOICE_ROAMING_W4": client.cnt_out_voice_roaming_w4,
            "REV_DATA_PAG_W4": client.rev_data_pag_w4,
            "REV_REFILL_M5": client.rev_refill_m5,
            "CNT_REFILL_M6": client.cnt_refill_m6,
            "CNT_REFILL_M5": client.cnt_refill_m5,
            "CNT_REFILL_W4": client.cnt_refill_w4,
            "REV_REFILL_W4": client.rev_refill_w4,
            "FLAG_Inactive_3Days": client.flag_inactive_3days,
            "Count_Inactive_3Days": client.count_inactive_3days,
            "Count_Inactive_4Days": client.count_inactive_4days,
            "Count_Inactive_5Days": client.count_inactive_5days,
            "Count_Inactive_10Days_and_more": client.count_inactive_10days_and_more,
            "CONSUMER_TYPE_M5": client.consumer_type_m5,
            "CONSUMER_TYPE_M6": client.consumer_type_m6,
            "TRAF_IN_VOICE_ONNET_M5": client.traf_in_voice_onnet_m5,
            "CNT_IN_VOICE_INTERNATIONAL_M5": client.cnt_in_voice_international_m5,
            "CNT_IN_SMS_ONNET_M4": client.cnt_in_sms_onnet_m4,
            "TRAF_IN_VOICE_INTERNATIONAL_W4": client.traf_in_voice_international_w4,
            "CNT_IN_SMS_OFFNET_W4": client.cnt_in_sms_offnet_w4,
            "SLOPE_SD_VI_ONNET_DUR": client.slope_sd_vi_onnet_dur,
            "DEGREES_SD_VI_ONNET_DUR": client.degrees_sd_vi_onnet_dur,
            "SLOPE_VI_OFFNET_DUR": client.slope_vi_offnet_dur,
            "SLOPE_D__FREE_VOL": client.slope_d__free_vol,
            "Rev_Month_Before_Current_Month": int(client.rev_month_before_current_month),
            "TRAF_OUT_VOICE_ONNET_M6": client.traf_out_voice_onnet_m6,
            "TRAF_OUT_VOICE_ONNET_M4": client.traf_out_voice_onnet_m4,
            "TRAF_OUT_VOICE_ONNET_M3": client.traf_out_voice_onnet_m3,
            "REV_BUNDLE_M6": client.rev_bundle_m6,
            "TRAF_OUT_VOICE_ONNET_W4": client.traf_out_voice_onnet_w4,
            "CNT_OUT_VOICE_ONNET_W4": client.cnt_out_voice_onnet_w4,
            "SLOPE_V_ONNET_DUR": client.slope_v_onnet_dur,
            "SLOPE_SD_VI_OFFNET_DUR": client.slope_sd_vi_offnet_dur,
        }
        
        client_data_df = pd.DataFrame([client_data_dict])
        print(client_data_df)

        # Predict with the client infromations 
        prediction = model.predict(client_data_df)
        print(prediction.tolist())
        
        prediction_proba = model.predict_proba(client_data_df)
        
        # Assuming the positive class (churn) is the second column
        churn_probability = round(prediction_proba[0][1] * 100, 2)
        
        # Get result 
        return jsonify({'prediction': prediction.tolist(), 'probability': churn_probability})
    except Exception as e:
        print('Error fetching client data:', e)
        return jsonify({'error': 'Internal Server Error'}), 500

#_________________________________________________
#             Registration Form 
#_________________________________________________
@app.route("/register", methods=["POST"])
def register():
    firstname = request.json["firstname"]
    lastname = request.json["lastname"]
    email = request.json["email"]
    password = request.json["password"]
 
    user_exists = User.query.filter_by(email=email).first() is not None
 
    if user_exists:
        return jsonify({"error": "Email already exists"}), 409
     
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(firstname=firstname, lastname=lastname, email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
 
    session["user_id"] = new_user.id
 
    return jsonify({
        "id": new_user.id,
        "email": new_user.email
    })

#_________________________________________________
#                   Login Form 
#_________________________________________________
@app.route("/login", methods=["POST"])
def login_user():
    email = request.json["email"]
    password = request.json["password"]
  
    user = User.query.filter_by(email=email).first()
  
    if user is None:
        return jsonify({"error": "Unauthorized Access"}), 401
  
    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Unauthorized"}), 401
      
    session["user_id"] = user.id
    access_token = create_access_token(identity=email)
    
    return jsonify(access_token=access_token)
#_________________________________________________
#                   Logout
#_________________________________________________
@app.route("/logout", methods=["POST"])
def logout_user():
    session.pop("user_id")
    return "200"


#_________________________________________________
#                  
#_________________________________________________
## ====================================================================================== ##
if __name__ == "__main__":
    app.run(debug=True)