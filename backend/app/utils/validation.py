def require_fields(payload, fields):
    return [field for field in fields if payload.get(field) in (None, "")]


def validate_score(score):
    try:
        value = float(score)
    except (TypeError, ValueError):
        return "成绩必须是数字"
    if value < 0 or value > 100:
        return "成绩必须在 0 到 100 之间"
    return None
