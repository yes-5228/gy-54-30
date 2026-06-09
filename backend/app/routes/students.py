from flask import Blueprint, jsonify, request

from ..models import Student
from ..services.grade_service import get_transcript

students_bp = Blueprint("students", __name__)


@students_bp.get("")
def index():
    query = Student.query.order_by(Student.student_no.asc())
    student_no = request.args.get("studentNo")
    if student_no:
        query = query.filter(Student.student_no.like(f"%{student_no}%"))
    return jsonify([student.to_dict() for student in query.all()])


@students_bp.get("/<student_no>/transcript")
def transcript(student_no):
    result = get_transcript(student_no)
    if not result:
        return jsonify({"message": "未找到该学生成绩"}), 404
    return jsonify(result)
