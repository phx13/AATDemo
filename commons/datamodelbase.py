from sqlalchemy import MetaData


def initdb():
    from main import db
    dbsession = db.session
    dbmodel = db.Model
    dbmetadata = MetaData(bind=db.engine)
    return (dbsession, dbmodel, dbmetadata)
