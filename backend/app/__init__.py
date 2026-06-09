from flask import Flask
from flask_cors import CORS

from .config import Config
from .extensions import db
from .routes import register_routes
from .seed import seed_demo_data


def create_app(config_class=Config):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(config_class)

    CORS(app, resources={r"/api/*": {"origins": app.config["CORS_ORIGINS"]}})
    db.init_app(app)
    register_routes(app)

    with app.app_context():
        db.create_all()
        seed_demo_data()

    return app
