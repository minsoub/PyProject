####################################################################################################
# Process management module
# main.py => app access : current_app
from flask import Blueprint, Flask
from flask import session
from flask import render_template
from flask import request, Response, current_app
import json
from bson import json_util
from lib.bom_mng import BomMngReg

process = Blueprint('process', __name__)

##########################################################################################################
# process 관리
@process.route("/process/process_select", methods=['GET', 'POST'])
def process_select():
    if 'user_id' not in session:
        return render_template("admin/index.html")
    # 프로젝트 아이디 체크 - 없으면 프로젝트 선택 페이지로 이동 시켜야 한다.
    try:
       if request.method == 'POST':
          pro_id = request.form['pro_id']
       else:
          pro_id = request.args.get('pro_id')
    except KeyError:
       pro_id = None

    if pro_id is None or pro_id == '':
       bom = BomMngReg(request, session)
       pro_lst = bom.get_project_list()
       resp = current_app.make_response(render_template("/process/project_selection.html", data=pro_lst))
       return resp
    else:
       bom = BomMngReg(request, session)
       bom.set_pro_id(pro_id)
       name = bom.get_project_name()
       result = bom.get_bom_detail_data()
       resp = current_app.make_response(render_template('/process/process_mng.html', data=result, pro_id=pro_id, pro_name=name))
       return resp


@process.route("/process/process_getData", methods=['GET', 'POST'])
def process_getData():
   if 'user_id' not in session:  # 관리자 세션 체크
       result = {'msg': ["None"]}
       print(result);
       result = json.dumps(result)
       return Response(result, mimetype='application/json')
   try:
       if request.method == 'POST':
          pro_id = request.form['pro_id']
          bom_id = request.form['bom_id']
       else:
          pro_id = request.args.get('pro_id')
          bom_id = request.args.get('bom_id')
   except KeyError:
       pro_id = None
       bom_id = None
       result = {'msg': ["None"]}
       result = json.dumps(result)
       print(result)
       return Response(result, mimetype='application/json')

   bom = BomMngReg(request, session)
   result = bom.bom_process_getdata(pro_id, bom_id)
   if result is None:  # not data
      result = {'msg': ["None"]}
      output_string = json.dumps(result)
   else:
      output_string = json_util.dumps(result)
   print("result data : ", output_string)

   return Response(output_string, mimetype='application/json')

# 부품 그룹 데이터를 조회해서 JSON  데이터로 출력한다.
@process.route("/process/process_group_getdata", methods=['GET', 'POST'])
def process_group_getdata():
    if 'user_id' not in session:   # 관리자 세션 체크
        result = {'msg': ["None"]}
        print(result);
        result = json.dumps(result)
        return Response(result, mimetype='application/json')
    try:
        if request.method == 'POST':
            pro_id = request.form['pro_id']
        else:
            pro_id = request.args.get('pro_id')
    except KeyError:
        pro_id = None
        result = {'msg': ["None"]}
        result = json.dumps(result)
        print(result)
        return Response(result, mimetype='application/json')

    bom = BomMngReg(request, session)
    result = bom.process_group_getdata(pro_id)
    if result is None:      # not data
        result = {'msg': ["None"]}
        output_string = json.dumps(result)
    else:
        output_string = json_util.dumps(result)
    print("result data : ", output_string)

    return Response(output_string, mimetype='application/json')

# 부픔 그룹 데이터를 JSON 데이터로 출력한다.
@process.route("/process/process_group", methods=['GET', 'POST'])
def process_group():
    if 'user_id' not in session:
        return render_template("admin/index.html")

    # 프로젝트 아이디 체크 - 없으면 프로젝트 선택 페이지로 이동 시켜야 한다.
    try:
        if request.method == 'POST':
            pro_id = request.form['pro_id']
        else:
            pro_id = request.args.get('pro_id')
    except KeyError:
        pro_id = None

    if pro_id is None or pro_id == '':
        bom = BomMngReg(request, session)
        pro_lst = bom.get_project_list()
        resp = current_app.make_response(render_template("/process/project_selection.html", data=pro_lst))
        return resp
    else:
        bom = BomMngReg(request, session)
        bom.set_pro_id(pro_id)
        name = bom.get_project_name()
        result = bom.get_bom_detail_data()
        resp = current_app.make_response(render_template('/process/process_mng.html', data=result, pro_id=pro_id, pro_name=name))
        return resp

