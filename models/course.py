from sqlalchemy import Table
import time
from commons.datamodelbase import initdb

dbsession, dbmodel, dbmetadata = initdb()


class Course(dbmodel):
    __tablename__ = 'course'
    __table__ = Table(__tablename__, dbmetadata, autoload=True)

    def searchall(self):
        result = dbsession.query(Course).all()
        return result

    def searchbyemail(self, email):
        result = dbsession.query(Course).filter_by(email=email).all()
        return result

    def searchbycourseid(self, courseid):
        result = dbsession.query(Coursedict).filter_by(courseid=courseid).all()
        return result

    def addcourse(self, email, course):
        addtime = time.strftime('%Y-%m-%d %H:%M:%S')
        course = Course(email=email, course=course, time=addtime)
        dbsession.add(course)
        dbsession.commit()
        return course

    def adddata(self, email, course):
        addtime = time.strftime('%Y-%m-%d %H:%M:%S')
        course = Course(email=email, course=course, time=addtime)
        dbsession.add(course)
        dbsession.commit()
        return course

    def updatedata(self, id, email, course):
        updatetime = time.strftime('%Y-%m-%d %H:%M:%S')
        result = dbsession.query(Course).filter_by(id=id).update({'email': email, 'course': course, 'time': updatetime})
        dbsession.commit()
        return result

    def deletedata(self, id):
        result = dbsession.query(Course).filter_by(id=id).delete()
        dbsession.commit()
        return result


class Coursedict(dbmodel):
    __tablename__ = 'coursedict'
    __table__ = Table(__tablename__, dbmetadata, autoload=True)
