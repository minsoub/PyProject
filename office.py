#-*- coding:utf-8 -*-
####################################################################################################
# company management module
# office.py => app access : current_app
from flask import Blueprint
from flask import session
from flask import render_template
from flask import request, Response, current_app
from lib.office_mng import OfficeCls
from bson import json_util
import json, os

office = Blueprint('office', __name__)

# 프로젝트 등록 리스트를 조회해서 가져온다.
@office.route("/office/project_list", methods=['GET', 'POST'])
def project_list():
    if 'user_id' not in session:
        return render_template("admin/index.html")

    office = OfficeCls(request, session)
    result = office.getprojectlist()
    resp = current_app.make_response(render_template('/company/project_list.html', result=result))
    return resp

# 프로젝트 데이터를 저장, 삭제를 수행한다.
@office.route("/office/project_save", methods=['GET', 'POST'])
def project_save():
    if 'user_id' not in session:   # 관리자 세션 체크
        result = {"error": "사용자 정보가 존재하지 않습니다!!"}
        print(result);
        result = json.dumps(result)
        return Response(result, mimetype='application/json')
    try:
        if request.method == 'POST':
            data = request.form['data']
            mode = request.form['mode']
        else:
            data = request.args.get('data')
            mode = request.args.get('mode')
    except KeyError:
        data = None
        mode = None
        result = {"error": "파라미터 정보가 존재하지 않습니다!!!"}
        result = json.dumps(result)
        print(result)
        return Response(result, mimetype='application/json')

    print("save call", data)
    office = OfficeCls(request, session)
    result = office.save_project(data, mode)
    output_string = json_util.dumps(result)

    return Response(output_string, mimetype='application/json')

@office.route("/office/project_json_list", methods=['GET', 'POST'])
def project_json_list():
    if 'user_id' not in session:   # 관리자 세션 체크
        result = {"error": "사용자 정보가 존재하지 않습니다!!"}
        print(result);
        result = json.dumps(result)
        return Response(result, mimetype='application/json')
    try:
        if request.method == 'POST':
            mode = request.form['mode']
        else:
            mode = request.args.get('mode')
    except KeyError:
        mode = None
        result = {"error": "파라미터 정보가 존재하지 않습니다!!!"}
        result = json.dumps(result)
        print(result)
        return Response(result, mimetype='application/json')


    office = OfficeCls(request, session)

    result = office.getprojectlistJson()

    return Response(result, mimetype='application/json')

