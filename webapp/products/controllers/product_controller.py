from flask import Blueprint, request, jsonify
from products.models.product_model import Productos
from users.models.db import db

product_controller = Blueprint('product_controller', __name__)

def to_dict(p):
    return {'id': p.id, 'nombre': p.nombre, 'descripcion': p.descripcion,
            'precio': float(p.precio), 'stock': p.stock}

@product_controller.route('/api/productos', methods=['GET'])
def get_productos():
    print("listado de productos")
    productos = Productos.query.all()
    return jsonify([to_dict(p) for p in productos])

@product_controller.route('/api/productos/<int:producto_id>', methods=['GET'])
def get_producto(producto_id):
    print("obteniendo producto")
    p = Productos.query.get_or_404(producto_id)
    return jsonify(to_dict(p))

@product_controller.route('/api/productos', methods=['POST'])
def create_producto():
    print("creando producto")
    data = request.json
    if not data or 'nombre' not in data or 'precio' not in data:
        return jsonify({'message': 'nombre y precio son obligatorios'}), 400
    nuevo = Productos(nombre=data['nombre'],
                      descripcion=data.get('descripcion', ''),
                      precio=data['precio'],
                      stock=data.get('stock', 0))
    db.session.add(nuevo)
    db.session.commit()
    return jsonify({'message': 'Product created successfully'}), 201

@product_controller.route('/api/productos/<int:producto_id>', methods=['PUT'])
def update_producto(producto_id):
    print("actualizando producto")
    p = Productos.query.get_or_404(producto_id)
    data = request.json
    p.nombre = data['nombre']
    p.descripcion = data.get('descripcion', '')
    p.precio = data['precio']
    p.stock = data.get('stock', 0)
    db.session.commit()
    return jsonify({'message': 'Product updated successfully'})

@product_controller.route('/api/productos/<int:producto_id>', methods=['DELETE'])
def delete_producto(producto_id):
    print("eliminando producto")
    p = Productos.query.get_or_404(producto_id)
    db.session.delete(p)
    db.session.commit()
    return jsonify({'message': 'Product deleted successfully'})
