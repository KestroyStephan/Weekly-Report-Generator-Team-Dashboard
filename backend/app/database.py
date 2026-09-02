import logging
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.config import settings
from app.models.user import User
from app.models.project import Project
from app.models.report import Report, ReportVersion

logger = logging.getLogger("app.database")

client: AsyncIOMotorClient = None

async def init_db(is_test: bool = False):
    global client
    try:
        # Attempt to connect to real MongoDB
        client = AsyncIOMotorClient(settings.MONGO_URI, serverSelectionTimeoutMS=2000)
        # Check connection
        await client.admin.command('ping')
        db = client[settings.MONGO_DB_NAME if not is_test else f"{settings.MONGO_DB_NAME}_test"]
        await init_beanie(database=db, document_models=[User, Project, Report, ReportVersion])
        logger.info("Connected to MongoDB successfully.")
    except Exception as e:
        logger.warning(f"Could not connect to MongoDB server ({e}). Falling back to mongomock_motor...")
        try:
            import mongomock_motor
            client = mongomock_motor.AsyncMongoMockClient()
            db = client[settings.MONGO_DB_NAME if not is_test else f"{settings.MONGO_DB_NAME}_test"]
            await init_beanie(database=db, document_models=[User, Project, Report, ReportVersion])
            logger.info("Initialized Beanie with in-memory mongomock_motor.")
        except Exception as mock_err:
            logger.error(f"Failed to initialize database with mongomock_motor: {mock_err}")
            raise mock_err

async def close_db():
    global client
    if client:
        client.close()
        logger.info("Closed database connection.")
