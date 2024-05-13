from flask_sqlalchemy import SQLAlchemy
from uuid import uuid4
 
db = SQLAlchemy()
 
def get_uuid():
    return uuid4().hex
 
class User(db.Model):
    __tablename__ = "usersDjezzy"
    id = db.Column(db.String(100), primary_key=True, unique=True, default=get_uuid)
    firstname = db.Column(db.String(200), nullable=False)
    lastname = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(200), nullable=False, unique=True)
    password = db.Column(db.Text, nullable=False)
    
class ClientData(db.Model):
    __tablename__ = 'clientdata'
    id_client = db.Column(db.Integer, primary_key=True)
    flag = db.Column(db.Integer)
    
class ChrunTrend(db.Model):
    __tablename__ = 'churntrend'
    churn_date = db.Column(db.Date, nullable=False, primary_key=True)
    churnernumber = db.Column(db.Integer, nullable=False)