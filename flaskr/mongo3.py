# mongo3.py

from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017/')
mydb = client['test-database']

mydb.posts.drop()

import datetime
post = {
        "author": "Duke 5",
        "title" : "PyMongo 101 - 5",
        "tags" : ["MongoDB 5", "PyMongo 101 - A5", "Tutorial 5"],
        "date" : datetime.datetime.utcnow()
        }

posts = mydb.posts
post_id = posts.insert(post)

print (post_id)
print (mydb.collection_names())

new_posts = [{"author": "Duke 6",
              "title" : "PyMongo 101-A6",
              "tags" : ["MongoDB 6", "PyMongo 6", "Tutorial 6"],
              "date" : datetime.datetime(2015, 11, 28, 1, 13)},
             {"author": "Adja",
              "title": "MongoDB 101-A7",
              "note": "Schema free MongoDB",
              "date": datetime.datetime(2015, 11, 29, 11, 42)}
            ]
mydb.posts.insert(new_posts)