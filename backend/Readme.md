# Expenses – backend

Django REST API for the [expenses app](../README.md). Auth is JWT; all data is scoped to the logged-in user.

## Stack

Python 3.14 · Django 6 · Django REST Framework · SimpleJWT · PostgreSQL · gunicorn + WhiteNoise · [uv](https://docs.astral.sh/uv/) · ruff

## Run locally

```bash
uv sync
export SECRET_KEY=dev DEBUG=True DATABASE_URL=postgres://user:pass@localhost:5432/expenses
uv run python manage.py migrate
uv run python manage.py createsuperuser   # users are managed via /admin/
uv run python manage.py runserver 5002
```

Or use the dev image: [`Dockerfile`](./Dockerfile).

## Configuration

| Variable | Default | Notes |
| --- | --- | --- |
| `SECRET_KEY` | – | required |
| `DATABASE_URL` | – | required, e.g. `postgres://…` |
| `DEBUG` | `False` | set to `True` for development |
| `ALLOWED_HOSTS` | `eb.rivit.dev,localhost,127.0.0.1` | comma-separated |
| `CORS_ALLOWED_ORIGINS` | `https://expenses.rivit.dev`, `localhost:3000`, `localhost:5173` | comma-separated |

## API

All routes except login/refresh need `Authorization: Bearer <access token>`. Rate limit: 60 req/min.

| Method | Path | Description |
| --- | --- | --- |
| POST | `/auth/v1/login/` · `/auth/v1/refresh/` | obtain / refresh JWT |
| GET | `/user/v1/me/` | current user |
| GET | `/expenses/v1/categories/` | expense categories |
| GET, POST | `/expenses/v1/expenses/` | list / create expenses |
| GET, POST | `/expenses/v1/expenses/<year>/<month>/` | expenses for a month |
| GET, PUT, DELETE | `/expenses/v1/expenses/<id>/` | single expense |
| GET | `/expenses/v1/expenses/summary/` | monthly totals per category |
| GET | `/meters/v1/categories/` | meter categories (with units) |
| GET, POST | `/meters/v1/meters/` | list / create readings |
| GET, PUT, DELETE | `/meters/v1/meters/<id>/` | single reading |

## Lint

```bash
uv run ruff check .
```

## Production

[`prod.Dockerfile`](./prod.Dockerfile) runs `collectstatic` + gunicorn on port 5002 via [`run.sh`](./run.sh).
It does not migrate: run `python manage.py migrate` separately.
