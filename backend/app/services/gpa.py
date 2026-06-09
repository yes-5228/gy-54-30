def score_to_point(score):
    score = float(score)
    if score >= 90:
        return 4.0
    if score >= 85:
        return 3.7
    if score >= 82:
        return 3.3
    if score >= 78:
        return 3.0
    if score >= 75:
        return 2.7
    if score >= 72:
        return 2.3
    if score >= 68:
        return 2.0
    if score >= 64:
        return 1.5
    if score >= 60:
        return 1.0
    return 0.0


def score_to_letter(score):
    score = float(score)
    if score >= 90:
        return "A"
    if score >= 85:
        return "A-"
    if score >= 82:
        return "B+"
    if score >= 78:
        return "B"
    if score >= 75:
        return "B-"
    if score >= 72:
        return "C+"
    if score >= 68:
        return "C"
    if score >= 64:
        return "C-"
    if score >= 60:
        return "D"
    return "F"


def calculate_summary(grades):
    total_credit = sum(grade.credit for grade in grades)
    weighted_points = sum(grade.credit * score_to_point(grade.score) for grade in grades)
    passed_credit = sum(grade.credit for grade in grades if grade.score >= 60)
    return {
        "courseCount": len(grades),
        "totalCredit": round(total_credit, 2),
        "passedCredit": round(passed_credit, 2),
        "gpa": round(weighted_points / total_credit, 2) if total_credit else 0,
        "averageScore": round(sum(grade.score for grade in grades) / len(grades), 2) if grades else 0,
    }
