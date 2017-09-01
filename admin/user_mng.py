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

    def getuserlist(self) -> object:
        conn = lib.libdb.DbClass("", "")
        db = conn.getConn("commDB")
        col = conn.getCollection("member")

        if self.req.method == 'GET':
            data = col.find().sort('lastModified', pymongo.DESCENDING)
        else:
            search_kind = self.req.form['search_kind']
            word = self.req.form['word']
            data = col.find({search_kind: word}).sort('lastModified', pymongo.DESCENDING)

        return data
