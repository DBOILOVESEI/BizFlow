from .database import init_db
from .base import Base

# Import models so SQLAlchemy sees them
from .. models import (
    #course_register_model,
    #todo_model,
    user_model,
    #course_model,
    #consultant_model,
    #appointment_model,
    #program_model,
    #feedback_model,
    #survey_model,
)

def init_db(app):
    init_mssql(app)