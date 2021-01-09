import pymysql
from pymysql.cursors import DictCursor


class MysqlHelper:
    def __init__(self):
        conn = pymysql.connect(host='localhost', port=3306, user='root', passwd='phx25891863', charset='utf8', db='aat',
                               autocommit=True)
        self.cursor = conn.cursor(cursor=DictCursor)

    def mysqlselect(self, tablename, **condition):
        sql = 'select * from %s' % tablename
        if len(condition) > 0:
            sql += ' where'
            for k, v in condition.items():
                sql += " %s='%s' and" % (k, v)
            sql += ' 1=1'
        self.cursor.execute(sql)
        res = self.cursor.fetchall()
        return res

    def mysqlinsert(self, tablename, **keyvaluepair):
        keys = []
        values = []
        for k, v in keyvaluepair.items():
            keys.append(k)
            values.append(v)
        sql = "insert into %s(%s) values('%s')" % (tablename, ",".join(keys), "','".join(values))
        try:
            self.cursor.execute(sql)
        except:
            return 'error'

    def mysqldelete(self, tablename):
        sql = 'delete from %s' % tablename
        try:
            self.cursor.execute(sql)
        except:
            return 'error'

    def mysqlupdate(self, tablename, condition, **keyvaluepair):
        sql = 'update {} set'.format(tablename)
        if len(keyvaluepair) > 0:
            for k, v in keyvaluepair.items():
                sql += " %s='%s'," % (k, v)
        sql = sql[:len(sql) - 1]
        if len(condition) > 0:
            sql += ' where'
            for k, v in condition.items():
                sql += " %s='%s' and" % (k, v)
            sql += ' 1=1'
        try:
            self.cursor.execute(sql)
        except:
            return 'error'
