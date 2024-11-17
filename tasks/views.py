from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render
from .models import *
from django.utils import timezone
from django.contrib.auth.decorators import login_required


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


def main_page(request):
    return JsonResponse({'success': True})


@login_required
def sort_by_priority(request):
    tasks = Tasks.objects.all().order_by('priority').values()
    return JsonResponse({'tasks':  list(tasks)})


@login_required
def sort_by_status(request):
    tasks = Tasks.objects.all().order_by('is_completed').values()
    return JsonResponse({'tasks':  list(tasks)})


@login_required
def sort_by_title(request):
    tasks = Tasks.objects.all().order_by('title').values()
    return JsonResponse({'tasks':  list(tasks)})


@login_required
def sort_by_folders(request):
    tasks = Tasks.objects.all().order_by('folders').values()
    return JsonResponse({'tasks':  list(tasks)})


@login_required
def sort_by_deadline(request):
    tasks = Tasks.objects.all().order_by('deadline').values()
    return JsonResponse({'tasks':  list(tasks)})


@login_required
def filter_by_priority(request):
    priority = request.GET.get('priority')
    tasks = Tasks.objects.all().filter(priority=priority).values()
    return JsonResponse({'tasks':  list(tasks)})


@login_required
def filter_by_deadline(request):
    deadline = request.GET.get('deadline')
    tasks = Tasks.objects.all().filter(deadline__startswith=deadline).values()
    return JsonResponse({'tasks':  list(tasks)})


@login_required
def filter_by_folders(request):
    folders = request.GET.get('folders')
    tasks = Tasks.objects.all().filter(folders=folders).values()
    return JsonResponse({'tasks':  list(tasks)})


@login_required
def filter_by_status(request):
    is_completed = request.GET.get('is_completed')
    tasks = Tasks.objects.all().filter(is_completed=is_completed).values()
    return JsonResponse({'tasks':  list(tasks)})

