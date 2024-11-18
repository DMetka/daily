from email.policy import default
from django.db import models
from django.contrib.auth.models import User
from datetime import date

class Folders(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=35)


class Tasks(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=25)
    full_text = models.TextField(max_length=250)
    data_create = models.DateTimeField()
    data_add = models.DateField(default=date.today(), blank=True)
    data_complete = models.DateTimeField(null=True, blank=True)
    deadline = models.DateTimeField()
    folder = models.ForeignKey(Folders, on_delete=models.CASCADE, null=True, blank=True)
    priority = models.IntegerField(default=2)
    is_completed = models.BooleanField(default=False)


    def save(self, *args, **kwargs):
        if not self.user:
            self.user = kwargs.get('user')
        super().save(*args, **kwargs)


    def __str__(self):
        return f'{self.title} - {"Завершена" if self.is_completed == True else "Не завершена"}'


    class Meta:
        verbose_name = 'Задача'
        verbose_name_plural = 'Задачи'