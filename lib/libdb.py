# lib/libdb.py
from pymongo import MongoClient


class DbClass:

    def __init__(self, dbname, collection):
        self.MONGODB_HOST = 'localhost'
        self.MONGODB_PORT = 27017
        self.DB_NAME = dbname       # commDB
        self.COLLECTION_NAME = collection  # member

    def getConn(self, dbname = None):
        self.client = MongoClient('mongodb://localhost:27017/')
        if dbname == None:
            self.mydb = self.client[self.DB_NAME]
        else:
            self.mydb = self.client[dbname]

        return self.mydb

    def setDb(self, dbname):
        self.mydb = self.client[dbname]


    def getCollection(self, colname = None):
        if colname == None:
            return self.mydb.get_collection(self.COLLECTION_NAME)
        else:
            return self.mydb.get_collection(colname)

    def Close(self):
        self.client.close()

