# flask import
from flask import Flask, request, jsonify, session, make_response, send_file
import io
from io import StringIO
from flask import redirect, url_for
from flask_session import Session
from flask_bcrypt import Bcrypt
from flask_cors import CORS, cross_origin
from functools import wraps
from datetime import datetime, timedelta
from sqlalchemy import func, case, inspect
from sqlalchemy import create_engine, Table, Column, Integer, Float, MetaData
from sqlalchemy.sql import text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from flask_migrate import Migrate
import pandas as pd
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import delete
from sqlalchemy.exc import SQLAlchemyError
# project db, config import 
from models import db, admin, User, Role, ChrunTrend, ClientInfos, Sous_segment, Profiles, TestDataset
from config import ApplicationConfig 

#from utils import generate_sitemap, APIException 

from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager, unset_jwt_cookies, get_jwt

import joblib
import pandas as pd
import csv
import io
## ==============================|| FLASK - BACKEND ||============================== ##

app = Flask(__name__)
app.config['SECRET_KEY'] = 'vbjvsieomvdpognszvzrivnbeoib864531648531'
app.config.from_object(ApplicationConfig)
app.config['JWT_SECRET_KEY'] = 'JWT_SECRET_KEY'
jwt = JWTManager(app)

engine = create_engine(app.config['SQLALCHEMY_DATABASE_URI'])

bcrypt = Bcrypt(app) 
server_session = Session(app)
CORS(app, supports_credentials=True)

db.init_app(app)  
admin.init_app(app)
with app.app_context():
    db.create_all()

migrate = Migrate(app,db)

# Loading pre-trained XGBoost model
model = joblib.load('Models\Xgboost_model.joblib')

#_________________________________________________
#                 GET ALL USERS
#_________________________________________________
@app.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([user_to_dict(user) for user in users])

