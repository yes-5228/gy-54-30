from flask import Blueprint, jsonify, request

from ..models import Appeal
from ..services.appeal_service import create_appeal, update_appeal
from ..utils.validation import require_fields

appeals_bp = Blueprint("appeals", __name__)


@appeals_bp.get("")
def index():
    appeals = Appeal.query.order_by(Appeal.updated_at.desc()).all()
    return jsonify([appeal.to_dict() for appeal in appeals])


@appeals_bp.post("")
def create():
    payload = request.get_json() or {}
    missing = require_fields(payload, ["gradeId", "studentNo", "reason"])
    if missing:
        return jsonify({"message": f"缺少字段: {', '.join(missing)}"}), 400

    appeal, error = create_appeal(payload)
    if error:
        return jsonify({"message": error}), 400
    return jsonify(appeal.to_dict()), 201


@appeals_bp.patch("/<int:appeal_id>")
def update(appeal_id):
    appeal = Appeal.query.get_or_404(appeal_id)
    updated, error = update_appeal(appeal, request.get_json() or {})
    if error:
        return jsonify({"message": error}), 400
    return jsonify(updated.to_dict())
