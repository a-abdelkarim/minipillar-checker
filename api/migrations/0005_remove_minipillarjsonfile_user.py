# Generated by Django 3.0.6 on 2022-01-06 10:23

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_auto_20220106_1009'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='minipillarjsonfile',
            name='user',
        ),
    ]