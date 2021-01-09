import hashlib
import base64

from flask import Blueprint, request, session, render_template, redirect, url_for, make_response

from commons.base64helper import ToBase64
from models.user import User
from models.course import Course
from models.score import Score

account = Blueprint('account', __name__)


@account.route('/account')
def accountpage():
    userinstance = User()
    email = session['email']
    currentaccount = userinstance.searchbyemail(email)

    courseinstance = Course()
    courses = courseinstance.searchbyemail(session['email'])[0].course.split(',')

    examdict = {}
    if len(courses) > 0:
        for courseid in courses:
            result = courseinstance.searchbycourseid(courseid)
            coursename = result[0].course
            exams = result[0].exam.split(',')
            examdict.update({courseid: [coursename, exams]})
    return render_template('account.html', currentaccount=currentaccount[0], courses=courses, examdict=examdict)


@account.route('/account/updateprofile', methods=['POST'])
def updateprofile():
    userinstance = User()
    imgavatar = request.form.get('imgAvatar')
    if imgavatar == '':
        image = userinstance.searchbyemail(session['email'])[0].image
    else:
        obj = ToBase64(path='./default.png', choice=2, pic=imgavatar)
        image = obj.run()
    nickname = request.form.get('nickname')
    password = request.form.get('password')
    if password == '':
        password = userinstance.searchbyemail(session['email'])[0].password
    else:
        password = hashlib.md5(password.encode()).hexdigest()
    profile = request.form.get('profile')

    userinstance.update(session['email'], image, nickname, password, profile)
    return 'update success'


@account.route('/account/<course>/getscorestat')
def getscorestat(course):
    scoreinstance = Score()
    scoredict = {}
    for k, v in request.args.items():
        if k == 'identity':
            if v == 'student':
                result = scoreinstance.searchbyemailandcourse(session['email'], course)
                for item in result:
                    id = item.id
                    exam = item.exam
                    type = item.type
                    score = item.score
                    time = item.time
                    scoredict.update({id: [exam, type, score, time]})
            elif v == 'staff':
                resultF = scoreinstance.searchavggroupbyemail(course, 'formative')
                for item in resultF:
                    id = item.id
                    exam = item.exam
                    type = item.type
                    score = item.avg
                    email = item.email
                    scoredict.update({id: [exam, type, score, email]})
                resultS = scoreinstance.searchavggroupbyemail(course, 'summative')
                for item in resultS:
                    id = item.id
                    exam = item.exam
                    type = item.type
                    score = item.avg
                    email = item.email
                    scoredict.update({id: [exam, type, score, email]})
    return scoredict


@account.route('/account/<course>/updatescorestat')
def updatescorestat(course):
    scoreinstance = Score()
    scoredict = {}
    if list(request.args.items())[0][1] == 'student':
        for k, v in request.args.items():
            if k == 'identity':
                continue
            else:
                result = scoreinstance.searchbydetail(session['email'], course, v)
                for item in result:
                    id = item.id
                    exam = item.exam
                    type = item.type
                    score = item.score
                    time = item.time
                    scoredict.update({id: [exam, type, score, time]})
    elif list(request.args.items())[0][1] == 'staff':
        for k, v in request.args.items():
            if k == 'identity':
                continue
            else:
                resultF = scoreinstance.searchavgdetailgroupbyemail(course, v, 'formative')
                for item in resultF:
                    id = item.id
                    exam = item.exam
                    type = item.type
                    score = item.avg
                    email = item.email
                    scoredict.update({id: [exam, type, score, email]})
                resultS = scoreinstance.searchavgdetailgroupbyemail(course, v, 'summative')
                for item in resultS:
                    id = item.id
                    exam = item.exam
                    type = item.type
                    score = item.avg
                    email = item.email
                    scoredict.update({id: [exam, type, score, email]})
    return scoredict
