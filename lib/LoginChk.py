import lib.libdb


class LoginCheck:
    def __init__(self, sess):
        self.sess = sess

    def admin_login_check(self, user_id, user_pass):
        self.db = lib.libdb.DbClass("commDB", "member")
        self.conn = self.db.getConn()

        star = self.conn.member
        data = star.find_one({'userid': user_id, 'pass': user_pass})

        #debug
        print('user info ' , data)

        if data:
            # output = {'userid': data['userid'], 'name': data['name']}
            # session register
            self.sess['user_id'] = data['userid']
            self.sess['name'] = data['name']
            self.sess['lastModified'] = data['lastModified']
            self.sess['admin_chk'] = data['admin_chk']
            self.sess['dbname'] = data['dbname']
            return True
        else:
            # output = "No such name"
            return False
