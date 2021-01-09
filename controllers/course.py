from flask import Blueprint, request, session, render_template, redirect, url_for, make_response, jsonify
from models.course import Course
from models.user import User
course = Blueprint('course', __name__)


@course.route('/course')
def coursepage():
    email = session['email']

    userinstance = User()
    currentaccount = userinstance.searchbyemail(email)

    courseinstance = Course()
    result = courseinstance.searchbyemail(email)
    courses = result[0].course.split(',')
    examdict = {}
    if len(courses) > 0:
        for courseid in courses:
            result = courseinstance.searchbycourseid(courseid)
            coursename = result[0].course
            exams = result[0].exam.split(',')
            examdict.update({courseid: [coursename, exams]})
    return render_template('course.html', currentaccount=currentaccount[0], courses=courses, examdict=examdict)


@course.route('/course/<courseid>/coursemanagement')
def coursemanagement(courseid):
    courseinstance = Course()
    result = courseinstance.searchall()
    data = []
    for item in result:
        dic = {}
        dic['id'] = item.id
        dic['email'] = item.email
        dic['course'] = item.course
        data.append(dic)
    if request.method == 'GET':
        info = request.values
        limit = info.get('limit', 10)
        offset = info.get('offset', 0)
    return jsonify({'total': len(data), 'rows': data[int(offset):(int(offset) + int(limit))]})


@course.route('/course/<courseid>/coursemanagementadddata', methods=['POST'])
def coursemanagementadddata(courseid):
    courseinstance = Course()
    email = request.form.get('email')
    courseid = request.form.get('course')
    courseinstance.adddata(email, courseid)
    return 'add success'


@course.route('/course/<courseid>/coursemanagementupdatedata', methods=['POST'])
def coursemanagementupdatedata(courseid):
    courseinstance = Course()
    for k, v in request.form.items():
        v = v.split('-')
        courseinstance.updatedata(k, v[0], v[1])
    return 'update success'


@course.route('/course/<courseid>/coursemanagementdeletedata', methods=['POST'])
def coursemanagementdeletedata(courseid):
    courseinstance = Course()
    for k, v in request.form.items():
        courseinstance.deletedata(k)
    return 'delete success'