#_________________________________________________
#                   GET USER
#_________________________________________________
@app.route('/users/<user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get(user_id)
    if user is None:
        return jsonify({'error': 'User not found'}), 404
    return jsonify(user_to_dict(user))

#_________________________________________________
#                  CREATE USER
#_________________________________________________
@app.route('/users', methods=['POST'])
def create_user():
    firstname = request.json["firstname"]
    lastname = request.json["lastname"]
    email = request.json["email"]
    password = request.json["password"]
    role_id = request.json["role_id"]
 
    user_exists = User.query.filter_by(email=email).first() is not None
 
    if user_exists:
        return jsonify({"error": "Email already exists"}), 409
     
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    
    role = Role.query.get(role_id)
    if not role:
        return jsonify({"error": "Role not found"}), 404
    
    new_user = User(firstname=firstname, lastname=lastname, email=email, password=hashed_password, role_id=role_id)
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify(user_to_dict(new_user)), 201

#_________________________________________________
#                  UPDATE USER
#_________________________________________________
@app.route('/users/<user_id>', methods=['PUT'])
def update_user(user_id):
    user = User.query.get(user_id)
    if user is None:
        return jsonify({'error': 'User not found'}), 404

    data = request.json
    user.firstname = data.get("firstname", user.firstname)
    user.lastname = data.get("lastname", user.lastname)
    user.email = data.get("email", user.email)
    
    if "password" in data and data["password"]:
        hashed_password = bcrypt.generate_password_hash(data["password"]).decode('utf-8')
        user.password = hashed_password
    
    if "role_id" in data:
        role_id = data["role_id"]
        role = Role.query.get(role_id)
        if role:
            user.role_id = role.id
        else:
            return jsonify({'error': 'Role not found'}), 404


    db.session.commit()

    return jsonify(user_to_dict(user)), 200

#_________________________________________________
#                  DELETE USER
#_________________________________________________
@app.route('/users/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get(user_id)
    if user is None:
        return jsonify({'error': 'User not found'}), 404
    db.session.delete(user)
    db.session.commit()
    return '', 204

#_________________________________________________
#             GET ALL EXISTING ROLES
#_________________________________________________
@app.route('/roles', methods=['GET'])
def get_roles():
    roles = Role.query.all()
    return jsonify([role_to_dict(role) for role in roles])

#_________________________________________________
#                   GET ROLE
#_________________________________________________
@app.route('/roles/<role_id>', methods=['GET'])
def get_role(role_id):
    role = Role.query.get(role_id)
    if role is None:
        return jsonify({'error': 'Role not found'}), 404
    return jsonify(role_to_dict(role))

#_________________________________________________
#               USER / ROLE DICTs
#_________________________________________________
def user_to_dict(user):
    return {
        'id': user.id,
        'firstname': user.firstname,
        'lastname': user.lastname,
        'email': user.email,
        'password': user.password,
        'role': role_to_dict(user.role) if user.role else None
    }

def role_to_dict(role):
    return {
        'id': role.id,
        'name': role.name
    }

#_________________________________________________
#               UPLOAD DATASET
#_________________________________________________
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'success': False, 'message': 'No file part'})

    file = request.files['file']
    if file.filename == '':
        return jsonify({'success': False, 'message': 'No selected file'})

    if file and file.filename.endswith('.csv'):
        # Read CSV file into a pandas DataFrame
        df = pd.read_csv(file)
        
        # Mapping between CSV column names and database column names
        column_mapping = {
            'id_client': 'id_client',
            'Phone_Number': 'phone_number',
            'Tenure': 'tenure',
            'Seg_Tenure': 'seg_tenure',
            'Pasivity_G': 'pasivity_g',
            'Value_Segment':'value_segment', 
            'Tariff_Profile':'tariff_profile', 
            'CNT_OUT_VOICE_ONNET_M6':'cnt_out_voice_onnet_m6', 
            'CNT_OUT_VOICE_ONNET_M5':'cnt_out_voice_onnet_m5', 
            'CNT_OUT_VOICE_OFFNET_M6':'cnt_out_voice_offnet_m6', 
            'CNT_OUT_VOICE_OFFNET_M5':'cnt_out_voice_offnet_m5', 
            'REV_OUT_VOICE_OFFNET_W4':'rev_out_voice_offnet_w4' ,
            'TRAF_OUT_VOICE_OFFNET_W4':'traf_out_voice_offnet_w4' ,
            'CNT_OUT_VOICE_ROAMING_W4':'cnt_out_voice_roaming_w4' ,
            'REV_DATA_PAG_W4':'rev_data_pag_w4', 
            'REV_REFILL_M5':'rev_refill_m5' ,
            'CNT_REFILL_M6':'cnt_refill_m6' ,
            'CNT_REFILL_M5':'cnt_refill_m5' ,
            'CNT_REFILL_W4':'cnt_refill_w4' ,
            'REV_REFILL_W4':'rev_refill_w4' ,
            'FLAG_Inactive_3Days':'flag_inactive_3days' ,
            'Count_Inactive_3Days':'count_inactive_3days' ,
            'Count_Inactive_4Days':'count_inactive_4days' ,
            'Count_Inactive_5Days':'count_inactive_5days' ,
            'Count_Inactive_10Days_and_more':'count_inactive_10days_and_more' ,
            'CONSUMER_TYPE_M5':'consumer_type_m5' ,
            'CONSUMER_TYPE_M6':'consumer_type_m6' ,
            'TRAF_IN_VOICE_ONNET_M5':'traf_in_voice_onnet_m5' ,
            'CNT_IN_VOICE_INTERNATIONAL_M5':'cnt_in_voice_international_m5' ,
            'CNT_IN_SMS_ONNET_M4':'cnt_in_sms_onnet_m4' ,
            'TRAF_IN_VOICE_INTERNATIONAL_W4':'traf_in_voice_international_w4' ,
            'CNT_IN_SMS_OFFNET_W4':'cnt_in_sms_offnet_w4' ,
            'SLOPE_SD_VI_ONNET_DUR':'slope_sd_vi_onnet_dur' ,
            'DEGREES_SD_VI_ONNET_DUR':'degrees_sd_vi_onnet_dur' ,
            'SLOPE_VI_OFFNET_DUR':'slope_vi_offnet_dur' ,
            'SLOPE_D__FREE_VOL':'slope_d__free_vol' ,
            'Rev_Month_Before_Current_Month':'rev_month_before_current_month' ,
            'TRAF_OUT_VOICE_ONNET_M6':'traf_out_voice_onnet_m6',
            'TRAF_OUT_VOICE_ONNET_M4':'traf_out_voice_onnet_m4',
            'TRAF_OUT_VOICE_ONNET_M3':'traf_out_voice_onnet_m3',
            'REV_BUNDLE_M6':'rev_bundle_m6',
            'TRAF_OUT_VOICE_ONNET_W4':'traf_out_voice_onnet_w4',
            'CNT_OUT_VOICE_ONNET_W4':'cnt_out_voice_onnet_w4',
            'SLOPE_V_ONNET_DUR':'slope_v_onnet_dur',
            'SLOPE_SD_VI_OFFNET_DUR':'slope_sd_vi_offnet_dur',
            'flag':'flag'
        }

        # Rename DataFrame columns to match database column names
        df.rename(columns=column_mapping, inplace=True)
        
        try:
            with engine.connect() as connection: 
                # Create a delete statement targeting the table
                delete_statement = delete(ClientInfos)

                # Execute the delete statement
                connection.execute(delete_statement)

                # Commit the transaction
                connection.commit()
                
                # Insert new data from the DataFrame
                df.to_sql('clientdataset', con=connection, if_exists='append', index=False)
                print("Data inserted successfully")
                
            return jsonify({'success': True, 'message': 'File uploaded successfully'})
        except Exception as e:
            return jsonify({'success': False, 'message': str(e)})

