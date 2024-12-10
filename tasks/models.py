from email.policy import default
from django.db import models
from django.contrib.auth.models import User
from datetime import date


class Folders(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=35)


class Tasks(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=150)
    full_text = models.TextField(max_length=250)
    data_create = models.DateTimeField()
    data_add = models.DateField(default=date.today(), blank=True)
    data_complete = models.DateTimeField(null=True, blank=True)
    deadline = models.DateField()
    folder = models.ForeignKey(Folders, on_delete=models.SET_NULL, null=True, blank=True)
    priority = models.IntegerField(default=2)
    is_completed = models.BooleanField(default=False)
    subtask_one = models.CharField(max_length=100, null=True, blank=True)
    subtask_two = models.CharField(max_length=100, null=True, blank=True)
    subtask_three = models.CharField(max_length=100, null=True, blank=True)
    subtask_four = models.CharField(max_length=100, null=True, blank=True)


    def save(self, *args, **kwargs):
        if not self.user:
            self.user = kwargs.get('user')
        super().save(*args, **kwargs)


    def mark_as_completed(self):
        self.is_completed = True
        self.data_complete = date.today()
        self.save()


    def __str__(self):
        return f'{self.title} - {"Завершена" if self.is_completed == True else "Не завершена"}'


    class Meta:
        verbose_name = 'Задача'
        verbose_name_plural = 'Задачи'