from flask import Blueprint, render_template, request, jsonify
from models.Pedidos import Product

orders = Blueprint('orders', __name__)

@orders.route('/')
def home():
    return render_template('index.html')

@orders.route('/api/productos', methods = ['GET'])
def get_product():
    products = Product.read()

    lista = []
    for p in products:

        lista.append({
            "id": p['id'],
            "customer": p['customer'],
            "product": p['product'],
            "amount": p['amount'],
            "state": p['state'],
            "start_date": str(p['start_date'])
        })

    return jsonify(lista)

@orders.route('/api/productos', methods = ['POST'])
def add_product():
    customer = request.form.get('customer')
    product = request.form.get('product')
    amount = request.form.get('amount')
    state = request.form.get('state')
    start_date = request.form.get('start_date')

    new = Product(customer,product,amount,state,start_date)
    new.create()
    return jsonify({
        "msg": "Producto registrado correctamente"
    })
    
@orders.route('/api/productos/<int:id>', methods=['PUT'])
def update_product(id):
    new_u = Product(
        request.form.get('customer'),
        request.form.get('product'),
        request.form.get('amount'),
        request.form.get('state'),
        request.form.get('start_date'),
        id          # ← se pasa al constructor
    )
    new_u.update()  # ← sin argumentos
    return jsonify({"msg": "Producto actualizado correctamente"})


@orders.route('/api/productos/<int:id>', methods = ['DELETE'])
def delete_product(id):
    Product.delete(id)
    return jsonify({'msg': 'producto eliminado'})



    