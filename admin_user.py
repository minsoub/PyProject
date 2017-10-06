####################################################################################################
# admin management module
# main.py => app access : current_app
from flask import Blueprint, redirect, url_for
from flask import session
from flask import render_template
from flask import request, Response, current_app
import json
import comm.form_reg
from admin.user_mng import UserCls
from comm.builder_mng import BuilderFormCls

admin_user = Blueprint('admin_user', __name__)

##########################################################################################################
# 관리자 모드
@admin_user.route("/admin")
def admin():
    if request.cookies.get('user_id') == '':
        return render_template("admin/index.html")

    user_id = request.cookies.get('user_id')
    user_pass    = request.cookies.get('user_pass')
    re_save = request.cookies.get('re_save')

    if 'user_id' in session:
        print("here is called...")
        if session['admin_chk'] == '2':  #통합관리자
            resp = current_app.make_response(redirect(url_for('admin_user.user_list')))
        elif session['admin_chk'] == '1': #일반관리자
            conn_page = 'company_info'
            resp = current_app.make_response(redirect(url_for('admin_user.reg_list', conn_page=conn_page, page=1)))
    else:
        resp = current_app.make_response(render_template("admin/index.html", user_id=user_id, user_pass=user_pass, re_save=re_save))

    return resp
    # return render_template("admin/index.html")

@admin_user.route("/admin/admin_login", methods=['POST'])
def admin_login():
    user_id = request.form['id']
    user_pass = request.form['pass']
    re_save = request.form['re_save']

    # admin check
    import lib.LoginChk
    login = lib.LoginChk.LoginCheck(session)
    chk = login.admin_login_check(user_id, user_pass)

    print("chk : ", chk)
    if chk == True:
        print("session lastmodified : ", session['lastModified'])

        # reg_list.html 호출에 필요한 데이터 생성
        if re_save == 'Y':
            # cookies setup
            print(url_for('admin_user.reg_list'))
            #resp = make_response(render_template('admin/comm/reg_list.html', user_id=user_id, user_pass=user_pass, re_save=re_save))
            resp = current_app.make_response(redirect(url_for('admin_user.reg_list')))
            resp.set_cookie('user_id', user_id)
            resp.set_cookie('user_pass', user_pass)
            resp.set_cookie('re_save', re_save)
            print(user_id)
            return resp
        else:
            print(url_for('reg_list'))
            return redirect(url_for('reg_list'))
    else:
        return render_template(url_for('admin'))

@admin_user.route("/admin/admin_logout")
def admin_logout():
    session.pop('user_id', None)
    session.pop('user_pass', None)
    session.pop('re_save', None)
    return redirect(url_for('main'))

@admin_user.route("/admin/reg_list", methods=['POST', 'GET'])
def reg_list():
    # session check
    if 'user_id' in session:
        if request.method == 'POST':
            conn_page = request.form['conn_page']
            page      = request.form['page']
        else:
            conn_page = request.args.get('conn_page')
            page = request.args.get('page')

        db = comm.form_reg.FormReg(request, session)
        data = db.getFormData()
        print("result:", data['result'])
        print("session : ", session['admin_chk'])
        ss = data['result']
        content = ss['content']
        json_content = json.loads(content)  # content  # json.dumps(content)
        print("json_content : " , json_content)

        return render_template('/admin/comm/reg_list.html', result=data, conn_page=conn_page, page=page, json_content=json_content)
    else:
        return redirect('/admin')  #render_template(url_for('/admin'))

@admin_user.route("/admin/reg_edit", methods=['POST'])
def reg_edit():
    # session check
    print("reg_edit called...")
    if 'user_id' in session:
        print("formReg call")
        regcls = comm.form_reg.FormReg(request, session)
        data = regcls.getRegInfo()

        if data['id'] == '':
            return render_template('/admin/comm/reg.html', result=data)
        else:
            print("reg_edit result : ", data)
            json_data = json.loads(data['content'])
            print("reg_edit json_data : ", json_data)
            return render_template('/admin/comm/reg.html', result=data, json_data=json_data)
    else:
        print("reg_edit not loging called...")
        return redirect('/admin')

@admin_user.route("/admin/reg_write", methods=['POST'])
def reg_write():
    # session check
    print("reg_edit called...")
    if 'user_id' in session:
        print("formReg call")
        regcls = comm.form_reg.FormReg(request, session)
        data = regcls.getWriteInfo()

        print("reg_edit result : ", data)
        json_data = json.loads(data['content'])
        print("reg_edit json_data : ", json_data)
        return render_template('/admin/comm/reg.html', result=data, json_data=json_data)
    else:
        print("reg_edit not loging called...")
        return redirect('/admin')


@admin_user.route("/admin/reg_save", methods=['POST'])
def reg_save():
    if 'user_id' in session:
        print("reg_save...")
        regcls = comm.form_reg.FormReg(request, session)
        print("reg_save...1")
        sts = regcls.formRegister()
        print("reg_save...2")
        mode = request.form['mode']
        conn_page = request.form['conn_page']
        print("reg_save...3")
        print("reg_save : ", conn_page)
        if sts == True:
            if mode == 'upt':
                msg = "수정을 완료하였습니다!"
            elif mode == 'del':
                msg = "삭제를 완료하였습니다!"
            else:
                msg = "등록을 완료하였습니다!"

            id = request.form['mkey']
            _id = request.form['_id']
            resp = current_app.make_response(redirect(url_for('admin_user.reg_list', conn_page=conn_page, page=1, msg=msg)))
            return resp
        else:
            msg = "저장하는데 에러가 발생하였습니다!"
            resp = current_app.make_response(redirect(url_for('admin_user.reg_list', conn_page=conn_page, page=1, msg=msg)))
            return resp
    else:
        print("not login....")
        return redirect('/admin')

