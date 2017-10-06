#-*- coding:utf-8 -*-
from datetime import datetime
import lib.libdb
import math
import pymongo
import json
from bson.objectid import ObjectId

class UserCls:
    def __init__(self, req, ses):
        self.req = req
        self.ses = ses

    def get_user_list(self) -> object:
        msg = ''
        mode = ''
        if self.req.method == 'GET':
            search_kind = ''
            word = ''
            try:
                msg = self.req.args.get('msg')
                mode = self.req.args.get('mode')
                page = self.req.args.get('page')
            except Exception as e:
                msg = str(e)
        else:
            search_kind = self.req.form['search_kind']
            word = self.req.form['word']
            page = self.req.form['page']

        if page is None or page == '':
            page = 1

        list_page = (int(page) - 1) * 10
        conn = lib.libdb.DbClass("", "")
        db = conn.getConn("commDB")
        col = conn.getCollection("member")
        # {"$regex": u"9"}
        if search_kind == '' or search_kind == 'None':
            total = col.find().count()
        else:
            total = col.find({search_kind: {"$regex": word}}).count()
        page_num = math.ceil(total / 10)

        if search_kind == '' or search_kind == 'None':
            data = col.find().sort('lastModified', pymongo.DESCENDING).limit(10).skip(list_page)
        else:
            data = col.find({search_kind: {"$regex": word}}).sort('lastModified', pymongo.DESCENDING).limit(10).skip(list_page)

        result = {}
        result['data'] = data
        result['search_kind'] = search_kind
        result['word'] = word
        result['msg'] = msg
        result['mode'] = mode
        result['page'] = page
        result['total'] = total
        result['list_page'] = list_page
        result['page_num'] = page_num

        print("result msg : ", msg, ", result mode : ", mode, ", result page : ", page)
        return result

    # 사용자 정보 상세 조회
    def user_detail_info(self):
        result = {}
        msg = ''
        try:
            print("user_detail_info called")
            id = self.req.form['id']
            search_kind = self.req.form['search_kind']
            print("1")
            word = self.req.form['word']
            print("2")
            page = self.req.form['page']
            print("key : ", id)
            conn = lib.libdb.DbClass("", "")
            db = conn.getConn("commDB")
            col = conn.getCollection("member")
            data = col.find_one({'userid': id})

            print(data)

            result['data'] = data
            result['page'] = page
            result['search_kind'] = search_kind
            result['word'] = word
            result['mode'] = 'upt'

        except Exception as e:
            print("error : ", str(e))
            msg = "에러가 발생하였습니다 ['" + str(e) + "']"

        result['msg'] = msg
        return result

    # 사용자 아이디 중복 체크
    # 체크 후 JSON 포멧으로 리턴한다.
    # {'success' : true | false}
    def get_user_exists_check(self, userid):
        conn = lib.libdb.DbClass("", "")
        db = conn.getConn("commDB")
        col = conn.getCollection("member")
        data = col.find_one({'userid': userid})
        if data is not None:
            result = {"success": True}
        else:
            result = {"success": False}

        print(result)
        return json.dumps(result)

    # 사용자 DB 중복 체크
    # 체크 후 JSON 포멧으로 리턴한다.
    # {'success' : true | false}
    def get_user_db_exists_check(self, dbname):
        conn = lib.libdb.DbClass("", "")
        db = conn.getConn("commDB")
        col = conn.getCollection("member")
        data = col.find_one({'dbname': dbname})
        if data is not None:
            result = {"success": True}
        else:
            result = {"success": False}

        print(result)
        return json.dumps(result)


    # 사용자 정보 등록, 수정, 삭제
    def user_register_save(self):
        dataList = {}  # 키 배열
        result = {}

        try:
            conn = lib.libdb.DbClass("", "")
            db = conn.getConn("commDB")
            member = conn.getCollection("member")
            page = self.req.form['page']

            print("page : " , page)
            if self.req.form['mode'] == 'inst' or self.req.form['mode'] == 'upst':
                userid = self.req.form['userid']        # 사용자 아이디
                name = self.req.form['name']            # 사용자명
                password = self.req.form['pass']            # 패스워드
                tel1 = self.req.form['tel1']
                tel2 = self.req.form['tel2']
                tel3 = self.req.form['tel3']
                dbname = self.req.form['dbname']
                admin_chk = self.req.form['admin_chk']
                id = self.req.form['m_key']

                if self.req.form['mode'] == 'inst':     # insert
                    dataList['userid'] = userid
                    dataList['name'] = name
                    dataList['pass'] = password
                    dataList['tel1'] = tel1
                    dataList['tel2'] = tel2
                    dataList['tel3'] = tel3
                    dataList['dbname'] = dbname
                    dataList['admin_chk'] = admin_chk
                    dataList['creatDt'] = datetime.now()
                    dataList['lastModified'] = datetime.now()

                    member.insert(dataList)
                    msg = "등록을 완료하였습니다"
                else:                                   # update
                    dataList['name'] = name
                    dataList['pass'] = password
                    dataList['tel1'] = tel1
                    dataList['tel2'] = tel2
                    dataList['tel3'] = tel3
                    dataList['dbname'] = dbname
                    dataList['admin_chk'] = admin_chk
                    dataList['lastModified'] = datetime.now()

                    member.update({'_id': ObjectId(id)}, {'$set': dataList}, upsert=False)
                    msg = "수정을 완료하였습니다"

                    # data search
                    data = member.find_one({'userid': id})
                    result['data'] = data
                conn.Close()
            elif self.req.form['mode'] == 'del':
                id = self.req.form['m_key']
                data = member.find_one({'userid': id})
                dbname = data['dbname']
                member.delete_many({'userid': id})
                conn.Close()

                # DB 삭제
                print("delete database : ", dbname)
                conn = lib.libdb.DbClass("", "")
                db = conn.getConn(dbname)
                db.command("dropDatabase")

                msg = "삭제를 완료하였씁니다"
        except Exception as e:
            msg = "에러가 발생하였습니다 " + str(e)
            print(msg)
            result['mode'] = 'err'

        result['msg'] = msg
        result['mode'] = self.req.form['mode']
        result['page'] = page

        print("result : ", result)
        return result
