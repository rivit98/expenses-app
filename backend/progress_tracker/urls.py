from django.contrib import admin
from django.urls import include, path

from progress_tracker.admin import configure_admin_site

urlpatterns = [
    path("admin/", admin.site.urls),
    path("expenses/", include("expenses.urls")),
    path("auth/", include("auth.urls")),
    path("user/", include("user.urls")),
]

configure_admin_site()
