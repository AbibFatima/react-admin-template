#import os
import redis 
from datetime import timedelta

class ApplicationConfig:
    
    #SECRET_KEY = os.environ["SECRET_KEY"]
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = True
    SQLALCHEMY_DATABASE_URI = 'postgresql://postgres:admin@localhost:5432/DjezzyDB'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)  # Token d'accès expire dans 1 heure
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)  # Token de rafraîchissement expire dans 30 jours

    
    
    SESSION_TYPE = "redis"
    SESSION_PERMANENT = False
    SESSION_USE_SIGNER = True
    SESSION_REDIS = redis.from_url("redis://127.0.0.1:6379")