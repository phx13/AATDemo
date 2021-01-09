import time
from sqlalchemy import Table, func

from commons.datamodelbase import initdb

dbsession, dbmodel, dbmetadata = initdb()


class Score(dbmodel):
    __tablename__ = 'score'
    __table__ = Table(__tablename__, dbmetadata, autoload=True)

    def searchavggroupbyemail(self, course, type):
        result = dbsession.query(func.avg(Score.score).label('avg'), Score.email, Score.type, Score.exam,
                                 Score.id).filter_by(course=course, type=type).group_by(Score.email).all()
        return result

    def searchavgdetailgroupbyemail(self, course, exam, type):
        result = dbsession.query(func.avg(Score.score).label('avg'), Score.email, Score.type, Score.exam,
                                 Score.id).filter_by(course=course, exam=exam, type=type).group_by(Score.email).all()
        return result

    def searchbycourse(self, course):
        result = dbsession.query(Score).filter_by(course=course).all()
        return result

    def searchbyemailandcourse(self, email, course):
        result = dbsession.query(Score).filter_by(email=email, course=course).all()
        return result

    def searchbydetail(self, email, course, exam):
        result = dbsession.query(Score).filter_by(email=email, course=course, exam=exam).all()
        return result

    def updatescore(self, email, course, exam, type, score):
        updatetime = time.strftime('%Y-%m-%d %H:%M:%S')
        score = Score(email=email, course=course, exam=exam, type=type, score=score, time=updatetime)
        dbsession.add(score)
        dbsession.commit()
        return score
