from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "SafetyScore FastAPI"
    app_env: str = "development"
    api_prefix: str = "/api"
    app_port: int = 8000
    app_url: str = "http://localhost:3000"

    mysql_host: str = "127.0.0.1"
    mysql_port: int = 3307
    mysql_user: str = "root"
    mysql_password: str = ""
    mysql_db: str = "safetyscore"

    jwt_secret: str = "change_this_in_production"
    jwt_algorithm: str = "HS256"
    jwt_access_token_minutes: int = 120

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def database_url(self) -> str:
        return (
            f"mysql+pymysql://{self.mysql_user}:{self.mysql_password}"
            f"@{self.mysql_host}:{self.mysql_port}/{self.mysql_db}"
        )


settings = Settings()
