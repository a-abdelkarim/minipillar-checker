# Generated by Django 3.0.6 on 2022-01-17 15:52

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0017_auto_20220117_1355'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='minipillar',
            name='checked',
        ),
    ]
