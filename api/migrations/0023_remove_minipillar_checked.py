# Generated by Django 3.0.6 on 2022-01-17 16:19

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0022_minipillar_checked'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='minipillar',
            name='checked',
        ),
    ]