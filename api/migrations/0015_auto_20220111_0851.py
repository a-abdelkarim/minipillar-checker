# Generated by Django 3.0.6 on 2022-01-11 08:51

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0014_auto_20220111_0844'),
    ]

    operations = [
        migrations.RenameField(
            model_name='minipillar',
            old_name='filename',
            new_name='image',
        ),
    ]