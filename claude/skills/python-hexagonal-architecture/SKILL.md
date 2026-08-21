---
name: python-hexagonal-architecture
description: Use for Python backend architecture, service boundaries, dependency injection, Protocol ports, adapters, decorators such as @service or @stage, and event-driven pipelines modeled after rauditor-backend-template.
---

# Python Hexagonal Architecture

Use this skill when designing or extending a Python backend whose architecture should follow Sergio's `rauditor-backend-template` pattern. Treat the template as a reference implementation, not as code to copy blindly:

`/Users/sergio/projects/rauditor-backend-template`

Inspect the target repository first. Preserve its established architecture when it conflicts with this guidance, and introduce only the pieces required by the task.

## Architectural Intent

Keep application entry points and workflow orchestration dependent on typed abstractions rather than concrete infrastructure. Put concrete implementations behind ports and assemble the object graph in one composition root.

This is a pragmatic hexagonal architecture:

- `typing.Protocol` classes are ports and define consumer-owned contracts.
- `services/integrations/` contains adapters for external systems.
- `services/core/` contains domain or project-specific implementations.
- `services/orchestration/` coordinates reusable workflows without becoming an infrastructure adapter.
- Handlers and pipeline stages remain thin and resolve or receive abstractions.
- Decorators register implementations and extension points declaratively.
- A central, lazy injector binds ports to singleton implementations.

## Dependency Direction

Dependencies point inward toward contracts and domain models:

```text
handlers / stages -> protocols + models <- services
                                ^
                                |
                         composition root
```

Apply these rules:

- Import protocols from the interfaces module, never from concrete service modules.
- Type constructor dependencies as protocols or stable application types.
- Keep SDK clients, persistence details, and vendor-specific behavior inside adapters.
- Keep handlers focused on transport concerns: decode input, invoke an application service, encode output.
- Keep orchestration separate from domain decisions and external API details.
- Do not use the injector as a service locator deep inside business logic. Prefer constructor injection there.

## Suggested Layout

Adapt names to the project rather than forcing this exact tree:

```text
package/
  models/
  services/
    interfaces/protocols.py
    core/
    integrations/
    orchestration/
  shared/
    decorators.py
    settings.py
  lambdas/ or entrypoints/
    ...
```

## Ports And Adapters

Define the smallest contract required by the consumer:

```python
from typing import Protocol


class DocumentStoreProtocol(Protocol):
    def save(self, document: Document) -> None: ...
```

Implement the port without inheriting from it unless runtime behavior requires inheritance:

```python
@service(DocumentStoreProtocol)
class S3DocumentStore:
    @inject
    def __init__(self, settings: Settings) -> None:
        self._bucket = settings.S3_BUCKET

    def save(self, document: Document) -> None:
        ...
```

Keep protocols cohesive. Do not create one interface per class mechanically, and do not expose an entire vendor SDK through a protocol.

## Declarative Registration

Use a decorator-backed registry when it makes bindings easy to discover and override:

```python
_service_registry: dict[type, type] = {}


def service(protocol: type):
    def decorator(cls: type) -> type:
        _service_registry[protocol] = cls
        return cls

    return decorator
```

Registration modules must be imported before the injector is built. Make that side effect explicit in the service package and import project-specific bindings last only when last-registration-wins overrides are intentional.

Use the same mechanism for ordered extension points only when the workflow genuinely benefits from pluggable stages:

```python
@stage(order=40)
class EvaluateStage:
    @inject
    def __init__(self, evaluator: EvaluatorProtocol) -> None:
        self._evaluator = evaluator
```

Avoid hidden registration for ordinary utilities and classes that do not participate in dependency inversion or extension discovery.

## Composition Root

Build bindings in one place. Bind configuration and expensive SDK clients once, then bind every registered protocol to its implementation, normally as singletons for serverless execution:

```python
def build_injector() -> Injector:
    def configure(binder: Binder) -> None:
        settings = Settings()
        binder.bind(Settings, to=settings, scope=singleton)

        for protocol, implementation in get_services():
            binder.bind(protocol, to=implementation, scope=singleton)

    return Injector([configure])
```

Lazy construction is appropriate when imports or clients are expensive and not every entry point uses them. Keep the lazy wrapper minimal and expose only the operations the application needs.

## Overrides And Testing

Registration order may support project overrides, but it must be deterministic and documented. Prefer explicit test bindings when tests need fakes:

- Replace a port at the composition root rather than patching concrete internals.
- Unit-test core services with hand-written fakes satisfying the protocols.
- Test registry and composition behavior separately from domain behavior.
- Add a focused test when changing import order, binding scope, or decorator registration.

## Reference Files

Consult these files when exact behavior matters:

- `PROJECT_NAME/services/README.md`: service areas and resolution flow.
- `PROJECT_NAME/services/interfaces/protocols.py`: port definitions.
- `PROJECT_NAME/shared/decorators.py`: service and stage registries.
- `PROJECT_NAME/shared/settings.py`: lazy composition root and singleton bindings.
- `PROJECT_NAME/services/__init__.py`: deterministic registration imports.
- `PROJECT_NAME/lambdas/processor/pipeline.py`: ordered stage resolution.

## Guardrails

- Do not add dependency injection to a small module that is clearer with direct construction.
- Do not introduce registries without a concrete replacement, discovery, or extension need.
- Do not mix transport models, domain models, and vendor payloads without an explicit boundary.
- Do not let `shared/` become a catch-all; move domain behavior into `core` and external behavior into `integrations`.
- Do not perform network or database work at import time; registration at import time should only record types.
- Prefer the smallest change that improves dependency direction and testability.
