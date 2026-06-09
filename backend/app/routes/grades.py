from flask import Blueprint, jsonify, request

from ..models import Grade
from ..services.grade_service import create_grade, list_grades, update_grade
from ..utils.validation import require_fields, validate_score

grades_bp = Blueprint("grades", __name__)


@grades_bp.get("")
def index():
    return jsonify([grade.to_dict() for grade in list_grades()])


@grades_bp.post("")
def create():
    payload = request.get_json() or {}
    missing = require_fields(
        payload,
        ["studentNo", "studentName", "courseCode", "courseName", "credit", "score", "semester", "teacher"],
    )
    if missing:
        return jsonify({"message": f"缺少字段: {', '.join(missing)}"}), 400

    error = validate_score(payload["score"])
    if error:
        return jsonify({"message": error}), 400

    grade = create_grade(payload)
    return jsonify(grade.to_dict()), 201


@grades_bp.put("/<int:grade_id>")
def update(grade_id):
    grade = Grade.query.get_or_404(grade_id)
    payload = request.get_json() or {}
    if "score" in payload:
        error = validate_score(payload["score"])
        if error:
            return jsonify({"message": error}), 400

    return jsonify(update_grade(grade, payload).to_dict())
