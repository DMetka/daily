from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.main_page, name='main_page'),
    path('remove_task/<int:task_id>/', views.delete_task, name='delete_task'),
    path('remind_task/', views.remind_task, name='remind_task'),
    path('delete_tasks_from_folder', views.delete_tasks_from_folder, name='delete_tasks_from_folder'),
]