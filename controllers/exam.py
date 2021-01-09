import random

from flask import Blueprint, request, session, render_template, redirect, url_for, make_response, jsonify
from models.exam import Exam
from models.score import Score
from commons.nlphelper import wordvectorcos

exam = Blueprint('exam', __name__)


@exam.route('/course/<course>/<examname>')
def exampage(course, examname):
    examinstance = Exam()
    result = examinstance.searchbyexamandtype(examname, 'formative')
    answers = []
    for assessmentF in result:
        answers.append(assessmentF.answer)

    assessmentsF = {}
    for assessmentF in result:
        correctanswer = assessmentF.answer
        currentanswers = answers.copy()
        currentanswers.remove(correctanswer)
        wronganswer = random.sample(currentanswers, 3)
        answer = wronganswer + [correctanswer]
        random.shuffle(answer)

        assessmentsF.update({str(assessmentF.id): (assessmentF.question, answer)})

    result = examinstance.searchbyexamandtype(examname, 'summative')
    assessmentsS = {}
    for assessmentS in result:
        assessmentsS.update({str(assessmentS.id): (assessmentS.question, assessmentS.answer)})

    assessmentsFdict = {}
    for k, v in request.args.items():
        if k == 'assessmentNumber':
            assessmentsFlist = random.sample(assessmentsF.keys(), int(v))
            for k in assessmentsFlist:
                assessmentsFdict.update({k: assessmentsF[k]})
    return render_template('exam.html', course=course, examname=examname, assessmentsF=assessmentsFdict,
                           assessmentsS=assessmentsS)


@exam.route('/course/<course>/<examname>/getformativeresult')
def getformativeresult(course, examname):
    examinstance = Exam()
    correctanswer = 0
    smilefeedback = 0
    mehfeedback = 0
    frownfeedback = 0
    for id, aandf in request.args.items():
        if id == 'total':
            total = int(aandf)
            continue
        result = examinstance.searchbyidandtype(examname, 'formative', id)
        AandF = aandf.split('-')
        a = str(AandF[0])
        f = str(AandF[1])
        if a == result[0].answer:
            correctanswer += 1
        if f.endswith('smile'):
            smilefeedback += 1
        elif f.endswith('meh'):
            mehfeedback += 1
        else:
            frownfeedback += 1

    score = round(correctanswer / total, 2) * 100

    scoreinstance = Score()
    scoreinstance.updatescore(session['email'], course, examname, 'formative', score)

    return {'correctanswer': correctanswer, 'smilefeedback': smilefeedback, 'mehfeedback': mehfeedback,
            'frownfeedback': frownfeedback}


@exam.route('/course/<course>/<examname>/getsummativeresult')
def getsummativeresult(course, examname):
    examinstance = Exam()
    response = {}
    for id, a in request.args.items():
        result = examinstance.searchbyidandtype(examname, 'summative', id)
        response = wordvectorcos(str(a).strip(), result[0].answer)
    score = response['res']
    scoreinstance = Score()
    scoreinstance.updatescore(session['email'], course, examname, 'summative', score)
    return response


@exam.route('/course/<course>/<examname>/exammanagement')
def exammanagement(course, examname):
    examinstance = Exam()
    result = examinstance.searchbyexam(examname)
    data = []
    for assessment in result:
        dic = {}
        dic['id'] = assessment.id
        dic['type'] = assessment.type
        dic['question'] = assessment.question
        dic['answer'] = assessment.answer
        data.append(dic)
    if request.method == 'GET':
        info = request.values
        limit = info.get('limit', 10)
        offset = info.get('offset', 0)
    return jsonify({'total': len(data), 'rows': data[int(offset):(int(offset) + int(limit))]})


@exam.route('/course/<course>/<examname>/exammanagementadddata', methods=['POST'])
def exammanagementadddata(course, examname):
    examinstance = Exam()
    type = request.form.get('type')
    question = request.form.get('question')
    answer = request.form.get('answer')
    examinstance.adddata(examname, type, question, answer)
    return 'add success'


@exam.route('/course/<course>/<examname>/exammanagementupdatedata', methods=['POST'])
def exammanagementupdatedata(course, examname):
    examinstance = Exam()
    for k, v in request.form.items():
        v = v.split('-')
        examinstance.updatedata(k, v[0], v[1], v[2])
    return 'update success'


@exam.route('/course/<course>/<examname>/exammanagementdeletedata', methods=['POST'])
def exammanagementdeletedata(course, examname):
    examinstance = Exam()
    for k, v in request.form.items():
        examinstance.deletedata(k)
    return 'delete success'
