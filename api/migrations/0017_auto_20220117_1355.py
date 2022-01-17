# Generated by Django 3.0.6 on 2022-01-17 13:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0016_auto_20220112_1952'),
    ]

    operations = [
        migrations.AddField(
            model_name='minipillar',
            name='checked',
            field=models.CharField(default='no', max_length=10),
        ),
        migrations.AddField(
            model_name='minipillar',
            name='checked_by',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='minipillar',
            name='last_check_at',
            field=models.DateTimeField(auto_now=True),
        ),
    ]