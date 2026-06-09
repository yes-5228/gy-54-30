from .appeals import appeals_bp
from .grades import grades_bp
from .students import students_bp


def register_routes(app):
    @app.get("/api/health")
    def health():
        return {"status": "ok"}

    app.register_blueprint(grades_bp, url_prefix="/api/grades")
    app.register_blueprint(students_bp, url_prefix="/api/students")
    app.register_blueprint(appeals_bp, url_prefix="/api/appeals")
