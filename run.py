#-*- coding:utf-8 -*-
from flask import Flask

from bom import bom
from process import process
from admin_user import admin_user
from main import job
from work import work

app = Flask(__name__)

app.register_blueprint(bom)             # bom management
app.register_blueprint(process)         # process management
app.register_blueprint(admin_user)      # admin
app.register_blueprint(job)
app.register_blueprint(work)            # worker

if __name__ == "__main__":
    # set the secret key.  keep this really secret:
    app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'
    app.run(host='0.0.0.0', port=8000, debug=True)

