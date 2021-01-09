import os

from flask import Flask, render_template, globals
from flask_sqlalchemy import SQLAlchemy
import pymysql

pymysql.install_as_MySQLdb()

app = Flask(__name__, template_folder='views', static_url_path='/', static_folder='recourses')
app.config['SECRET_KEY'] = os.urandom(24)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:phx25891863@localhost:3306/aat?charset=utf8'
app.config['SQLALCHEMY_POOL_SIZE'] = 1000
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


@app.errorhandler(404)
def error404(e):
    return render_template('error404.html')


@app.errorhandler(500)
def error500(e):
    return render_template('error500.html')


@app.before_request
def beforerequest():
    url = request.path
    passurls = ['/login', '/register', '/logout']
    if url in passurls or url.endswith('.js') or url.endswith('.jpg'):
        pass
    elif session.get('login') is None:
        user = User()
        email = request.cookies.get('email')
        password = request.cookies.get('password')
        if email is not None and password is not None:
            result = user.searchbyemail(email)
            session['login'] = 'true'
            session['email'] = result[0].email
            session['nickname'] = result[0].nickname


if __name__ == '__main__':
    from controllers.index import *
    from controllers.user import *
    from controllers.course import *
    from controllers.exam import *
    from controllers.account import *

    app.register_blueprint(index)
    app.register_blueprint(user)
    app.register_blueprint(course)
    app.register_blueprint(exam)
    app.register_blueprint(account)
    app.run(debug=True)
