# Pytest Patterns

On-demand knowledge file. Load via `@knowledge/pytest-patterns.md`.

---

## Setup

```toml
# pyproject.toml
[tool.pytest.ini_options]
testpaths = ["tests"]
addopts = [
    "--strict-markers",
    "--tb=short",
    "-q",
]
markers = [
    "slow: marks tests as slow (deselect with -m 'not slow')",
    "integration: marks integration tests",
    "unit: marks unit tests",
]

[tool.coverage.run]
source = ["src"]
omit = ["tests/*", "*/migrations/*"]

[tool.coverage.report]
show_missing = true
fail_under = 80
```

```bash
# Run all tests
uv run pytest

# Run with coverage
uv run pytest --cov=src --cov-report=term-missing

# Run only unit tests
uv run pytest -m unit

# Run specific file
uv run pytest tests/test_service.py -v

# Run specific test
uv run pytest tests/test_service.py::TestMyClass::test_method -v

# Stop on first failure
uv run pytest -x

# Show local variables on failure
uv run pytest -l
```

---

## Conftest and Fixtures

### Project-level conftest.py

```python
# tests/conftest.py
import pytest
from pathlib import Path


@pytest.fixture(scope="session")
def project_root() -> Path:
    return Path(__file__).parent.parent


@pytest.fixture
def tmp_config(tmp_path: Path) -> Path:
    """Create a temp config file."""
    config = tmp_path / "config.yaml"
    config.write_text("host: localhost\nport: 8080\n")
    return config
```

### Module-level conftest.py

```python
# tests/unit/conftest.py
import pytest
from mypackage.service import MyService


@pytest.fixture
def service() -> MyService:
    """Fresh service for each test."""
    return MyService(config={"timeout": 5})
```

### Fixture scopes

```python
@pytest.fixture(scope="function")  # default - new instance per test
@pytest.fixture(scope="class")     # once per class
@pytest.fixture(scope="module")    # once per test module
@pytest.fixture(scope="session")   # once per test session
```

Use `scope="session"` for expensive setup (DB, network). Use `scope="function"` (default) for mutable state.

---

## Parametrize

```python
import pytest


@pytest.mark.parametrize("input,expected", [
    ("hello", "HELLO"),
    ("world", "WORLD"),
    ("", ""),
    ("MiXeD", "MIXED"),
])
def test_uppercase(input: str, expected: str) -> None:
    assert input.upper() == expected


# Parametrize with IDs
@pytest.mark.parametrize("value,raises", [
    (1, False),
    (0, True),
    (-1, True),
], ids=["valid", "zero", "negative"])
def test_validate_positive(value: int, raises: bool) -> None:
    if raises:
        with pytest.raises(ValueError):
            validate_positive(value)
    else:
        assert validate_positive(value) == value


# Nested parametrize (cartesian product)
@pytest.mark.parametrize("op", ["add", "sub"])
@pytest.mark.parametrize("n", [1, 2, 3])
def test_operation(n: int, op: str) -> None:
    ...
```

---

## Mocking

### `unittest.mock.patch` (decorator form)

```python
from unittest.mock import patch, MagicMock


@patch("mypackage.service.requests.get")
def test_fetch(mock_get: MagicMock) -> None:
    mock_get.return_value = MagicMock(
        status_code=200,
        json=lambda: {"data": "mocked"},
    )
    result = fetch_data("https://api.example.com")
    assert result["data"] == "mocked"
    mock_get.assert_called_once_with("https://api.example.com")
```

### `monkeypatch` (pytest preferred for env/attrs)

```python
def test_with_env(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("API_KEY", "test-key")
    monkeypatch.setenv("DEBUG", "true")
    result = get_api_key()
    assert result == "test-key"


def test_with_attr(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr("mypackage.service.TIMEOUT", 0.001)
    with pytest.raises(TimeoutError):
        slow_request()
```

### Context manager form (for complex setups)

```python
from unittest.mock import patch


def test_complex() -> None:
    with patch("module.Class") as MockClass:
        MockClass.return_value.method.return_value = "mocked"
        result = function_under_test()
        assert result == "mocked"
```

---

## Exception Testing

