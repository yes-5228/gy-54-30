from ..extensions import db
from ..models import Appeal, Grade


VALID_STATUSES = {"pending", "approved", "rejected"}


def create_appeal(payload):
    grade = Grade.query.get(payload["gradeId"])
    if not grade:
        return None, "成绩记录不存在"
    if grade.student.student_no != payload["studentNo"]:
        return None, "学号与成绩记录不匹配"

    appeal = Appeal(
        grade=grade,
        student_no=payload["studentNo"],
        reason=payload["reason"],
    )
    db.session.add(appeal)
    db.session.commit()
    return appeal, None


def update_appeal(appeal, payload):
    status = payload.get("status", appeal.status)
    if status not in VALID_STATUSES:
        return None, "申诉状态无效"
    appeal.status = status
    appeal.teacher_response = payload.get("teacherResponse", appeal.teacher_response)
    db.session.commit()
    return appeal, None
