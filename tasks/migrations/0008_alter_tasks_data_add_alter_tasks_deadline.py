# Generated by Django 5.1.3 on 2024-11-20 15:50

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0007_alter_tasks_data_add'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tasks',
            name='data_add',
            field=models.DateField(blank=True, default=datetime.date(2024, 11, 20)),
        ),
        migrations.AlterField(
            model_name='tasks',
            name='deadline',
            field=models.DateField(),
        ),
    ]
