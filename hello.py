from flask import Flask
from pymongo import MongoClient

app = Flask(__name__)

@app.route('/')
def hello_world():
   MONGODB_HOST = 'localhost'
   MONGODB_PORT = 27017
   DB_NAME ='commDB'  # commDB
   COLLECTION_NAME = "member"  # member
   client = MongoClient('mongodb://localhost:27017/')
   db = client[DB_NAME]
   star = db.member
   s = star.find_one({'userid': 'mjoung@hist.co.kr', 'pass': 'wjdalstjq1'})
   if s:
      output = {'userid': s['userid'], 'name': s['name']}
   else:
      output = "No such name"

   print(output)

   return 'Hello world!'
   
if __name__ == '__main__':
   app.run(debug=True)
