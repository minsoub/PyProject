#-*- coding:utf-8 -*-
# comm/form_reg.py
# from flask import request
from datetime import datetime
import lib.libdb
import math
import pymongo
import json
from bson.objectid import ObjectId

class FormReg:
    def __init__(self, req, ses):
        self.req = req
        self.ses = ses

    def getRegInfo(self):
        result = {}
        try:
            print("getReginfo call")
            if self.req.method == 'POST':
                conn_page = self.req.form['conn_page']
                page = self.req.form['page']
                print("getReginfo call 11", conn_page, page)

                id = self.req.form['id']

                print("getReginfo call 2")
            else:
                conn_page = self.req.args.get('conn_page')
                page = self.req.args.get('page')
                id = self.req.args.get('id')

            if conn_page is None:
                conn_page = 'company_info'

            conn = lib.libdb.DbClass("", "")
            db = conn.getConn("testDB")
            col = conn.getCollection("user")
            data = col.find_one({'conn_page' : conn_page})


            result['conn_page']  = conn_page
            result['page'] = page
            result['id'] = id

            if data is not None:
                _id = data['_id']
                col_name = data['col_name']
                conn_url = data['conn_url']
                conn_name = data['conn_name']
                content = data['content']
                conn.Close()
                result['_id'] = _id
                result['conn_name'] = conn_name     # return value

                if id is not None:
                    # 만일 ID가 있다면 formform.js에서 value를 받아서 등록 할 수 있도록 json을 수정해야 한다.
                    # 조회된 content 내용에서 json을 수정해서 value를 넣고 formform.js에서 value가 있는 값들에 대해서
                    # 출력한다.
                    data_object = json.loads(content)        # json decode
                    print("data_object : ", data_object)
                    dataList = []
                    idx = 0
                    db = conn.getConn(self.ses['dbname'])
                    col = conn.getCollection(col_name)
                    detail_content = col.find_one({'_id' : ObjectId(id)})

                    print("dbname : ", self.ses['dbname'], ", col : ", col_name, "_id", id, ", detail_content : ", detail_content)
                    idx = 0
                    for data in data_object:
                        if data['type'] == 'text' or data['type'] == 'password':
                            print("content : ", detail_content[data['name']])
                            data_object[idx]['value'] = detail_content[data['name']]
                        elif data['type'] == 'multi_text':
                            dx = 0
                            dlist = data['datalist']
                            for lst in dlist:
                                data_object[idx]['datalist'][dx]['value'] = detail_content[lst['name']]
                                dx = dx + 1

                        idx = idx + 1
                    # json encode
                    content = json.dumps(data_object)
                    print("json encode data : ", content)

                result['content'] = content
        except Exception as e:
             print("Result error : ", str(e))

        return result


    def getFormData(self):
        if self.req.method == 'POST':
            conn_page = self.req.form['conn_page']
            page = self.req.form['page']
        else:
            conn_page = self.req.args.get('conn_page')
            page = self.req.args.get('page')
        if conn_page is None:
            conn_page = 'company_info'
        if page is None:
            page = 1


        conn = lib.libdb.DbClass("testDB", "user")
        db = conn.getConn('testDB')
        star = db.user

        print("conn_page", conn_page)

        s = star.find_one({'conn_page': conn_page})

        print("getFormData : ", s)
        data = {}
        data['result'] = s
        conn.Close()

        list_page = (int(page) - 1) * 10
        conn = lib.libdb.DbClass(self.ses['dbname'], s['col_name'])
        db = conn.getConn(self.ses['dbname'])
        if self.ses['admin_chk'] == '1':
            total = conn.getCollection(s['col_name']).find({'createId': self.ses['user_id']}).count()
        else:
            total = conn.getCollection(s['col_name']).find().count()
        # conn.Close()

        page_num = math.ceil(total / 10)
        print("page num : ", page_num)
        conn.setDb(self.ses['dbname'])
        if self.ses['admin_chk'] == '1':
            db = conn.getCollection(s['col_name']).find({'createId': self.ses['user_id']}).sort('createDt', pymongo.ASCENDING).limit(10).skip(list_page)
        else:
            db = conn.getCollection(s['col_name']).find().sort('createDt', pymongo.ASCENDING).limit(10).skip(list_page)

        data['doc'] = db
        data['total'] = total
        data['list_page'] = list_page
        data['page_num'] = page_num
        data['page'] = page
        data['conn_page'] = conn_page

        print("total : ", total, ", list_page : ", list_page, ", page_num : " , page_num)

        return data

    # form data를 저장한다 - 신규 등록, 수정, 삭제 포함
    def formRegister(self):
        if self.req.method == 'POST':
            conn_page = self.req.form['conn_page']
            mode = self.req.form['mode']
            id = self.req.form['mkey']
            _id = self.req.form['_id']

        # form 데이터 필드 정보를 조회한다.
        conn = lib.libdb.DbClass("", "")
        db = conn.getConn("testDB")
        col = conn.getCollection("user")
        data = col.find_one({'_id': ObjectId(_id)})

        if data is not None:
            _id = data['_id']       # form key
            col_name = data['col_name']
            conn_url = data['conn_url']
            conn_name = data['conn_name']
            content = data['content']
            conn.Close()

            data_object = json.loads(content)  # json decode
            dataList = {}    # 키 배열
            for data in data_object:
                if data['type'] == 'text' or data['type'] == 'password':
                    dataList[data['name']] = self.req.form[data['name']]
                elif data['type'] == 'multi_text':
                    lst = data['datalist']   # datalist 배열
                    for lstData in lst:
                        dataList[lstData['name']] = self.req.form[lstData['name']]
            dataList['lastModified'] = datetime.now()
            dataList['createId'] = self.ses['user_id']


            if mode == 'upt':
                try:
                    conn = lib.libdb.DbClass("", "")
                    db = conn.getConn(self.ses['dbname'])
                    col = conn.getCollection(col_name)
                    #  mycollection.update({'_id': mongo_id}, {"$set": post}, upsert=False)
                    col.update({'_id': ObjectId(id)}, {'$set': dataList}, upsert=False)
                    return True
                except Exception as e:
                    print("Update error : ", str(e))
                    return False
            elif mode == 'del':
                try:
                    conn = lib.libdb.DbClass("", "")
                    db = conn.getConn(self.ses['dbname'])
                    col = conn.getCollection(col_name)
                    col.delete_many({'_id': ObjectId(id)})
                    return True
                except Exception as e:
                    print("Delete error : ", str(e))
                    return False
            else:
                try:
                    print("dbname : ", self.ses['dbname'], ", col name : ", col_name)
                    dataList['createDt'] = datetime.now()
                    conn = lib.libdb.DbClass("", "")
                    db = conn.getConn(self.ses['dbname'])
                    col = conn.getCollection(col_name)
                    col.insert(dataList)
                except Exception as e:
                    print("Insert error : ", str(e))
                    return False

            return True
        else:   # 기본 필드 데이터가 없으므로 에러 리턴
            return False


    def getWriteInfo(self):
        result = {}
        try:
            print("getWriteInfo call")
            if self.req.method == 'POST':
                conn_page = self.req.form['conn_page']
                page = self.req.form['page']
                print("getReginfo call 11", conn_page, page)
            else:
                conn_page = self.req.args.get('conn_page')
                page = self.req.args.get('page')

            if conn_page is None:
                conn_page = 'company_info'

            conn = lib.libdb.DbClass("", "")
            db = conn.getConn("testDB")
            col = conn.getCollection("user")
            data = col.find_one({'conn_page' : conn_page})


            result['conn_page']  = conn_page
            result['page'] = page

            if data is not None:
                _id = data['_id']
                col_name = data['col_name']
                conn_url = data['conn_url']
                conn_name = data['conn_name']
                content = data['content']
                conn.Close()
                result['_id'] = _id
                result['conn_name'] = conn_name     # return value

                result['content'] = content
        except Exception as e:
             print("Result error : ", str(e))

        return result

