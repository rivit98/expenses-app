from django.contrib import admin

from expenses.models import Category, Expense


class ExpenseAdmin(admin.ModelAdmin):
    def history_date(self, obj: Expense):
        return obj.date.strftime("%Y/%m/%d %H:%M:%S")

    list_display = ("user", "amount", "category", "history_date", "comment")


admin.site.register(Category)
admin.site.register(Expense, ExpenseAdmin)
