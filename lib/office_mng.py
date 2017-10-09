# Office 정보 관리 클래스
# 사내 프로젝트 관리 등을 수행한다.
from lib.libdb import DbClass
import json
from bson import json_util
from bson.objectid import ObjectId
from datetime import datetime

class OfficeCls:
    collectionName = "ProjectCollection"   # class variable shared by all instances
    def __init__(self, req, ses):
        self.req = req
        self.ses = ses

    # 등록된 프로젝트 리스트를 조회해서 리턴한다.
    # DB : session['db']
    # Search id : createId
    # Collection : ProjectCollection
    def getprojectlist(self):
        dbname = self.ses['dbname']
        print("dbname : ", dbname)
        cls = DbClass('', '')
        client = cls.getConn(dbname)
        project_collection = cls.getCollection(self.collectionName)

        data = project_collection.find({'createId': self.ses['user_id']})
        cls.Close()
        if data.count() > 0:
            arr = [];
            for doc in data:
                # datetime.datetime.strptime(v, DATE_FORMAT)
                doc['createDt'] = (str(doc['createDt']))[0:19]
                doc['lastModified'] = (str(doc['lastModified']))[0:19]
                #doc['id'] = doc['_id'].toString()
                arr.append(doc);
                print("data : ", doc)
                #JSONEncoder().encode(analytics)

            content = json.dumps(arr, indent=4, default=json_util.default)   #json.dumps(arr)      # JSON 한개의 데이터가 아니다. Cursor 배열이므로 JSON으로 변경해야 한다.

            return content
        else: #
            return ""

    # 프로젝트 등록폼에서 넘어온 데이터를 등록한다.
    # DB : session['db']
    # Collection: WorkerCollection (JSON에 등록되어 있음)
    # mode : save, delete
    def save_project(self, data, mode):
        # dbname  : session['dbname']
        # colname : ProjectCollection
        dbname = self.ses['dbname']
        cls = DbClass('', '')
        client = cls.getConn(dbname)
        project_collection = cls.getCollection(self.collectionName)
        json_data = json_util.loads(data)

        print("str : ", json_data)
        if mode == 'save':
            if '_id' not in json_data:        # 신규등록
                json_data['createId'] = self.ses['user_id']
                json_data['createDt'] = datetime.now();
                json_data['lastModified'] = datetime.now();
                result = project_collection.insert_one(json_data);
                id = result.inserted_id
            else:                       # 업데이트
                print("id : ", json_data['_id'])
                json_data['lastModified'] = datetime.now();
                result = project_collection.update({'_id': ObjectId(json_data['_id'])}, {'$set': json_data}, upsert=False)
                id = json_data['_id']
                print("id : ", id)

            cursor = project_collection.find({'_id': ObjectId(id)})  # ,  {'_id': True})
            if cursor.count() > 0:
                data = cursor[0];
                data['createDt'] = str(data['createDt'])[0:19]
                data['lastModified'] = str(data['lastModified'])[0:19]
                data[0] = cursor;

            cls.Close();
            return data;
        else:       # delete
            result = project_collection.delete_one({'_id': ObjectId(json_data['_id'])})
            data = {}
            data['msg'] = "삭제를 완료하였습니다!!!"
            return data;

    # 프로젝트 리스트에 대해서 공통으로 사용할 수 있는 API
    # _id를 string 으로 변환해서 사용한다.
    def getprojectlistJson(self):
        dbname = self.ses['dbname']
        print("dbname : ", dbname)
        cls = DbClass('', '')
        client = cls.getConn(dbname)
        project_collection = cls.getCollection(self.collectionName)

        data = project_collection.find({'createId': self.ses['user_id']})
        cls.Close()
        if data.count() > 0:
            arr = [];
            for cursor in data:
                doc = dict(cursor)
                doc['_id'] = str(doc['_id'])
                doc['createDt'] = (str(doc['createDt']))[0:19]
                doc['lastModified'] = (str(doc['lastModified']))[0:19]
                arr.append(doc);
                print("data : ", doc)

            content = json.dumps(arr, indent=4, default=json_util.default)   #json.dumps(arr)      # JSON 한개의 데이터가 아니다. Cursor 배열이므로 JSON으로 변경해야 한다.
            return content
        else:
            return ""
