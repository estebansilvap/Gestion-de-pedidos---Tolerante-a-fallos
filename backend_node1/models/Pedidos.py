from models.database import mysql

class Product:
        def __init__(self,customer, product, amount, state, start_date, id=None):
            self.customer = customer
            self.product = product
            self.amount = amount
            self.state = state
            self.start_date = start_date
            self.id = id

        def create(self):
            cur = mysql.connection.cursor()
            cur.execute('''INSERT INTO orders (customer, product, amount, state, start_date) 
                        VALUES (%s,%s,%s,%s,%s)''', 
                        (self.customer, self.product, self.amount, self.state, self.start_date))
            mysql.connection.commit()
            cur.close()
        
        @staticmethod
        def read():
            cur = mysql.connection.cursor()
            cur.execute('SELECT * FROM orders')
            data = cur.fetchall()
            cur.close()
            return data

        def update(self):
            cur = mysql.connection.cursor()
            cur.execute('UPDATE orders SET customer = %s, product = %s, amount = %s, state = %s, start_date = %s WHERE id = %s', 
                        (self.customer, self.product, self.amount, self.state, self.start_date, self.id))
            mysql.connection.commit()
            cur.close()
        @staticmethod
        def delete(id):
            cur = mysql.connection.cursor()
            cur.execute('DELETE FROM orders WHERE id = %s', (id,))
            mysql.connection.commit()
            cur.close()




