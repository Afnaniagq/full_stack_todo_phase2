import os
from dotenv import load_dotenv
from sqlmodel import SQLModel, create_engine
from src.models.user import User
from src.models.task import Task
from src.models.trash_bin import TrashBin

load_dotenv()
engine = create_engine(os.getenv("DATABASE_URL"))

print("🚀 Building your database tables...")
SQLModel.metadata.create_all(engine)
print("✅ Success! Your Neon database now has all the tables.")