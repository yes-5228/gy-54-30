import os


class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        "sqlite:///grades.db",
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*").split(",")
    APPEAL_DEADLINE_HOURS = int(os.getenv("APPEAL_DEADLINE_HOURS", "72"))
