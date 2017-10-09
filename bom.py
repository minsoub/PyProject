####################################################################################################
# BOM management module
# main.py => app access : current_app
from flask import Blueprint, Flask
from flask import session
from flask import render_template
from flask import request, Response, current_app
import json
from bson import json_util
from lib.bom_mng import BomMngReg

bom = Blueprint('bom', __name__)

####################################################################################################
# bom management
# 부품 재고관리 출력
# item_mng URL이 호출되었을 때 페이지를 출력한다.
@bom.route("/bom/item_mng", methods=['GET', 'POST'])
def item_mng():
    if 'user_id' not in session:
        return render_template("admin/index.html")

    # bom = BomMngReg(request, session)
    # result = bom.get_item_data()
    resp = current_app.make_response(render_template('/bom/item_mng.html'))
    return resp

# 부품 재고관리 데이터를 조회한다.
@bom.route("/bom/item_getData", methods=['GET', 'POST'])
def item_getData():
    if 'user_id' not in session:  # 관리자 세션 체크
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
        result = {"error": "파라미터 정보가 존재하지 않습니다!!!"}
        result = json.dumps(result)
        print(result)
        return Response(result, mimetype='application/json')

    bom = BomMngReg(request, session)
    result = bom.bom_item_getdata(pro_id)
    if result is None:  # not data
       result = {'msg': ["None"]}
       output_string = json.dumps(result)
    else:
       output_string = json_util.dumps(result)
    print("result data : ", output_string)

    return Response(output_string, mimetype='application/json')

# 재고관리 정보를 저장/삭제를 수행한다.
@bom.route("/bom/bom_item_save", methods=['GET', 'POST'])
def bom_item_save():
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
    bom = BomMngReg(request, session)
    result = bom.save_items(data, mode)
    output_string = json_util.dumps(result)
    #print("result data1 : ", output_string)
    #output_string.rsplit(']', 1)
    #output_string.split('[', 1)
    #print("result data2 : ", output_string)

    return Response(output_string, mimetype='application/json')

# 입출고표 데이터를 처리하여 출력한다.
@bom.route("/bom/item_view")
def bom_item_view():
    if 'user_id' not in session:
        return render_template("admin/index.html")

    try:
        if request.method == 'POST':
            pro_id = request.form['pro_id']
        else:
            pro_id = request.args.get('pro_id')
    except KeyError:
        pro_id = None

    if pro_id is None:
        resp = current_app.make_response(render_template('/bom/item_view.html', result=''))
        return resp
    else:
        bomcls = BomMngReg(request, session)
        result = bomcls.bom_item_getdata(pro_id)
        output_string = json_util.dumps(result)

        resp = current_app.make_response(render_template('/bom/item_view.html', result=output_string))
        return resp

# test
@bom.route("/bom/bom_mng2")
def bom_mng_origin():
    reg = BomMngReg(request, session)
    # result = reg.user_register_save()
    resp = current_app.make_response(render_template('/bom/bom_mng_origin.html'))
    return resp



