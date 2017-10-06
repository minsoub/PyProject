from datetime import datetime
import lib.libdb
import math
import pymongo
import json
from bson.objectid import ObjectId

class UserReg:
    def __init__(self, req, ses):
        self.req = req
        self.ses = ses

    # user register
    def user_register_save(self):
        dataList = {}  # 키 배열
        result = {}

        try:
            conn = lib.libdb.DbClass("", "")
            db = conn.getConn("commDB")
            member = conn.getCollection("member")

            userid = self.req.form['userid']  # 사용자 아이디
            name = self.req.form['name']  # 사용자명
            password = self.req.form['pass']  # 패스워드
            tel1 = self.req.form['tel1']
            tel2 = self.req.form['tel2']
            tel3 = self.req.form['tel3']
            dbname = self.req.form['dbname']

            dataList['userid'] = userid
            dataList['name'] = name
            dataList['pass'] = password
            dataList['tel1'] = tel1
            dataList['tel2'] = tel2
            dataList['tel3'] = tel3
            dataList['admin_chk'] = 'N'
            dataList['creatDt'] = datetime.now()
            dataList['lastModified'] = datetime.now()

            member.insert(dataList)
            msg = "등록을 완료하였습니다"
        except Exception as e:
            msg = "에러가 발생하였습니다 " + str(e)
            print(msg)
            result['mode'] = 'err'

        result['msg'] = msg

        print("result : ", result)
        return result