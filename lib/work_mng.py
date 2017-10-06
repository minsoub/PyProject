# 작업자 관리 클래스
# 작업자 등록, 작업자 검색, 작업자 근태 등록을 수행한다.
from lib.libdb import DbClass
import json
from bson import json_util
from bson.objectid import ObjectId

class WorkCls:
    def __init__(self, req, ses):
        self.req = req
        self.ses = ses

    # 작업자 리스트를 조회해서 리턴한다.
    # DB : session['db']
    # Collection : WorkerCollection
    def getworklist(self, collectionname):
        if self.req.method == 'POST':
            page = self.req.form['page']
        else:
            page = self.req.args.get('page')
        if page is None:
            page = 1

        dbname = self.ses['dbname']
        print("dbname : ", dbname)
        cls = DbClass('', '')
        client = cls.getConn(dbname)
        worker_collection = cls.getCollection(collectionname)

        data = worker_collection.find()
        cls.Close()

        if data.count() > 0:
            arr = [];
            for doc in data:
                arr.append(doc);
                print("data : ", doc)
                #JSONEncoder().encode(analytics)

            content = json.dumps(arr, indent=4, default=json_util.default)   #json.dumps(arr)      # JSON 한개의 데이터가 아니다. Cursor 배열이므로 JSON으로 변경해야 한다.

            return content
        else: #
            return ""

    # 작업자 등록폼에서 넘어온 데이터를 등록한다.
    # DB : session['db']
    # Collection: WorkerCollection (JSON에 등록되어 있음)
    # mode : save, delete
    def save_worker(self, data, mode, collectionname):
        # dbname  : session['dbname']
        # colname : processCollection
        dbname = self.ses['dbname']
        cls = DbClass('', '')
        client = cls.getConn(dbname)
        worker_collection = cls.getCollection(collectionname)
        str = json_util.loads(data)

        print("str : ", str)
        if mode == 'save':
            if '_id' not in str:        # 신규등록
                result = worker_collection.insert_one(str);
                id = result.inserted_id
            else:                       # 업데이트
                print("id : ", str['_id'])
                result = worker_collection.update({'_id': ObjectId(str['_id'])}, {'$set': str}, upsert=False)
                id = str['_id']
                print("id : ", id)

            data = worker_collection.find({'_id': ObjectId(id)})  # ,  {'_id': True})
            cls.Close();
            return data;
        else:       # delete
            result = worker_collection.delete_one({'_id': ObjectId(str['_id'])})
            data = {}
            data['msg'] = "삭제를 완료하였습니다!!!"
            return data;

    # 작업자 근태현황을 조회한다.
    # dt : yyyy-mm
    # data : 작업자 JSON 데이터
    # collection name : WorkerDateCollection
    def worker_search_list(self, data, dt):
        dbname = self.ses['dbname']
        print("dbname : ", dbname)
        cls = DbClass('', '')
        client = cls.getConn(dbname)
        worker_collection = cls.getCollection("WorkerDateCollection")

        # 작업자 JSON 데이터에서 작업자 Key를 조회한다.
        print("data : " , data)
        workerobj = json_util.loads(data)
        worker_id = workerobj['_id']
        print("worker_id : " , worker_id)

        data = worker_collection.find({'work_id': ObjectId(worker_id), 'work_dt' : dt})
        cls.Close()

        if data.count() > 0:
            return data
        else: #
            return ""

    # 작업자 근태현황 등록폼에서 넘어온 데이터를 등록한다.
    # DB : session['db']
    # Collection: WorkerDateCollection
    # mode : save, delete
    def save_worker_list(self, data, mode):
        # dbname  : session['dbname']
        # colname : processCollection
        dbname = self.ses['dbname']
        cls = DbClass('', '')
        client = cls.getConn(dbname)
        worker_collection = cls.getCollection("WorkerDateCollection")
        str = json_util.loads(data)

        print("str : ", str)
        if '_id' not in str:        # 신규등록
            result = worker_collection.insert_one(str);
            id = result.inserted_id
        else:                       # 업데이트
            print("id : ", str['_id'])
            result = worker_collection.update({'_id': ObjectId(str['_id'])}, {'$set': str}, upsert=False)
            id = str['_id']
            print("id : ", id)

        data = worker_collection.find({'_id': ObjectId(id)})  # ,  {'_id': True})
        cls.Close();
        return data;