# User management
@admin_user.route("/admin/member/user_list", methods=['POST', 'GET'])
def user_list():
    # session check
    if 'user_id' in session:
        user = UserCls(request, session)
        data = user.get_user_list()

        return render_template('/admin/member/user_list.html', result=data)
    else:
        return redirect('/admin')

# User register
@admin_user.route("/admin/member/user_reg", methods=['POST', 'GET'])
def user_reg_form():
    # session check
    if 'user_id' in session:
        if request.method == 'POST':
            page = request.form['page']
            return render_template('/admin/member/user_register.html', page=page, mode='reg')
    else:
        print("user_reg_form not session")
        return redirect('/admin')

# User save
@admin_user.route("/admin/member/user_save", methods=['POST'])
def user_reg_save():
    ## session check
    print("session id : ", session['user_id'])
    print("session name : ", session['name'])
    print("admin_chk : ", session['admin_chk'])
    if session.get('user_id') is not None:
        user = UserCls(request, session)
        result = user.user_register_save()

        if (result['mode'] == 'inst' or result['mode'] == 'del'):
            # user_list
            resp = current_app.make_response(redirect(url_for('admin_user.user_list',  mode=result['mode'], msg=result['msg'], page=result['page'])))
            return resp
        else:
            # user_register
            return render_template('/admin/member/user_register.html', result=result['data'], page=result['page'], mode=result['mode'], msg=result['msg'])
    else:
        print("user_reg_save not session")
        return redirect('/admin')

# User detail
@admin_user.route("/admin/member/user_detail", methods=['POST'])
def user_detail_info():
    if session.get('user_id') is not None:
        user = UserCls(request, session)
        result = user.user_detail_info()
        return render_template('/admin/member/user_register.html', result=result['data'], page=result['page'], mode=result['mode'], msg=result['msg'], search_kind=result['search_kind'], word=result['word'])
    else:
        print("user_reg_save not session")
        return redirect('/admin')

# form builder
@admin_user.route("/admin/builder/form_builder_list", methods=['POST', 'GET'])
def form_builder_list():
    if session.get('user_id') is not None:
        cls = BuilderFormCls(request, session)
        result = cls.get_builder_form_list()
        return render_template('/admin/builder/form_builder_list.html', result=result)
    else:
        print("form_builder_list not session")
        return redirect('/admin')
@admin_user.route("/admin/builder/form_builder_create", methods=['POST', 'GET'])
def form_builder_create():
    if session.get('user_id') is not None:
        if request.method == 'POST':
            page = request.form['page']
        return render_template('/admin/builder/form_builder_create.html', page=page, mode='reg')
    else:
        print("form_builder_list not session")
        return redirect('/admin')

@admin_user.route("/admin/builder/form_builder_detail", methods=['POST'])
def form_builder_detail():
    if session.get('user_id') is not None:
        cls = BuilderFormCls(request, session)
        result = cls.get_builder_form_data()
        return render_template('/admin/builder/form_builder_create.html', result=result['data'], page=result['page'],
                                  mode=result['mode'], msg=result['msg'], search_kind=result['search_kind'],
                                   word=result['word'])
    else:
        print("user_reg_save not session")
        return redirect('/admin')

@admin_user.route("/admin/builder/form_builder_save", methods=['POST'])
def form_builder_save():
    if session.get('user_id') is not None:
        cls = BuilderFormCls(request, session)
        result = cls.form_builder_save()
        print("mode : ", result['mode'])
        if (result['mode'] == 'inst' or result['mode'] == 'del'):
            # user_list
            resp = current_app.make_response(
            redirect(url_for('admin_user.form_builder_list', mode=result['mode'], msg=result['msg'], page=result['page'])))
            return resp
        else:
            # user_register
            return render_template('/admin/builder/form_builder_create.html', result=result['data'], page=result['page'],
                                       mode=result['mode'], msg=result['msg'])
    else:
        print("form_builder_save not session")
        return redirect('/admin')

@admin_user.route("/admin/builder/form_builder_preview", methods=['POST'])
def form_builder_preview():
    if session.get('user_id') is not None:
        content = request.form['content']
        #print("content : ", content)
        json_content = content # json.dumps(content)
        return render_template('/admin/builder/form_builder_preview.html', result=json_content)
    else:
        return

# rest api
@admin_user.route("/rest/getUser/<string:userid>", methods=['GET'])
def getuser(userid):
    if 'user_id' in session:   # 관리자 세션 체크
        user = UserCls(request, session)
        data = user.get_user_exists_check(userid)
        return Response(data, mimetype='application/json')
    else:
        customer = {"success": False}
        string_data = json.dumps(customer)
        print(string_data)
        return Response(string_data,  mimetype='application/json')

@admin_user.route("/rest/getUserDB/<string:dbname>", methods=['GET'])
def get_user_db(dbname):
    if 'user_id' in session:   # 관리자 세션 체크
        user = UserCls(request, session)
        data = user.get_user_db_exists_check(dbname)
        return Response(data, mimetype='application/json')
    else:
        customer = {"success": False}
        string_data = json.dumps(customer)
        print(string_data)
        return Response(string_data,  mimetype='application/json')

