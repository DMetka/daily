from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name = 'home'),
    path('add_task', views.add_task, name='add_task'),
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
    path('get_now_week', views.get_now_week, name='get_now_week'),
    path('get_now_month', views.get_now_month, name='get_now_month'),
    path('task_completed/<int:task_id>/', views.task_completed, name='task_completed'),
    path('get_now_four_days', views.get_now_four_days, name='get_now_four_days'),
    path('forgotten_task', views.forgotten_task, name='forgotten_task'),
]

