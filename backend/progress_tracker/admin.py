from django.contrib import admin


def configure_admin_site():
    admin.site.site_url = "https://pt.rivit.dev"
    admin.site.site_title = "ProgressTracker"
