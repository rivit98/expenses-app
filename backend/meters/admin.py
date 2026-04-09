from django.contrib import admin

from meters.models import Category, Meter


class MeterAdmin(admin.ModelAdmin):
    def history_date(self, obj: Meter):
        return obj.date.strftime("%Y/%m/%d")

    list_display = ("user", "read", "category", "history_date")


admin.site.register(Category)
admin.site.register(Meter, MeterAdmin)
