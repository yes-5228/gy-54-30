from .extensions import db
from .models import Appeal, Grade, Student


def seed_demo_data():
    if Student.query.first():
        return

    students = [
        Student(student_no="20240001", name="张明", major="计算机科学与技术", class_name="计科2401"),
        Student(student_no="20240002", name="李雨", major="软件工程", class_name="软工2402"),
        Student(student_no="20240003", name="王佳", major="数据科学", class_name="数科2401"),
    ]
    db.session.add_all(students)
    db.session.flush()

    grades = [
        Grade(student=students[0], course_code="CS101", course_name="程序设计基础", credit=4, score=92, semester="2025-2026-1", teacher="陈老师"),
        Grade(student=students[0], course_code="MA101", course_name="高等数学", credit=5, score=86, semester="2025-2026-1", teacher="周老师"),
        Grade(student=students[1], course_code="SE201", course_name="软件工程导论", credit=3, score=78, semester="2025-2026-1", teacher="刘老师"),
        Grade(student=students[1], course_code="CS102", course_name="数据结构", credit=4, score=83, semester="2025-2026-2", teacher="陈老师"),
        Grade(student=students[2], course_code="DS101", course_name="数据分析基础", credit=3, score=88, semester="2025-2026-1", teacher="赵老师"),
    ]
    db.session.add_all(grades)
    db.session.flush()

    db.session.add(
        Appeal(
            grade=grades[2],
            student_no=students[1].student_no,
            reason="期末大题第三题步骤分可能漏算，申请复核。",
            status="pending",
        )
    )
    db.session.commit()
