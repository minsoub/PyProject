# all the imports

from pymongo import MongoClient

from flask import Flask, request, session, g, redirect, url_for, abort, render_template, flash

import datetime

#configuration
DATABASE='D:\DevProject\PyProject\flaskr\tmp\flaskr.db'
DEBUG = True
SECRET_KEY = 'development key'
USERNAME = 'admin'
PASSWORD = 'default'

myrecord = [
    {
       "author" : "Duke II",
       "title" : "PyMongo II 101",
       "tags" : ["MongoDB II", "PyMongo II", "Tutorial II"],
       "date" : datetime.datetime.utcnow()
    },
    {
       "author" : "Duke III",
       "title" : "PyMongo III 101",
       "tags" : ["MongoDB III", "PyMongo III", "Tutorial III"],
       "date" : datetime.datetime.utcnow()    
    }
  ]

# create our little applcation
app = Flask(__name__)
app.config.from_object(__name__)

def connect_db():
    return MongoClient('mongodb://localhost:27017/')
    
def init_db():
   db = connect_db()
   mydb = db['test-database-1']
   mydb.mytable.insert(myrecord)
   print (mydb.collection_names())
   print ("end...")
   
    
if __name__ == '__main__':
   # app.run()
   init_db()
