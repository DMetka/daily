import json
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render
from .models import *
from django.utils import timezone
from django.contrib.auth.decorators import login_required
from datetime import date, timedelta, datetime


@login_required
def delete_task(request, task_id):
    user = request.user
    remind_task(request)
    task = get_object_or_404(Tasks, id=task_id, user=user)
    task.delete()
    return JsonResponse({'success': True})


@login_required
def remind_task(request):
    remind_deadline = date.today()
    reminders = Tasks.objects.filter(deadline=remind_deadline, is_completed=False).values()
    return JsonResponse({'reminders': list(reminders)})


@login_required
def forgotten_task(request):
    forget_deadline = date.today()
    forgottens = Tasks.objects.filter(deadline__lt=forget_deadline, is_completed=False).values()
    return JsonResponse({'reminders': list(forgottens)})


@login_required
def delete_tasks_from_folder(request):
    user = request.user
    folders = user.folders.all()

    for folder in folders:
        folder.tasks.all().delete()

    return JsonResponse({'success': True})


def index(request):
    data =  {
        'title' : 'Главная страница',
    }
    return render(request, 'tasks/index.html', data)


def my_tasks(request):
    data =  {
        'title' : 'Мои задачи',
    }
    return render(request, 'tasks/my_tasks.html', data)


def go_back_to_index(request):
    data =  {
        'title' : 'Главная страница',
    }
    return render(request, 'tasks/index.html', data)


@login_required
def sort(request):
    user = request.user
    sort_by = request.GET.get('sort_by', 'priority')
    if sort_by == 'priority':
        tasks = Tasks.objects.filter(user=user).order_by('priority').values()
        return JsonResponse({'tasks': list(tasks)})
    if sort_by == 'status':
        tasks = Tasks.objects.filter(user=user).order_by('is_completed').values()
        return JsonResponse({'tasks': list(tasks)})
    if sort_by == 'title':
        tasks = Tasks.objects.filter(user=user).order_by('title').values()
        return JsonResponse({'tasks': list(tasks)})
    if sort_by == 'folders':
        tasks = Tasks.objects.filter(user=user).order_by('folders').values()
        return JsonResponse({'tasks': list(tasks)})
    if sort_by == 'deadline':
        tasks = Tasks.objects.filter(user=user).order_by('deadline').values()
        return JsonResponse({'tasks': list(tasks)})


@login_required
def filter(request):
    user = request.user
    filter_by = request.GET.get('filter_by', '')
    if filter_by == 'priority':
        priority = request.GET.get('priority')
        tasks = Tasks.objects.all().filter(priority=priority, user=user).values()
        return JsonResponse({'tasks': list(tasks)})
    if filter_by == 'deadline':
        deadline = request.GET.get('deadline')
        tasks = Tasks.objects.all().filter(deadline__startswith=deadline, user=user).values()
        return JsonResponse({'tasks': list(tasks)})
    if filter_by == 'folders':
        folders = request.GET.get('folders')
        tasks = Tasks.objects.all().filter(folders=folders, user=user).values()
        return JsonResponse({'tasks': list(tasks)})
    if filter_by == 'status':
        is_completed = request.GET.get('is_completed')
        tasks = Tasks.objects.all().filter(is_completed=is_completed, user=user).values()
        return JsonResponse({'tasks': list(tasks)})


def get_now_week(request):
    start_date_str = request.GET.get('start_date')
    if not start_date_str:
        return JsonResponse({'error': 'start_date is required'}, status=400)

    try:
        today = datetime.strptime(start_date_str, '%Y-%m-%d').date()
    except ValueError:
        return JsonResponse({'error': 'Invalid start_date format'}, status=400)

    start_of_week = today - timedelta(days=today.weekday())
    end_of_week = start_of_week + timedelta(days=6)

    user = request.user
    tasks = Tasks.objects.filter(data_add__range=[start_of_week, end_of_week], user=user).values()

    return JsonResponse({'tasks': list(tasks)})


