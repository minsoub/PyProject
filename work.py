#-*- coding:utf-8 -*-
####################################################################################################
# worker management module
# main.py => app access : current_app
from flask import Blueprint
from flask import session
from flask import render_template
from flask import request, Response, current_app
from lib.work_mng import WorkCls
from bson import json_util
import json, os

work = Blueprint('work', __name__)

# 작업자 등록 리스트를 조회해서 가져온다.
@work.route("/work/work_list", methods=['GET', 'POST'])
def work_list():
    if 'user_id' not in session:
        return render_template("admin/index.html")
    # JSON HTML file load
    try:
        APP_ROOT = os.path.dirname(os.path.abspath(__file__))  # refers to application_top
        APP_STATIC = os.path.join(APP_ROOT, 'templates', 'worker')

        print(os.path.join(APP_STATIC, 'workForm.json'));
        with open(os.path.join(APP_STATIC, 'workForm.json'), encoding='utf-8') as data_file:
             html_data = json.load(data_file)

    except Exception as e:
        print("error : ", str(e))

    worker = WorkCls(request, session)
    result = worker.getworklist(html_data['general']['collection'])
    resp = current_app.make_response(render_template('/worker/work_list.html', html_form=html_data, result=result))
    return resp

# 작업자 데이터를 등록한다.
@work.route("/work/work_save", methods=['GET', 'POST'])
def work_save():
    if 'user_id' not in session:   # 관리자 세션 체크
        result = {"error": "사용자 정보가 존재하지 않습니다!!"}
        print(result);
        result = json.dumps(result)
        return Response(result, mimetype='application/json')
    try:
        if request.method == 'POST':
            data = request.form['data']
            mode = request.form['mode']
            col  = request.form['collection_name']
        else:
            data = request.args.get('data')
            mode = request.args.get('mode')
            col  = request.args.get('collection_name')
    except KeyError:
        data = None
        mode = None
        col = None
        result = {"error": "파라미터 정보가 존재하지 않습니다!!!"}
        result = json.dumps(result)
        print(result)
        return Response(result, mimetype='application/json')

    print("save call", data)
    worker = WorkCls(request, session)
    result = worker.save_worker(data, mode, col)
    output_string = json_util.dumps(result)

    return Response(output_string, mimetype='application/json')

# 작업자 근태 현황 리스트를 출력한다.
@work.route("/work/work_reg_list", methods=['GET', 'POST'])
def work_reg_list():
    if 'user_id' not in session:
        return render_template("admin/index.html")
    # JSON HTML file load
    try:
        APP_ROOT = os.path.dirname(os.path.abspath(__file__))  # refers to application_top
        APP_STATIC = os.path.join(APP_ROOT, 'templates', 'worker')

        print(os.path.join(APP_STATIC, 'workForm.json'));
        with open(os.path.join(APP_STATIC, 'workForm.json'), encoding='utf-8') as data_file:
             html_data = json.load(data_file)

    except Exception as e:
        print("error : ", str(e))

    worker = WorkCls(request, session)
    worker_list = worker.getworklist(html_data['general']['collection'])   # 작업자 리스트

    # 근태현황 리스트

    resp = current_app.make_response(render_template('/worker/work_reg.html', html_form=html_data, worker_list=worker_list))
    return resp

# 작업자 근태현황 상세 현황을 조회한다
# dt : yyyy-mm 형식
@work.route("/work/worker_search", methods=['GET', 'POST'])
def worker_search():
    if 'user_id' not in session:   # 관리자 세션 체크
        result = {"error": "사용자 정보가 존재하지 않습니다!!"}
        print(result);
        result = json.dumps(result)
        return Response(result, mimetype='application/json')
    try:
        if request.method == 'POST':
            data = request.form['data']
            dt = request.form['dt']
        else:
            data = request.args.get('data')
            dt = request.args.get('dt')
    except KeyError:
        data = None
        dt = None
        result = {"error": "파라미터 정보가 존재하지 않습니다!!!"}
        result = json.dumps(result)
        print(result)
        return Response(result, mimetype='application/json')

    print("worker_search call", data)
    worker = WorkCls(request, session)
    result = worker.worker_search_list(data, dt)
    output_string = json_util.dumps(result)

    return Response(output_string, mimetype='application/json')

# 작업자 근태 현황 데이터를 등록한다.
@work.route("/work/worker_list_save", methods=['GET', 'POST'])
def worker_list_save():
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
    worker = WorkCls(request, session)
    result = worker.save_worker_list(data, mode)
    output_string = json_util.dumps(result)

    return Response(output_string, mimetype='application/json')