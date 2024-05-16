# flask import
from flask import Flask, request, jsonify, session
from flask import redirect, url_for
from flask_session import Session
from flask_bcrypt import Bcrypt
from flask_cors import CORS, cross_origin
from functools import wraps
from datetime import datetime, timedelta
from sqlalchemy import func

# project db, config import 
from models import db, User, ClientData, ChrunTrend
from config import ApplicationConfig 

#from utils import generate_sitemap, APIException 

from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager

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
@app.route('/dashboard/analytics', methods=["GET"])
def get_analytics():
    try:
        churners_count = ClientData.query.filter_by(flag =1).count()
        non_churners_count = ClientData.query.filter_by(flag=0).count()
        total_count = ClientData.query.count()
        
        churners_percentage = (churners_count / total_count) * 100 if total_count > 0 else 0
        non_churners_percentage = (non_churners_count / total_count) * 100 if total_count > 0 else 0
        
        analytics_data = {
            'totalCount': total_count,
            'churnersCount': churners_count,
            'nonChurnersCount': non_churners_count,
            'churnersPercentage': churners_percentage,
            'nonChurnersPercentage': non_churners_percentage
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
        data = db.session.query(ClientData.value_segment, func.count(ClientData.flag)).group_by(ClientData.value_segment).all()
        result = [{'valueSegment': row[0], 'flagCount': row[1]} for row in data]
        
        return jsonify(result), 200
    except Exception as e:
        print('Error fetching donut chart data:', e)
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