@login_required
def get_now_month(request):
    today = date.today()
    user = request.user
    start_of_month = today.replace(day=1)
    if today.month == 12:
        end_of_month = today.replace(month=12, day=31)
    else:
        next_month = today.replace(month=today.month + 1, day=1)
        end_of_month = next_month - timedelta(days=1)
    tasks = Tasks.objects.filter(data_add__range=[start_of_month, end_of_month], user=user).values()
    return JsonResponse({'tasks':  list(tasks)})


def add_task(request):
    if request.method == 'POST':
        user = request.user

        if not User.objects.filter(pk=user.id).exists():
            return JsonResponse({'message': 'No find such user'}, status=400)

        try:
            data = json.loads(request.body)
            title = data.get('title')
            full_text = data.get('full_text')
            deadline = data.get('deadline')
            folder_id = data.get('folder')
            priority = data.get('priority')
            is_completed = data.get('is_completed', False)
            data_add = data.get('data_add')


        except json.JSONDecodeError:
            return JsonResponse({'message': 'Invalid JSON format'}, status=400)

        folder_instance = get_object_or_404(Folders, pk=folder_id) if folder_id else None

        if not title and not full_text and not deadline and not priority:
            return JsonResponse({'message': 'No find such task'}, status=400)

        if is_completed == True:
            data_complete = timezone.now()
        else:
            data_complete = None

        data_create = timezone.now()

        Tasks.objects.create(
            user=user,
            title=title,
            full_text=full_text,
            data_create=data_create,
            deadline=deadline,
            folder=folder_instance,
            priority=priority,
            is_completed=is_completed,
            data_complete=data_complete,
            data_add =data_add,

        )

        return JsonResponse({'message': 'Good job'}, status=201)

    else:
        return JsonResponse({'message': 'This method false'}, status=400)


@login_required
def task_completed(request, task_id):
    task = get_object_or_404(Tasks, id=task_id)
    task.mark_as_completed()
    return JsonResponse({"success": True})


@login_required
def get_now_four_days(request):
    start_date_str = request.GET.get('start_date')
    if not start_date_str:
        return JsonResponse({'error': 'start_date is required'}, status=400)

    try:
        today = datetime.strptime(start_date_str, '%Y-%m-%d').date()
    except ValueError:
        return JsonResponse({'error': 'Invalid start_date format'}, status=400)
    user = request.user
    offset = int(request.GET.get('offset', 0))
    start = today + timedelta(days=offset)
    finish = start + timedelta(days=3)
    tasks = Tasks.objects.filter(data_add__range=[start, finish], user=user).values()
    return JsonResponse({'tasks':  list(tasks)})

@login_required
def get_all_folders(request):
    folders = Folders.objects.filter(user=request.user).values()
    return JsonResponse({'folders': list(folders)})

def get_task(request, task_id):
    if request.method == 'GET':
        # Получаем задачу по названию
        task = get_object_or_404(Tasks, title=task_id)

        # Формируем данные задачи для ответа
        task_data = {
            'id': task.id,
            'title': task.title,
            'full_text': task.full_text,
            'deadline': task.deadline.isoformat() if task.deadline else None,  # Крайний срок выполнения задачи
            'folder': task.folder.id if task.folder else None,  # Если папка есть, возвращаем ее ID
            'priority': task.priority,
            'is_completed': task.is_completed,
            'data_create': task.data_create.isoformat(),  # Дата создания
            'data_complete': task.data_complete.isoformat() if task.data_complete else None,  # Дата завершения
            'data_add': task.data_add.isoformat() if task.data_add else None,  # Дата добавления
            'user': task.user.id,  # ID пользователя задачи
        }

        return JsonResponse({'task': task_data}, status=200)

    else:
        return JsonResponse({'message': 'This method is not allowed'}, status=405)