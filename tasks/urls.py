from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name = 'home'),
    path('my_tasks/', views.my_tasks, name='my_tasks'),
    path('my_folders/', views.get_my_folders, name='my_folders'),
    path('go_back_to_index/', views.go_back_to_index, name = 'go_back_to_index'),
    path('add_task/', views.add_task, name='add_task'),
    path('delete_task/<int:task_id>/', views.delete_task, name='delete_task'),
    path('remind_task/', views.remind_task, name='remind_task'),
    path('delete_tasks_from_folder/', views.delete_tasks_from_folder, name='delete_tasks_from_folder'),
    path('sort/', views.sort, name='sort'),
    path('filter/', views.filter, name='filter'),
    path('get_now_week/', views.get_now_week, name='get_now_week'),
    path('get_now_month/', views.get_now_month, name='get_now_month'),
    path('task_completed/<int:task_id>/', views.task_completed, name='task_completed'),
    path('get_now_four_days/', views.get_now_four_days, name='get_now_four_days'),
    path('forgotten_task/', views.forgotten_task, name='forgotten_task'),
    path('get_all_folders/', views.get_all_folders, name = 'get_all_folders'),
    path('get_now_week/', views.get_now_week, name='get_now_week'),
    path('task_date/', views.task_date),
    path('add_folder/', views.add_folder, name='add_folder'),
    path('folder_view', views.folder_view, name = 'folder_view'),
    path('task_date/', views.task_date),
    path('my_folders/add_folder/', views.add_folder, name='add_folder'),
    path('get_folder_contents/<int:folder_id>/', views.get_folder_contents, name='get_folder_contents'),
    path('search/',views.search_tasks, name = 'search_tasks'),
    path('edit_task/<int:task_id>/', views.edit_task, name='edit_task'),
    path('get_task/<int:task_id>/', views.get_task, name='get_task')

]

