from sqlalchemy import Table
import time
from commons.datamodelbase import initdb

dbsession, dbmodel, dbmetadata = initdb()


class Exam(dbmodel):
    __tablename__ = 'exam'
    __table__ = Table(__tablename__, dbmetadata, autoload=True)

    def searchbyexam(self, exam):
        result = dbsession.query(Exam).filter_by(exam=exam).all()
        return result

    def searchbyexamandtype(self, exam, type):
        result = dbsession.query(Exam).filter_by(exam=exam, type=type).all()
        return result

    def searchbyidandtype(self, exam, type, id):
        result = dbsession.query(Exam).filter_by(exam=exam, type=type, id=id).all()
        return result

    def adddata(self, exam, type, question, answer):
        addtime = time.strftime('%Y-%m-%d %H:%M:%S')
        exam = Exam(exam=exam, type=type, question=question, answer=answer, time=addtime)
        dbsession.add(exam)
        dbsession.commit()
        return exam

    def updatedata(self, id, type, question, answer):
        updatetime = time.strftime('%Y-%m-%d %H:%M:%S')
        result = dbsession.query(Exam).filter_by(id=id).update(
            {'type': type, 'question': question, 'answer': answer, 'time': updatetime})
        dbsession.commit()
        return result

    def deletedata(self, id):
        result = dbsession.query(Exam).filter_by(id=id).delete()
        dbsession.commit()
        return result
