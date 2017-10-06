#-*- coding:utf-8 -*-
####################################################################################################
# admin management module
# main.py => app access : current_app
from flask import Blueprint
from flask import session
from flask import render_template
from flask import request, current_app
from lib.user_reg import UserReg

job = Blueprint('main', __name__)

@job.route("/")
@job.route("/main")
def main():
    return render_template("index.html")

@job.route("/sign_in")
def sign_in():
    return render_template("admin/index.html")

@job.route("/sign_out")
def sign_out():
    import lib.LoginChk
    login = lib.LoginChk.LoginCheck(session)
    login.logout()

    message = 'You were logged out'
    resp = current_app.make_response(render_template('/index.html', message=message))
    # resp.set_cookie('token', expires=0)
    return resp

@job.route("/member/member_register")
def member_register():
    return render_template('/member/member_register.html')

@job.route("/member/member_register_save")
def member_register_save():
    reg = UserReg(request, session)
    result = reg.user_register_save()
    resp = current_app.make_response(render_template('/member/member_register.html', message=result['msg']))
    return resp


