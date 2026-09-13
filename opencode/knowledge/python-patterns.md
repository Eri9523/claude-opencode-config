# Python Patterns

On-demand knowledge file. Load via `@knowledge/python-patterns.md`.

---

## Project Structure

```
project/
├── src/
│   └── mypackage/
│       ├── __init__.py
│       ├── core.py
│       └── utils.py
├── tests/
│   ├── conftest.py
│   ├── unit/
│   └── integration/
├── pyproject.toml
└── .pre-commit-config.yaml
```

- **Always** use `src/` layout to avoid import shadowing.
- `__init__.py` should be minimal - avoid logic in package init.

---

## Environment Management (uv)

```bash
# Init project
uv init myproject
cd myproject

# Add deps
uv add requests pydantic

# Add dev deps
uv add --dev pytest mypy ruff pre-commit

# Run in project env
uv run python -m mypackage
uv run pytest
uv run mypy .

# Sync deps after pulling
uv sync

# Lock file: uv.lock (commit it)
```

**Never** use `pip install` in a uv project. Always `uv add` or `uv sync`.

---

## Typing

### Type-annotate all public functions

```python
from typing import Optional, Union
from collections.abc import Sequence


def process(items: Sequence[str], limit: Optional[int] = None) -> list[str]:
    """Process items with optional limit.

    Args:
        items: Input sequence of strings.
        limit: Max results. None means no limit.

    Returns:
        Filtered list of strings.
    """
    result = [i.strip() for i in items if i.strip()]
    return result[:limit] if limit is not None else result
```

### Avoid `Any` - use proper types at boundaries

```python
# BAD
def parse_config(data: Any) -> dict:
    return data

# GOOD - use TypedDict or Pydantic at external boundaries
from typing import TypedDict

class Config(TypedDict):
    host: str
    port: int
    debug: bool

def parse_config(data: dict[str, object]) -> Config:
    return Config(
        host=str(data["host"]),
        port=int(data["port"]),  # type: ignore[arg-type]
        debug=bool(data.get("debug", False)),
    )
```

### Protocol for structural typing

```python
from typing import Protocol, runtime_checkable


@runtime_checkable
class Closeable(Protocol):
    def close(self) -> None: ...


def shutdown(resource: Closeable) -> None:
    resource.close()
```

### Make impossible states impossible

```python
from enum import Enum

# BAD - string state allows typos
status: str = "pending"

# GOOD
class Status(Enum):
    PENDING = "pending"
    RUNNING = "running"
    DONE = "done"
    FAILED = "failed"

status: Status = Status.PENDING
```

---

## Error Handling

### Explicit over broad

```python
# BAD - hides all errors
try:
    result = risky()
except Exception:
    pass

# GOOD - handle specifically, log what you catch
import logging

logger = logging.getLogger(__name__)

try:
    result = risky()
except ValueError as e:
    logger.warning("Invalid input: %s", e)
    result = default_value
except OSError as e:
    logger.error("IO failure: %s", e)
    raise
```

### Custom exceptions for domain errors

```python
class AppError(Exception):
    """Base for all application errors."""

class ValidationError(AppError):
    """Input validation failed."""
    def __init__(self, field: str, message: str) -> None:
        self.field = field
        super().__init__(f"{field}: {message}")

class NotFoundError(AppError):
    """Resource not found."""
```

---

## Dataclasses and Pydantic

### Dataclass for internal data

```python
from dataclasses import dataclass, field


@dataclass(frozen=True)  # frozen = immutable
class Point:
    x: float
    y: float


@dataclass
class Config:
    host: str = "localhost"
    port: int = 8080
    tags: list[str] = field(default_factory=list)
```

### Pydantic for validation at boundaries (external data)

```python
from pydantic import BaseModel, field_validator, model_validator


class UserCreate(BaseModel):
    name: str
    email: str
    age: int

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        if "@" not in v:
            raise ValueError("Invalid email")
        return v.lower()

    @field_validator("age")
    @classmethod
    def validate_age(cls, v: int) -> int:
        if v < 0 or v > 150:
            raise ValueError("Unrealistic age")
        return v
```

---

## Async Python

### Use `asyncio` explicitly, don't mix sync/async

```python
import asyncio
import httpx


async def fetch_data(url: str) -> dict:
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        response.raise_for_status()
        return response.json()


async def main() -> None:
    data = await fetch_data("https://api.example.com/data")
    print(data)


if __name__ == "__main__":
    asyncio.run(main())
```

### Avoid blocking in async context

```python
import asyncio
from pathlib import Path


# BAD - blocks event loop
async def read_file_bad(path: Path) -> str:
    return path.read_text()  # blocking!

# GOOD - use asyncio.to_thread for blocking IO
async def read_file_good(path: Path) -> str:
    return await asyncio.to_thread(path.read_text)
```

---

## Context Managers

### Always use context managers for resources

```python
# BAD
f = open("file.txt")
content = f.read()
f.close()  # never runs on exception

# GOOD
with open("file.txt") as f:
    content = f.read()

# Custom context manager
from contextlib import contextmanager


@contextmanager
def managed_resource():
    resource = acquire_resource()
    try:
        yield resource
    finally:
        resource.release()
```

---

## Imports and Module Organization

### Absolute imports always

```python
# BAD - relative import (confusing in larger projects)
from .utils import helper

# GOOD - absolute
from mypackage.utils import helper
```

### Import order (enforced by ruff/isort)

```python
# 1. stdlib
import os
import sys
from pathlib import Path

# 2. third party
import httpx
from pydantic import BaseModel

# 3. local
from mypackage.core import MyClass
from mypackage.utils import helper
```

---

## Logging

```python
import logging

# Module-level logger - use __name__
logger = logging.getLogger(__name__)

# Use % formatting (lazy eval), not f-strings
logger.debug("Processing item: %s", item)
logger.info("Completed %d items in %.2fs", count, elapsed)
logger.warning("Retry %d/%d for %s", attempt, max_retries, url)
logger.error("Failed to connect: %s", exc, exc_info=True)

# Configure at entry point, not in library code
if __name__ == "__main__":
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(name)s %(levelname)s %(message)s",
    )
```

---

## Pre-commit Setup

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.4.0
    hooks:
      - id: ruff
        args: [--fix]
      - id: ruff-format

  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.6.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-toml
      - id: check-merge-conflict
      - id: no-commit-to-branch
        args: [--branch, main]
```

```toml
# pyproject.toml
[tool.ruff]
line-length = 100
target-version = "py311"

[tool.ruff.lint]
select = ["E", "F", "I", "N", "W", "UP", "B", "SIM", "ANN"]
ignore = ["ANN101", "ANN102"]

[tool.ruff.lint.isort]
known-first-party = ["mypackage"]
```

---

## Mypy Config

```toml
# pyproject.toml
[tool.mypy]
python_version = "3.11"
strict = true
ignore_missing_imports = true
exclude = ["tests/"]
```

Run: `uv run mypy .` or `mise run type`

---

## Common Anti-Patterns to Avoid

| Anti-Pattern | Fix |
|---|---|
| Mutable default args `def f(x=[])` | Use `def f(x=None): if x is None: x = []` |
| `except Exception: pass` | Handle specifically, log, or re-raise |
| `import *` | Explicit imports |
| `type: ignore` without comment | Add comment explaining why |
| Deeply nested functions (>3 levels) | Extract to named functions |
| `print()` in library code | Use `logging` |
| `os.path` in new code | Use `pathlib.Path` |
| `str` for structured data | Use `TypedDict`, `dataclass`, or Pydantic |
