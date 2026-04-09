import os

from django.contrib import admin

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def _get_version():
    version_file = os.path.join(BASE_DIR, ".version")
    if os.path.isfile(version_file):
        with open(version_file) as f:
            return f.read().strip()
    return "unknown"


def configure_admin_site():
    version = _get_version()
    admin.site.site_url = "https://expenses.rivit.dev"
    admin.site.site_title = "ExpensesTracker"
    admin.site.site_header = f"ExpensesTracker ({version})"
