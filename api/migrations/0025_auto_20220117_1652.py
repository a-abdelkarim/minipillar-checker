# Generated by Django 3.0.6 on 2022-01-17 16:52

from django.db import migrations
import sorl.thumbnail.fields


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0024_minipillar_checked'),
    ]

    operations = [
        migrations.AlterField(
            model_name='minipillar',
            name='image',
            field=sorl.thumbnail.fields.ImageField(default='static/upload/imgs/no_img.png', upload_to='static/upload/imgs/'),
        ),
    ]