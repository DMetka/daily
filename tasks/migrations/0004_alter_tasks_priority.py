# Generated by Django 5.1.3 on 2024-11-17 22:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0003_alter_tasks_data_complete'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tasks',
            name='priority',
            field=models.IntegerField(default=2),
        ),
    ]