```python
def test_raises_value_error() -> None:
    with pytest.raises(ValueError):
        parse_age(-1)


def test_raises_with_message() -> None:
    with pytest.raises(ValueError, match="Age must be positive"):
        parse_age(-1)


def test_raises_subclass() -> None:
    # Also catches subclasses
    with pytest.raises(OSError):
        read_missing_file()


# Test that no exception is raised
def test_does_not_raise() -> None:
    # Just call it - if it raises, the test fails
    result = safe_parse("valid-input")
    assert result is not None
```

---

## Async Tests

```python
import pytest


@pytest.mark.asyncio
async def test_async_function() -> None:
    result = await fetch_data("https://api.example.com")
    assert result["status"] == "ok"


# Or configure globally in pyproject.toml:
# [tool.pytest.ini_options]
# asyncio_mode = "auto"
```

Install: `uv add --dev pytest-asyncio`

---

## Filesystem Tests

```python
from pathlib import Path


def test_file_creation(tmp_path: Path) -> None:
    output = tmp_path / "output.txt"
    write_report(output)
    assert output.exists()
    assert output.read_text() == "expected content"


def test_directory_structure(tmp_path: Path) -> None:
    # Create test input
    (tmp_path / "input").mkdir()
    (tmp_path / "input" / "data.csv").write_text("a,b\n1,2")

    process_directory(tmp_path / "input", tmp_path / "output")

    assert (tmp_path / "output" / "data.json").exists()
```

---

## Class-based Tests

```python
class TestMyService:
    """Group related tests by feature or class."""

    @pytest.fixture(autouse=True)
    def setup(self) -> None:
        """Run before each test in this class."""
        self.service = MyService()

    def test_basic_operation(self) -> None:
        result = self.service.do_thing("input")
        assert result == "expected"

    def test_error_case(self) -> None:
        with pytest.raises(ValueError):
            self.service.do_thing(None)  # type: ignore[arg-type]

    def test_with_fixture(self, tmp_path: Path) -> None:
        # Can still use pytest fixtures alongside autouse
        self.service.save(tmp_path / "output.txt")
```

---

## Markers and Selective Runs

```python
import pytest


@pytest.mark.slow
def test_heavy_computation() -> None:
    ...


@pytest.mark.integration
def test_database_roundtrip() -> None:
    ...


@pytest.mark.skip(reason="not implemented yet")
def test_future_feature() -> None:
    ...


@pytest.mark.skipif(sys.platform == "win32", reason="Unix only")
def test_unix_paths() -> None:
    ...
```

```bash
# Run all except slow
uv run pytest -m "not slow"

# Run only integration
uv run pytest -m integration

# Skip marked tests in CI
uv run pytest -m "not integration"
```

---

## Snapshot / Approval Testing

For complex outputs that are hard to assert manually:

```python
# Using pytest-snapshot (uv add --dev pytest-snapshot)
def test_report_format(snapshot) -> None:
    result = generate_report(sample_data)
    snapshot.assert_match(result, "report.txt")
```

```bash
# Update snapshots
uv run pytest --snapshot-update
```

---

## Test Organization Principles

| Rule | Explanation |
|---|---|
| One behavior per test | Test one thing; use parametrize for variations |
| AAA structure | Arrange → Act → Assert, with blank lines |
| Descriptive names | `test_returns_none_when_input_is_empty` |
| No test order dependence | Each test must be independently runnable |
| Mock at boundaries | External IO, DB, network, time |
| Don't test implementation | Test observable behavior |
| Prefer `tmp_path` | Over manual `os.makedirs`/cleanup |
| Prefer `monkeypatch` | Over `patch` for env vars and simple attrs |
| Use `autouse=True` sparingly | Only for truly universal setup |

---

## Common Gotchas

```python
# BAD - fixture not requested
def test_something():
    mock = MagicMock()  # not cleaned up

# GOOD - use fixture
def test_something(mocker):  # pytest-mock
    mock = mocker.patch("module.function")

# BAD - assert inside loop without context
for item in items:
    assert item > 0  # hard to debug which one failed

# GOOD - parametrize or collect failures
@pytest.mark.parametrize("item", items)
def test_item_positive(item):
    assert item > 0

# BAD - time.sleep in tests
def test_async_thing():
    trigger_async()
    time.sleep(0.5)  # flaky
    assert result_ready()

# GOOD - poll or use proper async
async def test_async_thing():
    result = await asyncio.wait_for(get_result(), timeout=2.0)
    assert result is not None
```
