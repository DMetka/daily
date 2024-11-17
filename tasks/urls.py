from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.main_page, name='main_page'),
    path('remove_task/<int:task_id>/', views.delete_task, name='delete_task'),
    path('remind_task/', views.remind_task, name='remind_task'),
    path('delete_tasks_from_folder', views.delete_tasks_from_folder, name='delete_tasks_from_folder'),
    path('sort_by_status', views.sort_by_status, name='sort_by_status'),
    path('sort_by_priority', views.sort_by_priority, name='sort_by_priority'),
    path('sort_by_title', views.sort_by_title, name='sort_by_title'),
    path('sort_by_folders', views.sort_by_folders, name='sort_by_folders'),
    path('sort_by_deadline', views.sort_by_title, name='sort_by_deadline'),
    path('filter_by_priority', views.filter_by_priority, name='filter_by_priority'),
    path('filter_by_deadline', views.filter_by_deadline, name='filter_by_deadline'),
    path('filter_by_folders', views.filter_by_folders, name='filter_by_folders'),
    path('filter_by_status', views.filter_by_status, name='filter_by_status'),
]