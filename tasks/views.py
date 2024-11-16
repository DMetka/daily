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
    reminders = Tasks.objects.filter(deadline__lt=remind_deadline, is_completed=False)
    return JsonResponse({'reminders': reminders})


@login_required
def delete_tasks_from_folder(request):
    user = request.user
    folders = user.folders.all()

    for folder in folders:
        folder.tasks.all().delete()

    return JsonResponse({'success': True})


def main_page(request):
    return JsonResponse({'success': True})