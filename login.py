from flask import request

@app.route('/login', methods=['POST', 'GET'])
def login():
    error = None
    if request.methods == 'POST':
       if valid_login(request.form['username'], request.form['password']):
          return log_the_user_in(request.form['username'])
       else:
          error = 'Invalid username/password'
    return render_template('login.html', error=error)
    

def valid_log(name, pass):
    return true

def log_the_user_in(name):
    render_template('main.html', name=name)