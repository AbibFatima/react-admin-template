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
    tenure = db.Column(db.Integer, nullable=False),
    seg_tenure = db.Column(db.String(200), nullable=False),
    pasivity_g = db.Column(db.Integer, nullable=False),
    value_segment = db.Column(db.String(100), nullable=False)
    tariff_profile = db.Column(db.String(200), nullable=False),
    cnt_out_voice_onnet_m6 = db.Column(db.Integer, nullable=False),
    cnt_out_voice_onnet_m5 = db.Column(db.Integer, nullable=False),
    cnt_out_voice_offnet_m6 = db.Column(db.Integer, nullable=False),
    cnt_out_voice_offnet_m5 = db.Column(db.Integer, nullable=False),
    rev_out_voice_offnet_w4 = db.Column(db.Integer, nullable=False),
    traf_out_voice_offnet_w4 = db.Column(db.Integer, nullable=False),
    cnt_out_voice_roaming_w4 = db.Column(db.Integer, nullable=False),
    rev_data_pag_w4 = db.Column(db.Integer, nullable=False),
    rev_refill_m5 = db.Column(db.Integer, nullable=False),
    cnt_refill_m6 = db.Column(db.Integer, nullable=False),
    cnt_refill_m5 = db.Column(db.Integer, nullable=False),
    cnt_refill_w4 = db.Column(db.Integer, nullable=False),
    rev_refill_w4 = db.Column(db.Integer, nullable=False),
    flag_inactive_3days = db.Column(db.Integer, nullable=False),
    count_inactive_3days = db.Column(db.Integer, nullable=False),
    count_inactive_4days = db.Column(db.Integer, nullable=False),
    count_inactive_5days = db.Column(db.Integer, nullable=False),
    count_inactive_10days_and_more = db.Column(db.Integer, nullable=False),
    consumer_type_m5 = db.Column(db.Integer, nullable=False),
    consumer_type_m6 = db.Column(db.Integer, nullable=False),
    traf_in_voice_onnet_m5 = db.Column(db.Integer, nullable=False),
    cnt_in_voice_international_m5 = db.Column(db.Integer, nullable=False),
    cnt_in_sms_onnet_m4 = db.Column(db.Integer, nullable=False),
    traf_in_voice_international_w4 = db.Column(db.Integer, nullable=False),
    cnt_in_sms_offnet_w4 = db.Column(db.Integer, nullable=False),
    slope_sd_vi_onnet_dur = db.Column(db.Integer, nullable=False),
    degrees_sd_vi_onnet_dur = db.Column(db.Integer, nullable=False),
    slope_vi_offnet_dur = db.Column(db.Integer, nullable=False),
    slope_d__free_vol = db.Column(db.Integer, nullable=False),
    rev_month_before_current_month = db.Column(db.Integer, nullable=False),
    traf_out_voice_onnet_m6 = db.Column(db.Numeric(precision=10, scale=2), nullable=False),
    traf_out_voice_onnet_m4 = db.Column(db.Numeric(precision=10, scale=2), nullable=False),
    traf_out_voice_onnet_m3 = db.Column(db.Numeric(precision=10, scale=2), nullable=False),
    rev_bundle_m6 = db.Column(db.Numeric(precision=10, scale=2), nullable=False),
    traf_out_voice_onnet_w4 = db.Column(db.Numeric(precision=10, scale=2), nullable=False),
    cnt_out_voice_onnet_w4 = db.Column(db.Numeric(precision=10, scale=2), nullable=False),
    slope_v_onnet_dur = db.Column(db.Numeric(precision=10, scale=2), nullable=False),
    slope_sd_vi_offnet_dur = db.Column(db.Numeric(precision=10, scale=2), nullable=False),
    flag = db.Column(db.Integer)
    
class ClientInfos(db.Model):
    __tablename__ = "clientdataset"
    id_client = db.Column(db.Integer, primary_key=True, unique=True)
    tenure = db.Column(db.Integer)
    seg_tenure = db.Column(db.Integer)
    pasivity_g = db.Column(db.Integer)
    value_segment = db.Column(db.Integer)
    tariff_profile = db.Column(db.Integer)
    cnt_out_voice_onnet_m6 = db.Column(db.Integer)
    cnt_out_voice_onnet_m5 = db.Column(db.Integer)
    cnt_out_voice_offnet_m6 = db.Column(db.Integer)
    cnt_out_voice_offnet_m5 = db.Column(db.Integer)
    rev_out_voice_offnet_w4 = db.Column(db.Integer)
    traf_out_voice_offnet_w4 = db.Column(db.Integer)
    cnt_out_voice_roaming_w4 = db.Column(db.Integer)
    rev_data_pag_w4 = db.Column(db.Integer)
    rev_refill_m5 = db.Column(db.Integer)
    cnt_refill_m6 = db.Column(db.Integer)
    cnt_refill_m5 = db.Column(db.Integer)
    cnt_refill_w4 = db.Column(db.Integer)
    rev_refill_w4 = db.Column(db.Integer)
    flag_inactive_3days = db.Column(db.Integer)
    count_inactive_3days = db.Column(db.Integer)
    count_inactive_4days = db.Column(db.Integer)
    count_inactive_5days = db.Column(db.Integer)
    count_inactive_10days_and_more = db.Column(db.Integer)
    consumer_type_m5 = db.Column(db.Integer)
    consumer_type_m6 = db.Column(db.Integer)
    traf_in_voice_onnet_m5 = db.Column(db.Integer)
    cnt_in_voice_international_m5 = db.Column(db.Integer)
    cnt_in_sms_onnet_m4 = db.Column(db.Integer)
    traf_in_voice_international_w4 = db.Column(db.Integer)
    cnt_in_sms_offnet_w4 = db.Column(db.Integer)
    slope_sd_vi_onnet_dur = db.Column(db.Integer)
    degrees_sd_vi_onnet_dur = db.Column(db.Integer)
    slope_vi_offnet_dur = db.Column(db.Integer)
    slope_d__free_vol = db.Column(db.Integer)
    rev_month_before_current_month = db.Column(db.Integer)
    traf_out_voice_onnet_m6 = db.Column(db.Float)
    traf_out_voice_onnet_m4 = db.Column(db.Float)
    traf_out_voice_onnet_m3 = db.Column(db.Float)
    rev_bundle_m6 = db.Column(db.Float)
    traf_out_voice_onnet_w4 = db.Column(db.Float)
    cnt_out_voice_onnet_w4 = db.Column(db.Float)
    slope_v_onnet_dur = db.Column(db.Float)
    slope_sd_vi_offnet_dur = db.Column(db.Float)
    flag = db.Column(db.Integer)


class Sous_segment(db.Model):
    __tablename__ = 'sous_segment'
    id_segment = db.Column(db.Integer, primary_key=True)
    value_segment = db.Column(db.String(100))
    
class Segment_tenure(db.Model):
    __tablename__ = 'segment_tenure'
    id_tenure = db.Column(db.Integer, primary_key=True)
    seg_tenure = db.Column(db.String(100))
    
class Profiles(db.Model):
    __tablename__ = 'profiles'
    id_profile = db.Column(db.Integer, primary_key=True)
    tariff_profile = db.Column(db.String(100))

class ChrunTrend(db.Model):
    __tablename__ = 'churntrend'
    churn_date = db.Column(db.Date, nullable=False, primary_key=True)
    churnernumber = db.Column(db.Integer, nullable=False)
