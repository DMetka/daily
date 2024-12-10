
import datetime
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Folders',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=35)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Tasks',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=150)),
                ('full_text', models.TextField(max_length=250)),
                ('data_create', models.DateTimeField()),
                ('data_add', models.DateField(blank=True, default=datetime.date(2024, 12, 9))),
                ('data_complete', models.DateTimeField(blank=True, null=True)),
                ('deadline', models.DateField()),
                ('priority', models.IntegerField(default=2)),
                ('is_completed', models.BooleanField(default=False)),
                ('subtask_one', models.CharField(blank=True, max_length=100, null=True)),
                ('subtask_two', models.CharField(blank=True, max_length=100, null=True)),
                ('subtask_three', models.CharField(blank=True, max_length=100, null=True)),
                ('subtask_four', models.CharField(blank=True, max_length=100, null=True)),
                ('folder', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='tasks.folders')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Задача',
                'verbose_name_plural': 'Задачи',
            },
        ),
    ]
