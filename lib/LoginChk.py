import lib.libdb


class LoginCheck:
    def __init__(self, sess):
        self.sess = sess

    def logout(self):
        self.sess.pop('user_id', None)
        self.sess.pop('name', None)
        self.sess.pop('lastModified', None)
        self.sess.pop('admin_chk', None)
        self.sess.pop('dbname', None)


    def admin_login_check(self, user_id, user_pass):
        self.db = lib.libdb.DbClass("commDB", "member")
        self.conn = self.db.getConn()

        star = self.conn.member
        data = star.find_one({'userid': user_id, 'pass': user_pass})

        #debug
        print('user info ' , data)
        self.db.Close()

        if data:
            # output = {'userid': data['userid'], 'name': data['name']}
            # session register
            self.sess['user_id'] = data['userid']
            self.sess['name'] = data['name']
            self.sess['lastModified'] = data['lastModified']
            self.sess['admin_chk'] = data['admin_chk']   # 0 일반회원  1: 일반관리자  2: 통합관리자
            self.sess['dbname'] = data['dbname']
            return True
        else:
            # output = "No such name"
            return False
