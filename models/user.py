import time

from sqlalchemy import Table

from commons.datamodelbase import initdb

dbsession, dbmodel, dbmetadata = initdb()


class User(dbmodel):
    __tablename__ = 'user'
    __table__ = Table(__tablename__, dbmetadata, autoload=True)

    def searchbyemail(self, email):
        result = dbsession.query(User).filter_by(email=email).all()
        return result

    def register(self, email, password, identity, nickname, image, profile):
        registertime = time.strftime('%Y-%m-%d %H:%M:%S')
        user = User(email=email, password=password, identity=identity, nickname=nickname, image=image, profile=profile,
                    time=registertime)
        dbsession.add(user)
        dbsession.commit()
        return user

    def update(self, email, imgavatar, nickname, password, profile):
        updatetime = time.strftime('%Y-%m-%d %H:%M:%S')
        result = dbsession.query(User).filter_by(email=email).update(
            {'image': imgavatar, 'nickname': nickname, 'password': password, 'profile': profile, 'time': updatetime})
        dbsession.commit()
        return result
