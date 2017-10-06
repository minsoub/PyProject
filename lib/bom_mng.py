from datetime import datetime
from lib.libdb import DbClass
import math
import pymongo
import json
from bson.objectid import ObjectId
from bson import BSON
from bson import json_util

class BomMngReg:
    def __init__(self, req, ses):
        self.req = req
        self.ses = ses

    def set_pro_id(self, pro_id):
        self.pro_id = pro_id

    # 사용자에 의해 생성된 프로젝트 정보를 조회한다.
    # 프로젝트 생성 사용자는 사용자 세션에 있다.
    def get_project_list(self):
        dbname = self.ses['dbname']
        print("dbname : ", dbname)
        cls = DbClass('', '')
        client = cls.getConn(dbname)
        project_collection = cls.getCollection('ProjectCollection')
        data = project_collection.find()
        cls.Close()
        return data
    def get_project_name(self):
        dbname = self.ses['dbname']
        cls = DbClass('', '')
        client = cls.getConn(dbname)
        project_collection = cls.getCollection(('ProjectCollection'))
        # col.find_one({'conn_page' : conn_page})
        data = project_collection.find_one({'_id': ObjectId(self.pro_id)})

        cls.Close()
        print("project_name : ", data['project_name'])
        if data is not None:
            return data['project_name']
        else:
            return ''

    # 부품 관리 정보를 조회한다.
    def get_bom_detail_data(self):
        # dbname  : session['dbname']
        # colname : bomCollection
        dbname = self.ses['dbname']
        cls = DbClass('', '')
        client = cls.getConn(dbname)
        bom = cls.getCollection('bomCollection')

        data = bom.find().sort('creatDt', pymongo.ASCENDING)

        cls.Close()

        return data

    # Project Id를 가지고  부품 그룹 데이터 조회한다.
    def process_group_getdata(self, pro_id):
        # dbname  : session['dbname']
        # colname : bomCollection
        dbname = self.ses['dbname']
        cls = DbClass('', '')
        client = cls.getConn(dbname)
        bom = cls.getCollection('bomCollection')

        data = bom.find({'projectId': pro_id})
        cls.Close()
        if data.count() > 0:
            print("here 1", data.count())
            return data
        else:
            return None

    # Parts Groups을 등록한다.
    def save_group_parts(self, data, pro_id):
        # dbname  : session['dbname']
        # colname : bomCollection
        dbname = self.ses['dbname']
        cls = DbClass('', '')
        client = cls.getConn(dbname)
        bom = cls.getCollection('bomCollection')
        str = json_util.loads(data)

        print("str : ", str)
        if '_id' not in str:
            result = bom.insert_one(str);
            id = result.inserted_id
        else:
            print("id : ", str['_id'])
            result = bom.update({'_id': ObjectId(str['_id'])}, {'$set': str}, upsert=False)
            id = str['_id']
            print("id : ", id)
        print("id : ", id)

        data = bom.find({'_id': ObjectId(id)})  # ,  {'_id': True})
        cls.Close()
        return data

    # part group delete
    def delete_group_parts(self, data, pro_id):
        # dbname  : session['dbname']
        # colname : bomCollection
        dbname = self.ses['dbname']
        cls = DbClass('', '')
        client = cls.getConn(dbname)
        bom = cls.getCollection('bomCollection')
        str = json_util.loads(data)
        result = {}
        print("str : ", str)
        if '_id' not in str:
            result['msg'] = "삭제할 Key가 존재하지 않습니다!!!"
        else:
            print("id : ", str['_id'])
            dd = bom.delete_one({'_id': ObjectId(str['_id'])})
            result['msg'] = "삭제를 완료하였습니다!!!"
        print("id : ", id)

        cls.Close()

        return result

    # 공정관리 정보를 데이터베이스에 등록한다.
    def save_process(self, data):
        # dbname  : session['dbname']
        # colname : processCollection
        dbname = self.ses['dbname']
        cls = DbClass('', '')
        client = cls.getConn(dbname)
        bom = cls.getCollection('processCollection')
        str = json_util.loads(data)

        print("str : ", str)
        if '_id' not in str:        # 신규등록
            # projectId, bomId  체크 => not check (가져올 때 projectId, bomId로 가져온다.)
            result = bom.insert_one(str);
            id = result.inserted_id
        else:                       # 업데이트
            print("id : ", str['_id'])
            result = bom.update({'_id': ObjectId(str['_id'])}, {'$set': str}, upsert=False)
            id = str['_id']
            print("id : ", id)
        print("id : ", id)

        data = bom.find({'_id': ObjectId(id)})  # ,  {'_id': True})
        cls.Close()
        return data

    # 공정관리 데이터를 삭제한다.
    def delete_process(self, data):
        # dbname  : session['dbname']
        # colname : processCollection
        dbname = self.ses['dbname']
        cls = DbClass('', '')
        client = cls.getConn(dbname)
        bom = cls.getCollection('processCollection')
        str = json_util.loads(data)
        result = {}
        print("str : ", str)
        if '_id' not in str:
            result['msg'] = "삭제할 Key가 존재하지 않습니다!!!"
        else:
            print("id : ", str['_id'])
            dd = bom.delete_one({'_id': ObjectId(str['_id'])})
            result['msg'] = "삭제를 완료하였습니다!!!"
        print("id : ", id)

        cls.Close()

        return result

    # 등록된 공정관리 정보를 가져온다.
    # pro_id, bom_id로 데이터를 가져와야 된다.
    def bom_process_getdata(self, pro_id, bom_id):
        # dbname  : session['dbname']
        # colname : processCollection
        dbname = self.ses['dbname']
        cls = DbClass('', '')
        client = cls.getConn(dbname)
        bom = cls.getCollection('processCollection')

        data = bom.find({'projectId': pro_id, 'bomId': bom_id})
        cls.Close()
        if data.count() > 0:
            print("here 1", data.count())
            return data
        else:
            return None

    # 재고관리 정보를 데이터베이스에서 조회한다.
    def bom_item_getdata(self):
        # dbname  : session['dbname']
        # colname : itemCollection
        dbname = self.ses['dbname']
        cls = DbClass('', '')
        client = cls.getConn(dbname)
        bom = cls.getCollection('itemCollection')

        data = bom.find()
        cls.Close()
        if data.count() > 0:
            return data
        else:
            return None

    # 재고관리 정보를 데이터베이스에 등록/수정/삭제 한다.
    # DB name : session['dbname']
    # Collection : itemCollection
    def save_items(self, data, mode):
        # dbname  : session['dbname']
        # colname : itemCollection
        dbname = self.ses['dbname']
        cls = DbClass('', '')
        client = cls.getConn(dbname)
        bom = cls.getCollection('itemCollection')
        str = json_util.loads(data)

        print("str : ", str)
        if mode == 'del':
            result = bom.delete_one({'_id': ObjectId(str['_id'])})
            data = {'msg': ["삭제를 완료하였습니다!!!"]}
        else:
            if '_id' not in str:        # 신규등록
                # projectId, bomId  체크 => not check (가져올 때 projectId, bomId로 가져온다.)
                result = bom.insert_one(str);
                id = result.inserted_id
            else:                       # 업데이트
                print("id : ", str['_id'])
                result = bom.update({'_id': ObjectId(str['_id'])}, {'$set': str}, upsert=False)
                id = str['_id']
                print("id : ", id)
            print("id : ", id)
            data = bom.find({'_id': ObjectId(id)})  # ,  {'_id': True})

        cls.Close()
        return data