@process.route("/process/process_partsGroups_save", methods=['GET', 'POST'])
def process_partsGroups_save():
    if 'user_id' not in session:  # 관리자 세션 체크
        result = {"error": "사용자 정보가 존재하지 않습니다!!"}
        print(result);
        result = json.dumps(result)
        return Response(result, mimetype='application/json')
    try:
        if request.method == 'POST':
           pro_id = request.form['pro_id']
           data = request.form['data']
        else:
           pro_id = request.args.get('pro_id')
           data = request.args.get('data')
    except KeyError:
        pro_id = None
        data = None
        result = {"error": "파라미터 정보가 존재하지 않습니다!!!"}
        result = json.dumps(result)
        print(result)
        return Response(result, mimetype='application/json')

    print("save call", data)
    bom = BomMngReg(request, session)
    result = bom.save_group_parts(data, pro_id)
    output_string = json_util.dumps(result)
    print("result data1 : ", output_string)
    output_string.rsplit(']', 1)
    output_string.split('[', 1)
    print("result data2 : ", output_string)
    return Response(output_string, mimetype='application/json')

@process.route("/process/process_partsGroups_delete", methods=['GET', 'POST'])
def process_partsGroups_delete():
    if 'user_id' not in session:  # 관리자 세션 체크
        result = {"error": "사용자 정보가 존재하지 않습니다!!"}
        print(result);
        result = json.dumps(result)
        return Response(result, mimetype='application/json')
    try:
        if request.method == 'POST':
           pro_id = request.form['pro_id']
           data = request.form['data']
        else:
           pro_id = request.args.get('pro_id')
           data = request.args.get('data')
    except KeyError:
        pro_id = None
        data = None
        result = {"error": "파라미터 정보가 존재하지 않습니다!!!"}
        result = json.dumps(result)
        print(result)
        return Response(result, mimetype='application/json')

    print("save call", data)
    bom = BomMngReg(request, session)
    result = bom.delete_group_parts(data, pro_id)
    output_string = json_util.dumps(result)

    return Response(output_string, mimetype='application/json')

# 공정관리 페이지를 출력한다.
@process.route("/process/process_mng", methods=['GET', 'POST'])
def process_mng():
    if 'user_id' not in session:
        return render_template("admin/index.html")

    # 프로젝트 아이디 체크 - 없으면 프로젝트 선택 페이지로 이동 시켜야 한다.
    try:
       if request.method == 'POST':
          pro_id = request.form['pro_id']
       else:
          pro_id = request.args.get('pro_id')
    except KeyError:
       pro_id = None

    if pro_id is None or pro_id == '':
       bom = BomMngReg(request, session)
       pro_lst = bom.get_project_list()
       resp = current_app.make_response(render_template("/process/project_selection.html", data=pro_lst))
       return resp
    else:
       bom = BomMngReg(request, session)
       bom.set_pro_id(pro_id)
       name = bom.get_project_name()
       result = bom.get_bom_detail_data()
       resp = current_app.make_response(render_template('/process/process_ing.html', data=result, pro_id=pro_id, pro_name=name))
       return resp

