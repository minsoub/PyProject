#-*- coding:utf-8 -*-
from flask import Flask, session, redirect, url_for
from flask import render_template
from flask import request
from flask import make_response

from pymongo import MongoClient
import json
from bson import json_util
from bson.json_util import dumps
import comm.form_reg
from admin.user_mng import UserCls



app = Flask(__name__)

@app.route("/")
@app.route("/main")
def main():
    return render_template("index.html")

@app.route("/admin")
def admin():
    if request.cookies.get('user_id') == '':
        return render_template("admin/index.html")

    user_id = request.cookies.get('user_id')
    user_pass    = request.cookies.get('user_pass')
    re_save = request.cookies.get('re_save')

    resp = make_response(render_template("admin/index.html", user_id=user_id, user_pass=user_pass, re_save=re_save))

    return resp
    # return render_template("admin/index.html")

@app.route("/admin/admin_login", methods=['POST'])
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
            print(url_for('reg_list'))
            #resp = make_response(render_template('admin/comm/reg_list.html', user_id=user_id, user_pass=user_pass, re_save=re_save))
            resp = make_response(redirect(url_for('reg_list')))
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

@app.route("/admin/admin_logout")
def admin_logout():
    session.pop('user_id', None)
    session.pop('user_pass', None)
    session.pop('re_save', None)
    return redirect(url_for('main'))

@app.route("/admin/reg_list", methods=['POST', 'GET'])
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
        json_content = json.loads(content)
        print("json_content : " , json_content)

        return render_template('/admin/comm/reg_list.html', result=data, conn_page=conn_page, page=page, json_content=json_content)
    else:
        return redirect('/admin')  #render_template(url_for('/admin'))

@app.route("/admin/reg_edit", methods=['POST'])
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

@app.route("/admin/reg_write", methods=['POST'])
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


@app.route("/admin/reg_save", methods=['POST'])
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
            resp = make_response(redirect(url_for('reg_list', conn_page=conn_page, page=1, msg=msg)))
            return resp
        else:
            msg = "저장하는데 에러가 발생하였습니다!"
            resp = make_response(redirect(url_for('reg_list', conn_page=conn_page, page=1, msg=msg)))
            return resp
    else:
        print("not login....")
        return redirect('/admin')

# User management
@app.route("/admin/member/user_list", methods=['POST', 'GET'])
def user_list():
    # session check
    if 'user_id' in session:

        #if request.method == 'POST':
        #    conn_page = request.form['conn_page']
        #    page      = request.form['page']
        #else:
        #    conn_page = request.args.get('conn_page')
        #    page = request.args.get('page')

        user = UserCls(request, session)
        data = user.getuserlist()

        return render_template('/admin/member/user_list.html', result=data)
    else:
        return redirect('/admin')

if __name__ == "__main__":
    # set the secret key.  keep this really secret:
    app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'
    app.run(host='0.0.0.0', port=8000, debug=True)

