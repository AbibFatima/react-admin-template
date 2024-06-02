# create_roles.py
from app import Role, User, db

def create_roles():
    admin = Role(id=1, name='Admin')
    specialist = Role(id=2, name='Specialist')

    db.session.add(admin)
    db.session.add(specialist)

    db.session.commit()
    print("Roles created successfully!")

create_roles()