#_________________________________________________
#          UPDATE TO THE NEW DATASET 
#_________________________________________________
@app.route('/updatedateset', methods=["POST"])
def update_dataset():
    try:
        predict_dataset()

        return jsonify({'message':'dataset updated succefully '}), 200
    except Exception as e:
        print('Error fetching analytics data:', e)
        return jsonify({'error': 'Internal Server Error'}), 500


#_________________________________________________
#             Dashboard first row
#_________________________________________________
def predict_dataset():
    with app.app_context(): 
        client_infos = ClientInfos.query.all()
        
        data = []
        for client in client_infos:
            data.append({
                'id_client': client.id_client,
                'phone_number': client.phone_number,
                'Tenure': client.tenure,
                'Seg_Tenure': client.seg_tenure,
                'Pasivity_G': client.pasivity_g,
                'Value_Segment': client.value_segment,
                'Tariff_profile' : client.tariff_profile,
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
        
        X = df.drop(columns=['flag', 'id_client','phone_number','Tariff_profile'])
        y = df['flag']
        y_pred = model.predict(X)
        predicted_probabilities = model.predict_proba(X)
       
        predicted_proba_df = pd.DataFrame(predicted_probabilities, columns=[f'prob_{i}' for i in range(predicted_probabilities.shape[1])])
        
        df['pred_flag'] = y_pred
        df = pd.concat([df, predicted_proba_df], axis=1)
        
        # Convert DataFrame to SQLAlchemy table and create view
        metadata = MetaData()

        client_data_table = Table('client_data_predictions', metadata,
            Column('id', Integer, primary_key=True, autoincrement=True),
            Column('Tenure', Integer),
            Column('Seg_Tenure', Integer),
            Column('Pasivity_G', Integer),
            Column('Value_Segment', Integer),
            Column('CNT_OUT_VOICE_ONNET_M6', Integer),
            Column('CNT_OUT_VOICE_ONNET_M5', Integer),
            Column('CNT_OUT_VOICE_OFFNET_M6', Integer),
            Column('CNT_OUT_VOICE_OFFNET_M5', Integer),
            Column('REV_OUT_VOICE_OFFNET_W4', Integer),
            Column('TRAF_OUT_VOICE_OFFNET_W4', Integer),
            Column('CNT_OUT_VOICE_ROAMING_W4', Integer),
            Column('REV_DATA_PAG_W4', Integer),
            Column('REV_REFILL_M5', Integer),
            Column('CNT_REFILL_M6', Integer),
            Column('CNT_REFILL_M5', Integer),
            Column('CNT_REFILL_W4', Integer),
            Column('REV_REFILL_W4', Integer),
            Column('FLAG_Inactive_3Days', Integer),
            Column('Count_Inactive_3Days', Integer),
            Column('Count_Inactive_4Days', Integer),
            Column('Count_Inactive_5Days', Integer),
            Column('Count_Inactive_10Days_and_more', Integer),
            Column('CONSUMER_TYPE_M5', Integer),
            Column('CONSUMER_TYPE_M6', Integer),
            Column('TRAF_IN_VOICE_ONNET_M5', Integer),
            Column('CNT_IN_VOICE_INTERNATIONAL_M5', Integer),
            Column('CNT_IN_SMS_ONNET_M4', Integer),
            Column('TRAF_IN_VOICE_INTERNATIONAL_W4', Integer),
            Column('CNT_IN_SMS_OFFNET_W4', Integer),
            Column('SLOPE_SD_VI_ONNET_DUR', Integer),
            Column('DEGREES_SD_VI_ONNET_DUR', Integer),
            Column('SLOPE_VI_OFFNET_DUR', Integer),
            Column('SLOPE_D__FREE_VOL', Integer),
            Column('Rev_Month_Before_Current_Month', Integer),
            Column('TRAF_OUT_VOICE_ONNET_M6', Float),
            Column('TRAF_OUT_VOICE_ONNET_M4', Float),
            Column('TRAF_OUT_VOICE_ONNET_M3', Float),
            Column('REV_BUNDLE_M6', Float),
            Column('TRAF_OUT_VOICE_ONNET_W4', Float),
            Column('CNT_OUT_VOICE_ONNET_W4', Float),
            Column('SLOPE_V_ONNET_DUR', Float),
            Column('SLOPE_SD_VI_OFFNET_DUR', Float),
            Column('flag', Integer),
            Column('pred_flag', Integer),
            Column('prob_0', Float),
            Column('prob_1', Float)
        )

        # Drop the table if it exists and recreate it
        inspector = inspect(engine)
        if inspector.has_table('client_data_predictions'):
            client_data_table.drop(engine)
        metadata.create_all(engine)

        # Insert the data from the DataFrame into the table
        df.to_sql('client_data_predictions', engine, if_exists='replace', index=False)

    return y_pred
 
predict_dataset()

@app.route('/dashboard/analytics', methods=["GET"])
@jwt_required()
def get_analytics():
    try:
        with app.app_context():
            engine = create_engine(app.config['SQLALCHEMY_DATABASE_URI'])
            query = "SELECT pred_flag FROM client_data_predictions"
            df = pd.read_sql(query, engine)
        
        # Convert the prediction column to a pandas Series
        y_pred_series = df['pred_flag']
        
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
            'churnersPercentage': round(float(churners_percentage), 2),
            'nonChurnersPercentage': round(float(non_churners_percentage), 2)
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
        # # Retrieve the interval from the query parameters
        interval = request.args.get('interval', 'day')

        # # Set the default date format and interval for the query
        # date_format = "%Y-%m-%d"
        # interval_func = func.date_trunc('day', ChrunTrend.churn_date)
        
        # # Adjust the interval and date format for month aggregation
        # if interval == 'month':
        #     date_format = "%Y-%m"
        #     interval_func = func.date_trunc('month', ChrunTrend.churn_date)
        
        # # Query the database based on the specified interval
        # churn_data = db.session.query(interval_func.label('interval'), func.sum(ChrunTrend.churnernumber).label('total_churner_number')) \
        #     .group_by(interval_func) \
        #     .order_by(interval_func) \
        #     .all()
            
        
        with app.app_context():
            if interval == 'month':
                sql_query =""" 
                        SELECT 
                            date_trunc('month', date_churn) AS month,
                            COUNT(*) AS churner_number
                        FROM clientdataset
                        WHERE flag = 1
                        GROUP BY month
                        ORDER BY month;
                """
            else : 
                sql_query =""" 
                        SELECT 
                            date_trunc('week', date_churn) AS week,
                            COUNT(*) AS churner_number
                        FROM clientdataset
                        WHERE flag = 1
                        GROUP BY week
                        ORDER BY week;
                """

            with db.engine.connect() as connection:
                    churn_data = connection.execute(text(sql_query)).fetchall()
                
        # Format the data as per the interval
        formatted_data = [{
            'ChurnDate': date, 
            'ChurnerNumber': churner_number}
            for date, churner_number in churn_data]
        
        return jsonify(formatted_data), 200
    except Exception as e:
        print('Error fetching line chart data:', e)
        return jsonify({'error': 'Internal Server Error'}), 500

# Donut Chart : Churn Per Value Segment 
@app.route('/dashboard/donutchartdata', methods=['GET'])
def get_donut_chart_data():
    try:
        sql_query = """
            SELECT s.value_segment, COUNT(cdp.pred_flag)
            FROM sous_segment s
            JOIN client_data_predictions cdp ON cdp."Value_Segment" = s.id_segment
            GROUP BY s.value_segment
        """

        # Execute the raw SQL query within the context of the Flask application
        result = db.session.execute(text(sql_query))
        
        # Fetch all rows from the result
        rows = result.fetchall()

        # Process the rows into the desired format
        data = [{'valueSegment': row[0], 'flagCount': row[1]} for row in rows]

        return jsonify(data), 200
    except Exception as e:
        print('Error fetching donut chart data:', e)
        return jsonify({'error': 'Internal Server Error'}), 500


#______________________________________________________
#               Dashboard third row
#______________________________________________________
@app.route('/dashboard/tabledata', methods=['GET'])
def get_table_data():
    try:
        with app.app_context():
            sql_query = """
                SELECT cdp.id_client, cdp.phone_number, sg.seg_Tenure, ss.value_segment, p.tariff_profile, pred_flag
                FROM client_data_predictions cdp, Segment_tenure sg, Sous_segment ss, Profiles p
                WHERE   pred_flag = 1 
                        and cdp."Seg_Tenure" = sg.id_tenure 
                        and cdp."Value_Segment" = ss.id_segment
                        and cdp."Tariff_profile" = p.id_profile ;
            """
            with db.engine.connect() as connection:
                result = connection.execute(text(sql_query)).fetchall()

        # Format the result as a list of dictionaries
        formatted_result = []
        for row in result:
            formatted_result.append({
                'id_client': row[0],
                'phone_number': row[1],
                'seg_tenure': row[2],
                'value_segment': row[3],
                'tariff_profile': row[4],
                'pred_flag': row[5]
            })

        return jsonify(formatted_result), 200
    except Exception as e:
        print('Error fetching table data:', e)
        return jsonify({'error': 'Internal Server Error'}), 500


#______________________________________________________
#               Dashboard fourth row
#______________________________________________________
# Column Chart : Churn Per Tariff Profile
@app.route('/dashboard/columnchartdata', methods=['GET'])
def get_column_chart_data_tarif():
    try:
        with app.app_context():
            sql_query = """
                SELECT "Tariff_profile", pred_flag
                FROM client_data_predictions;
            """
            with db.engine.connect() as connection:
                result = connection.execute(text(sql_query)).fetchall()

        data = []
        for row in result:
            data.append({
                'Tariff_Profile': row[0],
                'pred_flag': row[1]
            })

        df = pd.DataFrame(data)

        # Query profiles from the database
        profiles = Profiles.query.all()

        # Create a mapping of tariff profile IDs to names
        profile_mapping = {profile.id_profile: profile.tariff_profile for profile in profiles}

        # Replace tariff profile IDs with names in the DataFrame
        df['Tariff_Profile'] = df['Tariff_Profile'].map(profile_mapping)

        # Group by tariff profile and calculate churner and non-churner counts
        grouped = df.groupby('Tariff_Profile').pred_flag.value_counts().unstack(fill_value=0)
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
        with app.app_context():
            sql_query = """
                SELECT "Tariff_profile", SUM(CASE WHEN flag = 1 THEN 1 ELSE 0 END) AS churnersCount
                FROM client_data_predictions
                GROUP BY "Tariff_profile"
                ORDER BY churnersCount DESC
                LIMIT 1;
            """
            with db.engine.connect() as connection:
                result = connection.execute(text(sql_query)).fetchone()
        
        if result:
            response = {
                'tariff_profile': result[0],
                'churnersCount': result[1] 
            }
        else:
            response = {'tariff_profile': None, 'churnersCount': 0}
        
        return jsonify(response), 200
    except Exception as e:
        print('Error fetching max churn profile:', e)
        return jsonify({'error': 'Internal Server Error'}), 500


#______________________________________________________
#                     Segment Page
#______________________________________________________
@app.route('/Segments', methods=['GET'])
def get_segments_chart_data():
    try:
        sql_query = """
            SELECT 
                s.value_segment,
                SUM(CASE WHEN cdp.pred_flag = 1 THEN 1 ELSE 0 END) AS nb_churners,
                SUM(CASE WHEN cdp.pred_flag = 0 THEN 1 ELSE 0 END) AS nb_non_churners
            FROM sous_segment s
            JOIN client_data_predictions cdp ON cdp."Value_Segment" = s.id_segment
            GROUP BY s.value_segment
        """

        # Execute the raw SQL query within the context of the Flask application
        result = db.session.execute(text(sql_query))
        
        # Fetch all rows from the result
        rows = result.fetchall()

        # Process the rows into the desired format
        data = [
            {
                'valueSegment': row[0],
                'nbChurners': row[1],
                'nbNonChurners': row[2]
            }
            for row in rows
        ]
        # Print the raw rows and the processed data to the console for debugging
        print('Raw rows:', rows)
        print('Processed data:', data)

        return jsonify(data), 200
    except Exception as e:
        print('Error fetching donut chart data:', e)
        return jsonify({'error': 'Internal Server Error'}), 500
    
    
#Segment_tenure
@app.route('/TenureSegments', methods=['GET'])
def get_tenure_segments_chart_data():
    try:
        sql_query = """          
            SELECT 
                t.seg_tenure,
                SUM(CASE WHEN cdp.pred_flag = 1 THEN 1 ELSE 0 END) AS nb_churners_,
                SUM(CASE WHEN cdp.pred_flag = 0 THEN 1 ELSE 0 END) AS nb_non_churners_
            FROM segment_tenure t
            JOIN client_data_predictions cdp ON cdp."Seg_Tenure" = t.id_tenure
            GROUP BY t.seg_tenure
        """
        
        result = db.session.execute(text(sql_query))
        
        rows = result.fetchall()
        data_2 = [
            {
                'tenureSegment': row[0],
                'nbChurners': row[1],
                'nbNonChurners': row[2]
            }
            for row in rows
        ]
        
        print('Processed data:', data_2)

        return jsonify(data_2), 200
    except Exception as e:
        print('Error fetching tenure segments chart data:', e)
        return jsonify({'error': 'Internal Server Error'}), 500


#______________________________________________________
#                     Uplift Page
#______________________________________________________
# Predict all dataset and calculate uplift
def uplift_method():
    client_infos = ClientInfos.query.all()
    
    data = []
    for client in client_infos:
        data.append({
            'id_client': client.id_client,
            'phone_number': client.phone_number,
            'Tenure': client.tenure,
            'Seg_Tenure': client.seg_tenure,
            'Pasivity_G': client.pasivity_g,
            'Tariff_Profile': client.tariff_profile,
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
            'flag': client.flag
        })
        
    df = pd.DataFrame(data)
    
    id_phone_df = df[['id_client', 'phone_number','Tariff_Profile','flag']]
    X = df.drop(columns=['flag', 'id_client', 'phone_number', 'Tariff_Profile'])
    y = df['flag']
    
    y_pred = model.predict(X)
    predicted_probabilities = model.predict_proba(X)

    predicted_proba_df = pd.DataFrame(predicted_probabilities, columns=[f'Prob_{i}' for i in range(predicted_probabilities.shape[1])])
    true_labels_df = pd.Series(y, name='True_Label')
    predicted_labels_df = pd.Series(y_pred.flatten(), name='Pred_Label')
    combined_df = pd.concat([id_phone_df, X, predicted_proba_df, true_labels_df, predicted_labels_df], axis=1)

    combined_df_sorted = combined_df.sort_values(by='Prob_1', ascending=False)

    combined_df_sorted['Percentile'] = pd.qcut(combined_df_sorted['Prob_1'], q=10, labels=list(range(9, -1, -1)))

    percentile_avg_sorted = combined_df_sorted.groupby('Percentile')['Prob_1'].mean().sort_values(ascending=False)
    
    percentile_sum = combined_df_sorted.groupby('Percentile')['True_Label'].sum()
    percentile_sum = percentile_sum.sort_values(ascending=False)

    churners_count = combined_df_sorted['True_Label'].sum()
    churners_per_decile = []
    num_decile = 1
    for decile in percentile_sum:
        churners_percentage = decile / churners_count * 100
        churners_per_decile.append({'Decile': num_decile, 'Churners_Percentage': churners_percentage})
        num_decile += 1 
    
    deciles_data = {}
    for i in range(10):
        deciles_data[i] = combined_df_sorted[combined_df_sorted['Percentile'] == i]
    
    print(churners_per_decile)
    print(deciles_data)
    
    
    return churners_per_decile, deciles_data


@app.route('/uplift', methods=['GET'])
def get_column_chart_data():
    try:
        churners_per_decile, _ = uplift_method()
        return jsonify(churners_per_decile), 200
    except Exception as e:
        print('Error fetching column chart data:', e)
        return jsonify({'error': 'Internal Server Error'}), 500



@app.route('/download-decile', methods=['GET'])
def download_decile():
    try:
        decile = int(request.args.get('decile'))
        if decile < 1 or decile > 10:
            return jsonify({'error': 'Invalid decile number'}), 400

        churners_per_decile, deciles_data = uplift_method()
        
        # Extract the required decile data
        decile_data = deciles_data[decile - 1]

        # Select the relevant columns
        selected_columns = ['id_client', 'phone_number', 'Tariff_Profile', 'Seg_Tenure', 'Value_Segment', 'flag', 'True_Label', 'Pred_Label']
        decile_data_selected = decile_data[selected_columns]

        # Convert DataFrame to CSV
        csv_data = decile_data_selected.to_csv(index=False)

        # Create a response object with CSV data
        response = make_response(csv_data)
        response.headers['Content-Disposition'] = f'attachment; filename=decile_{decile}_data.csv'
        response.headers['Content-Type'] = 'text/csv'

        return response
    except Exception as e:
        print('Error downloading decile data:', e)
        return jsonify({'error': 'Internal Server Error'}), 500



#               Prediction Form 
#_________________________________________________
@app.route("/prediction", methods=["POST"])
def predict_customer():
    try:
        id_client = request.json["idClient"]
        phonenumber = request.json["phonenumber"]

        client = ClientInfos.query.filter_by(id_client=id_client).first()

        if client is None:
            return jsonify({"error": "ID Client doesn't exist"}), 401

        db_phone_number = str(client.phone_number).strip()
        input_phone_number = str(phonenumber).strip()

        # Print for debugging
        print(f"DB Phone Number: {db_phone_number} (Type: {type(db_phone_number)})")
        print(f"Input Phone Number: {input_phone_number} (Type: {type(input_phone_number)})")

        if db_phone_number != input_phone_number:
            return jsonify({"error": "Phone number does not match the ID Client"}), 401

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

        # Predict with the client information
        prediction = model.predict(client_data_df)
        prediction_proba = model.predict_proba(client_data_df)

        churn_probability = round(prediction_proba[0][1] * 100, 2)

        # Get result
        return jsonify({'prediction': prediction.tolist(), 'probability': churn_probability})
    except Exception as e:
        print('Error fetching client data:', e)
        return jsonify({'error': 'Internal Server Error'}), 500


@app.route('/client-data', methods=['GET'])
def get_client_data():
    try:
        clients = ClientInfos.query.with_entities(ClientInfos.id_client, ClientInfos.phone_number).all()
        client_data = [{"id_client": client.id_client, "phone_number": client.phone_number} for client in clients]
        return jsonify(client_data), 200
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
    try:
        email = request.json["email"]
        password = request.json["password"]
        user = User.query.filter_by(email=email).first()

        if user is None:
            return jsonify({"error": "Unauthorized Access"}), 401

        if not bcrypt.check_password_hash(user.password, password):
            return jsonify({"error": "Unauthorized"}), 401

        session["user_id"] = user.id
        print("User ID set in session:", session.get("user_id"))
        
        role_name = user.role.name
        print(role_name)
        # Generate token
        token = create_access_token(identity=user.email)

        return jsonify({'access_token': token, 'role': role_name, 'firstname': user.firstname})
    except Exception as e:
        print('Error login:', e)
        return jsonify({'error': 'Internal Server Error'}), 500


#_________________________________________________
#                   Logout Form
#_________________________________________________
@app.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    session.pop("user_id", None)
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response


#_________________________________________________
#                  Get User Infos
#_________________________________________________
@app.route("/protected")
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user).first()
    if not user:
        return jsonify({"msg": "User not found"}), 404
    
    return jsonify({
        "firstname": user.firstname,
        "role": user.role.name
    }), 200

## ====================================================================================== ##
if __name__ == "__main__":
    app.run(debug=True)