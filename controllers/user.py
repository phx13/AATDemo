import hashlib
import re
from models.user import User
from models.course import Course
from flask import Blueprint, request, session, render_template, redirect, url_for, make_response

user = Blueprint('user', __name__)


@user.route('/login', methods=['POST'])
def login():
    userinstance = User()
    email = request.form.get('email')
    password = request.form.get('password')
    password = hashlib.md5(password.encode()).hexdigest()
    result = userinstance.searchbyemail(email)
    if len(result) == 1 and result[0].password == password:
        session['login'] = 'true'
        session['email'] = result[0].email
        session['identity'] = result[0].identity
        session['nickname'] = result[0].nickname

        response = make_response('login success')
        response.set_cookie('email', email, max_age=10 * 24 * 3600)
        response.set_cookie('password', password, max_age=10 * 24 * 3600)
        return response
    else:
        return 'login fail'


@user.route('/register', methods=['POST'])
def register():
    userinstance = User()
    email = request.form.get('email')
    password = request.form.get('password')
    identity = request.form.get('identity')

    if len(userinstance.searchbyemail(email)) > 0:
        return 'register fail'
    elif not re.match('.+@.+\..+', email) or password == '':
        return 'register fail'
    else:
        password = hashlib.md5(password.encode()).hexdigest()
        nickname = email.split('@')[0]
        image = '/images/Logo.jpg'
        profile = 'Hello, this is ' + nickname
        result = userinstance.register(email, password, identity, nickname, image, profile)

        courseinstance = Course()
        course = 'CMT313'
        courseinstance.addcourse(email, course)

        session['login'] = 'true'
        session['email'] = result.email
        session['identity'] = result.identity
        session['nickname'] = nickname
        return 'register success'


@user.route('/logout')
def logout():
    session.clear()
    response = make_response('logout', 302)
    response.headers['Location'] = url_for('index.indexpage')
    response.delete_cookie('email')
    response.delete_cookie('password')
    return response
