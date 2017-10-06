#-*- coding:utf-8 -*-
from datetime import datetime
from lib.libdb import DbClass
import math
import pymongo
import json
from bson.objectid import ObjectId

# Form Builder Class define
class BuilderFormCls:
    def __init__(self, req, ses):
        self.req = req
        self.ses = ses

    def get_builder_form_list(self):
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
        conn = DbClass("", "")
        db = conn.getConn("testDB")
        col = conn.getCollection("user")
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

    def get_builder_form_data(self):
        result = {}
        msg = ''
        try:
            print("get_builder_form_data called")
            id = self.req.form['id']
            search_kind = self.req.form['search_kind']
            print("1")
            word = self.req.form['word']
            print("2")
            page = self.req.form['page']
            print("key : ", id)
            conn = DbClass("", "")
            db = conn.getConn("testDB")
            col = conn.getCollection("user")
            data = col.find_one({'_id': ObjectId(id)})

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

    # form builder 데이터를 저장, 삭제, 수정하는 메소드
    # mode에 따라서 구분한다.
    def form_builder_save(self):
        dataList = {}  # 키 배열
        result = {}
        mode = ''
        try:
            conn = DbClass("", "")
            db = conn.getConn("testDB")
            builder = conn.getCollection("user")
            page = self.req.form['page']
            mode = self.req.form['mode']
            print("page : " , page)
            if self.req.form['mode'] == 'inst' or self.req.form['mode'] == 'upst':
                db_name = self.req.form['db_name']
                col_name = self.req.form['col_name']
                conn_url = self.req.form['conn_url']
                conn_page = self.req.form['conn_page']
                conn_name = self.req.form['conn_name']
                content = self.req.form['content']
                id = self.req.form['m_key']

                if self.req.form['mode'] == 'inst':     # insert
                    dataList['db_name'] = db_name
                    dataList['col_name'] = col_name
                    dataList['conn_url'] = conn_url
                    dataList['conn_page'] = conn_page
                    dataList['conn_name'] = conn_name
                    dataList['content'] = content
                    dataList['creatDt'] = datetime.now()
                    dataList['lastModified'] = datetime.now()

                    builder.insert(dataList)
                    msg = "등록을 완료하였습니다"
                else:                                   # update
                    dataList['db_name'] = db_name
                    dataList['col_name'] = col_name
                    dataList['conn_url'] = conn_url
                    dataList['conn_page'] = conn_page
                    dataList['conn_name'] = conn_name
                    dataList['content'] = content
                    dataList['lastModified'] = datetime.now()

                    builder.update({'_id': ObjectId(id)}, {'$set': dataList}, upsert=False)
                    msg = "수정을 완료하였습니다"

                    # data search
                    data = builder.find_one({'_id': ObjectId(id)})
                    result['data'] = data
                conn.Close()
            elif self.req.form['mode'] == 'del':
                id = self.req.form['m_key']
                #data = builder.find_one({'_id': ObjectId(id)})
                #dbname = data['dbname']
                builder.delete_many({'_id': ObjectId(id)})
                conn.Close()

                # DB 삭제
                #print("delete database : ", dbname)
                #conn = DbClass("", "")
                #db = conn.getConn(dbname)
                #db.command("dropDatabase")

                msg = "삭제를 완료하였씁니다"
        except Exception as e:
            msg = "에러가 발생하였습니다 " + str(e)
            print(msg)
            mode = 'err'

        result['msg'] = msg
        result['mode'] = mode
        result['page'] = page

        print("result : ", result)
        return result