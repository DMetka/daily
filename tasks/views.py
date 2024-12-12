import json
from collections import OrderedDict
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render
from .models import *
from django.utils import timezone
from django.contrib.auth.decorators import login_required
from datetime import date, timedelta, datetime
from collections import OrderedDict


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
    data_start = timezone.now()
    data_end = data_start + timedelta(days=3)

    tasks = Tasks.objects.filter(data_add__range=(data_start, data_end))

    date_range = OrderedDict()
    current_date = data_start.date()
    while current_date <= data_end.date():
        date_range[current_date] = []
        current_date += timedelta(days=1)

    for task in tasks:
        task_date = task.data_add
        if task_date in date_range:
            date_range[task_date].append(task)

    return render(request, 'tasks/index.html', {'grouped_tasks': date_range})


def my_tasks(request):
    data =  {
        'title' : 'Мои задачи',
    }
    return render(request, 'tasks/my_tasks.html', data)

def my_folders(request):
    data =  {
        'title' : 'Мои папки',
    }
    return render(request, 'tasks/my_folders.html', data)


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


@login_required
def get_now_week(request):
    start_date_str = request.GET.get('start_date')
    if not start_date_str:
        return JsonResponse({'error': 'start_date is required'}, status=400)

    try:
        today = datetime.strptime(start_date_str, '%Y-%m-%d').date()
    except ValueError:
        return JsonResponse({'error': 'Invalid start_date format'}, status=400)

    start_of_week = today - timedelta(days=today.weekday())  # Понедельник текущей недели
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
            return JsonResponse({'message': 'No find such user'}, status=401)

        try:
            data = json.loads(request.body)
            title = data.get('title')
            full_text = data.get('full_text')
            deadline = data.get('deadline')
            data_add = data.get('data_add')
            folder_id = data.get('folder')
            priority = data.get('priority')
            is_completed = data.get('is_completed', False)

        except json.JSONDecodeError:
            return JsonResponse({'message': 'Invalid JSON format'}, status=402)

        folder_instance = get_object_or_404(Folders, pk=folder_id) if folder_id else None

        if not title and not full_text and not deadline and not priority:
            return JsonResponse({'message': 'No find such task'}, status=403)

        try:
            date_obj = datetime.strptime(data_add, "%d.%m.%Y")
            data_add = date_obj.strftime("%Y-%m-%d")
        except ValueError:
            return JsonResponse({'message': 'Неверный формат даты. Дата должна быть в формате DD.MM.YYYY.'}, status=403)


        if is_completed:
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
            data_add=data_add,
            folder=folder_instance,
            priority=priority,
            is_completed=is_completed,
            data_complete=data_complete
        )

        return JsonResponse({'message': 'Good job'}, status=201)

    else:
        return JsonResponse({'message': 'This method false'}, status=404)


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


def task_date(request):
    data = json.loads(request.body)
    data_start_str = data.get('dateStart')
    print(data_start_str)

    try:
        data_start = datetime.strptime(data_start_str, "%d.%m.%Y")
    except ValueError:
        return JsonResponse({'message': 'Неверный формат даты. Дата должна быть в формате DD.MM.YYYY.'}, status=403)

    data_end = data_start + timedelta(days=3)

    tasks = Tasks.objects.filter(data_add__range=(data_start, data_end))

    date_range = OrderedDict()
    current_date = data_start.date()
    while current_date <= data_end.date():
        date_range[current_date.strftime("%Y-%m-%d")] = []
        current_date += timedelta(days=1)

    for task in tasks:
        task_date = task.data_add
        task_date_str = task_date.strftime("%Y-%m-%d")
        if task_date_str in date_range:
            date_range[task_date_str].append({
                'id': task.id,
                'name': task.title,
                'data_add': task_date_str,
            })

    return JsonResponse({'tasks': date_range})

@login_required
def search_tasks(request):
    if request.method == 'GET':
        query = request.GET.get('q', '')  # Получаем поисковый запрос из параметров GET
        if query:
            # Фильтруем задачи по заголовку, игнорируя регистр
            tasks = Tasks.objects.filter(title__icontains=query, user=request.user)
        else:
            tasks = Tasks.objects.none()  # Если нет запроса, возвращаем пустой QuerySet

        # Формируем список задач для отправки в ответе
        tasks_list = [{'id': task.id, 'title': task.title, 'full_text': task.full_text, 'data_add': task.data_add} for task in tasks]
        return JsonResponse({'tasks': tasks_list})
    else:
        return JsonResponse({'message': 'Invalid request method'}, status=400)


@login_required
def add_folder(request):
    if request.method == 'POST':
        user = request.user

        if not User.objects.filter(pk=user.id).exists():
            return JsonResponse({'message': 'No find such user'}, status=400)

        try:
            data = json.loads(request.body)
            title = data.get('title')
        except json.JSONDecodeError:
            return JsonResponse({'message': 'Invalid JSON format'}, status=400)

        if Folders.objects.filter(user=user, title=title).exists():
            return JsonResponse({'message': 'Folder with this name already exists'}, status=400)

        Folders.objects.create(
            user=user,
            title=title,
        )

        return JsonResponse({'message': 'Good job'}, status=201)

    else:
        return JsonResponse({'message': 'This method false'}, status=400)


@login_required
def folder_view(request):
    folders = Folders.objects.filter(user=request.user)  # Фильтруем по текущему пользователю
    print(folders)  # Для отладки, выводим в консоль
    return render(request, 'tasks/index.html', {'folders': folders})