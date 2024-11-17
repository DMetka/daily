from django.contrib import admin
from .models import Tasks, Folders


@admin.register(Tasks)
class TasksAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'user', 'deadline', 'is_completed')
    list_filter = ('id', 'is_completed', 'deadline', 'priority')
    search_fields = ('id', 'title')
    list_per_page = 10


@admin.register(Folders)
class TasksAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'user')
