# Generated by Django 3.0.6 on 2022-01-17 17:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0025_auto_20220117_1652'),
    ]

    operations = [
        migrations.AlterField(
            model_name='minipillar',
            name='image',
            field=models.ImageField(default='static/upload/imgs/no_img.png', upload_to='static/upload/imgs/'),
        ),
    ]