# 공정관리 정보를 저장/삭제를 수행한다.
@process.route("/process/process_save", methods=['GET', 'POST'])
def process_save():
    if 'user_id' not in session:  # 관리자 세션 체크
        result = {"error": "사용자 정보가 존재하지 않습니다!!"}
        print(result);
        result = json.dumps(result)
        return Response(result, mimetype='application/json')
    try:
        if request.method == 'POST':
            data = request.form['data']
        else:
            data = request.args.get('data')
    except KeyError:
        data = None
        result = {"error": "파라미터 정보가 존재하지 않습니다!!!"}
        result = json.dumps(result)
        print(result)
        return Response(result, mimetype='application/json')

    print("save call", data)
    bom = BomMngReg(request, session)
    result = bom.save_process(data)
    output_string = json_util.dumps(result)
    print("result data1 : ", output_string)
    output_string.rsplit(']', 1)
    output_string.split('[', 1)
    print("result data2 : ", output_string)
    return Response(output_string, mimetype='application/json')

# 공정관리 데이터를 삭제한다.
@process.route("/process/process_delete", methods=['GET', 'POST'])
def process_delete():
    if 'user_id' not in session:  # 관리자 세션 체크
        result = {"error": "사용자 정보가 존재하지 않습니다!!"}
        print(result);
        result = json.dumps(result)
        return Response(result, mimetype='application/json')
    try:
        if request.method == 'POST':
            data = request.form['data']
        else:
            data = request.args.get('data')
    except KeyError:
        data = None
        result = {"error": "파라미터 정보가 존재하지 않습니다!!!"}
        result = json.dumps(result)
        print(result)
        return Response(result, mimetype='application/json')

    print("save call", data)
    bom = BomMngReg(request, session)
    result = bom.delete_process(data)
    output_string = json_util.dumps(result)

    return Response(output_string, mimetype='application/json')

# Gantt Chart 출력 페이지
@process.route("/process/gantt_chart", methods=['GET', 'POST'])
def gantt_chart():
    if 'user_id' not in session:
        return render_template("admin/index.html")
    # 프로젝트 아이디 체크 - 없으면 프로젝트 선택 페이지로 이동 시켜야 한다.
    try:
       if request.method == 'POST':
          pro_id = request.form['pro_id']
       else:
          pro_id = request.args.get('pro_id')
    except KeyError:
       pro_id = None

    if pro_id is None or pro_id == '':
       bom = BomMngReg(request, session)
       pro_lst = bom.get_project_list()
       resp = current_app.make_response(render_template("/process/project_selection.html", data=pro_lst))
       return resp
    else:
        bom = BomMngReg(request, session)
        bom.set_pro_id(pro_id)
        name = bom.get_project_name()
        # get bom_id
        bomData = bom.process_group_getdata(pro_id)

        if bomData.count() > 0:
            #output = json_util.dumps(bomData)
            for cursor in bomData:
                doc = dict(cursor)
                bom_id = str(doc['_id'])

        resp = current_app.make_response(render_template("/process/gantt_chart.html",  pro_id=pro_id, bom_id=bom_id, pro_name=name))
        return resp

# Gantt Chart 출력 페이지
@process.route("/process/gantt_chart2", methods=['GET', 'POST'])
def gantt_chart2():
    if 'user_id' not in session:
        return render_template("admin/index.html")
    # 프로젝트 아이디 체크 - 없으면 프로젝트 선택 페이지로 이동 시켜야 한다.
    try:
       if request.method == 'POST':
          pro_id = request.form['pro_id']
       else:
          pro_id = request.args.get('pro_id')
    except KeyError:
       pro_id = None

    if pro_id is None or pro_id == '':
       bom = BomMngReg(request, session)
       pro_lst = bom.get_project_list()
       resp = current_app.make_response(render_template("/process/project_selection.html", data=pro_lst))
       return resp
    else:
        bom = BomMngReg(request, session)
        bom.set_pro_id(pro_id)
        name = bom.get_project_name()
        # get bom_id
        bomData = bom.process_group_getdata(pro_id)

        if bomData.count() > 0:
            #output = json_util.dumps(bomData)
            for cursor in bomData:
                doc = dict(cursor)
                bom_id = str(doc['_id'])

        resp = current_app.make_response(render_template("/process/gantt_chart2.html",  pro_id=pro_id, bom_id=bom_id, pro_name=name))
        return resp




