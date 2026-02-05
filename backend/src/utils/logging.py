"""Logging utilities for the Todo application."""

import logging
from typing import Any
import json
from datetime import datetime


def setup_logger(name: str, level: int = logging.INFO) -> logging.Logger:
    """Set up a logger with the specified name and level."""
    logger = logging.getLogger(name)
    logger.setLevel(level)

    # Prevent adding multiple handlers if logger already exists
    if logger.handlers:
        return logger

    # Create console handler
    handler = logging.StreamHandler()
    handler.setLevel(level)

    # Create formatter
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    handler.setFormatter(formatter)

    # Add handler to logger
    logger.addHandler(handler)

    return logger


def log_api_call(endpoint: str, method: str, user_id: str = None, details: dict = None):
    """Log API calls with structured information."""
    logger = setup_logger("api")
    log_data = {
        "timestamp": datetime.utcnow().isoformat(),
        "endpoint": endpoint,
        "method": method,
        "user_id": user_id,
        "details": details
    }
    logger.info(json.dumps(log_data))


def log_error(error: Exception, context: str = ""):
    """Log errors with context."""
    logger = setup_logger("error")
    logger.error(f"{context}: {str(error)}", exc_info=True)


def log_security_event(event_type: str, user_id: str = None, ip_address: str = None, details: dict = None):
    """Log security-related events."""
    logger = setup_logger("security")
    log_data = {
        "timestamp": datetime.utcnow().isoformat(),
        "event_type": event_type,
        "user_id": user_id,
        "ip_address": ip_address,
        "details": details
    }
    logger.warning(json.dumps(log_data))