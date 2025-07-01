from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from .models import db

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    # Configuración de la base de datos
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///gestion_insumos.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    db.init_app(app)
    
    with app.app_context():
        db.create_all()
    
    # Registrar rutas
    from .routes import main_routes, rubros_routes, unidades_routes, areas_routes, \
                       proveedores_routes, insumos_routes, listas_precios_routes
    
    app.register_blueprint(main_routes)
    app.register_blueprint(rubros_routes)
    app.register_blueprint(unidades_routes)
    app.register_blueprint(areas_routes)
    app.register_blueprint(proveedores_routes)
    app.register_blueprint(insumos_routes)
    app.register_blueprint(listas_precios_routes)
    
    return app
