from flask import Flask
from models.database import mysql
from pattern.singleton import Config
from controllers.pedidos import orders

app = Flask(__name__, template_folder='frontend', static_folder='frontend')
app.config.from_object(Config)

mysql.init_app(app)
app.register_blueprint(orders)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000, threaded=True)
