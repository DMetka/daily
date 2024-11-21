import json
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render
from .models import *
from django.utils import timezone
from django.contrib.auth.decorators import login_required
from datetime import date, timedelta


@login_required
def delete_task(request, task_id):
    user = request.user
    remind_task(request)
    task = get_object_or_404(Tasks, id=task_id, user=user)
    task.delete()
    return JsonResponse({'success': True})


@login_required
def remind_task(request):
    remind_deadline = timezone.now() + timezone.timedelta(days=1)
    reminders = Tasks.objects.filter(deadline__lt=remind_deadline, is_completed=False).values()
    return JsonResponse({'reminders': list(reminders)})


@login_required
def delete_tasks_from_folder(request):
    user = request.user
    folders = user.folders.all()

    for folder in folders:
        folder.tasks.all().delete()

    return JsonResponse({'success': True})


'''def main_page(request):
    return JsonResponse({'success': True})'''


def index(request):
    data =  {
        'title' : 'Главная страница',
    }
    return render(request, 'tasks/index.html', data)


@login_required
def sort_by_priority(request):
    user = request.user
    tasks = Tasks.objects.filter(user=user).order_by('priority').values()
    return JsonResponse({'tasks':  list(tasks)})


@login_required
def sort_by_status(request):
    user = request.user
    tasks = Tasks.objects.filter(user=user).order_by('is_completed').values()
    return JsonResponse({'tasks':  list(tasks)})


@login_required
def sort_by_title(request):
    user = request.user
    tasks = Tasks.objects.filter(user=user).order_by('title').values()
    return JsonResponse({'tasks':  list(tasks)})


@login_required
def sort_by_folders(request):
    user = request.user
    tasks = Tasks.objects.filter(user=user).order_by('folders').values()
    return JsonResponse({'tasks':  list(tasks)})


@login_required
def sort_by_deadline(request):
    user = request.user
    tasks = Tasks.objects.filter(user=user).order_by('deadline').values()
    return JsonResponse({'tasks':  list(tasks)})


@login_required
def filter_by_priority(request):
    user = request.user
    priority = request.GET.get('priority')
    tasks = Tasks.objects.all().filter(priority=priority, user=user).values()
    return JsonResponse({'tasks':  list(tasks)})


@login_required
def filter_by_deadline(request):
    user = request.user
    deadline = request.GET.get('deadline')
    tasks = Tasks.objects.all().filter(deadline__startswith=deadline, user=user).values()
    return JsonResponse({'tasks':  list(tasks)})


@login_required
def filter_by_folders(request):
    user = request.user
    folders = request.GET.get('folders')
    tasks = Tasks.objects.all().filter(folders=folders, user=user).values()
    return JsonResponse({'tasks':  list(tasks)})


@login_required
def filter_by_status(request):
    user = request.user
    is_completed = request.GET.get('is_completed')
    tasks = Tasks.objects.all().filter(is_completed=is_completed, user=user).values()
    return JsonResponse({'tasks':  list(tasks)})


@login_required
def get_now_week(request):
    today = date.today()
    user = request.user
    start_of_week = today - timedelta(days=today.weekday())
    end_of_week = start_of_week + timedelta(days=6)
    tasks = Tasks.objects.filter(data_add__range=[start_of_week, end_of_week], user=user).values()
    return JsonResponse({'tasks':  list(tasks)})


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
            #folder = data.get('folder')
            priority = data.get('priority')
            is_completed = data.get('is_completed', False)

        except json.JSONDecodeError:
            return JsonResponse({'message': 'Invalid JSON format'}, status=400)

        #if not title and not full_text and not deadline and not folder and not priority:
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
            #folder=folder,
            priority=priority,
            is_completed=is_completed,
            data_complete=data_complete
        )

        return JsonResponse({'message': 'Good job'}, status=201)

    else:
        return JsonResponse({'message': 'This method false'}, status=400)


@login_required
def task_completed(request, task_id):
    task = get_object_or_404(Tasks, id=task_id)
    task.mark_as_completed()
    return JsonResponse({"success": True})


