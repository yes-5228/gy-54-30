from ..extensions import db
from ..models import Grade, Student
from .gpa import calculate_summary


def list_grades():
    return Grade.query.order_by(Grade.updated_at.desc()).all()


def get_or_create_student(student_no, name, major="", class_name=""):
    student = Student.query.filter_by(student_no=student_no).first()
    if student:
        student.name = name or student.name
        student.major = major if major is not None else student.major
        student.class_name = class_name if class_name is not None else student.class_name
        return student

    student = Student(
        student_no=student_no,
        name=name,
        major=major or "",
        class_name=class_name or "",
    )
    db.session.add(student)
    return student


def create_grade(payload):
    student = get_or_create_student(
        payload["studentNo"],
        payload["studentName"],
        payload.get("major", ""),
        payload.get("className", ""),
    )
    grade = Grade(
        student=student,
        course_code=payload["courseCode"],
        course_name=payload["courseName"],
        credit=float(payload["credit"]),
        score=float(payload["score"]),
        semester=payload["semester"],
        teacher=payload["teacher"],
    )
    db.session.add(grade)
    db.session.commit()
    return grade


def update_grade(grade, payload):
    if "courseCode" in payload:
        grade.course_code = payload["courseCode"]
    if "courseName" in payload:
        grade.course_name = payload["courseName"]
    if "credit" in payload:
        grade.credit = float(payload["credit"])
    if "score" in payload:
        grade.score = float(payload["score"])
    if "semester" in payload:
        grade.semester = payload["semester"]
    if "teacher" in payload:
        grade.teacher = payload["teacher"]
    db.session.commit()
    return grade


def get_transcript(student_no):
    student = Student.query.filter_by(student_no=student_no).first()
    if not student:
        return None
    grades = Grade.query.filter_by(student_id=student.id).order_by(Grade.semester.desc(), Grade.course_code).all()
    return {
        "student": student.to_dict(),
        "summary": calculate_summary(grades),
        "grades": [grade.to_dict() for grade in grades],
    }
