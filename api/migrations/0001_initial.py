# Generated by Django 3.0.6 on 2022-01-06 08:22

from django.conf import settings
import django.contrib.auth.models
from django.db import migrations, models
import django.db.models.deletion
import django.db.models.manager
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0011_update_proxy_permissions'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('first_name', models.CharField(blank=True, max_length=30, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('email', models.CharField(max_length=256, unique=True)),
                ('type', models.CharField(choices=[('viewer', 'Viewer'), ('editor', 'User'), ('administrator', 'Administrator')], default='editor', max_length=32)),
                ('title', models.CharField(blank=True, max_length=32, null=True)),
                ('mobile', models.CharField(blank=True, max_length=64, null=True)),
                ('update', models.BooleanField(default=True)),
                ('delete', models.BooleanField(default=True)),
                ('status', models.CharField(choices=[('active', 'Active'), ('inactive', 'Inactive'), ('deleted', 'Deleted')], default='active', max_length=16)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'db_table': 'users',
            },
            managers=[
                ('items', django.db.models.manager.Manager()),
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='Area',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('latitude', models.FloatField()),
                ('longitude', models.FloatField()),
                ('radius', models.FloatField()),
                ('status', models.CharField(choices=[('active', 'Active'), ('inactive', 'Inactive'), ('deleted', 'Deleted')], default='active', max_length=16)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'db_table': 'areas',
            },
        ),
        migrations.CreateModel(
            name='Device',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=256)),
                ('dateOfBirth', models.CharField(max_length=255)),
                ('description', models.CharField(blank=True, max_length=1024, null=True)),
                ('code', models.CharField(blank=True, max_length=4, null=True)),
                ('hardware', models.CharField(blank=True, max_length=256, null=True)),
                ('status', models.CharField(choices=[('active', 'Active'), ('inactive', 'Inactive'), ('deleted', 'Deleted')], default='active', max_length=16)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'db_table': 'devices',
            },
        ),
        migrations.CreateModel(
            name='Group',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=256)),
                ('description', models.CharField(blank=True, max_length=1024, null=True)),
                ('status', models.CharField(choices=[('active', 'Active'), ('inactive', 'Inactive'), ('deleted', 'Deleted')], default='active', max_length=16)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'db_table': 'groups',
            },
        ),
        migrations.CreateModel(
            name='MiniPillar',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('code', models.CharField(max_length=255)),
                ('manuf_serial_number', models.CharField(max_length=255)),
                ('miniPillar_type', models.CharField(max_length=50)),
                ('subtype_cd', models.CharField(max_length=50)),
                ('substation_number', models.CharField(max_length=50)),
                ('feeder_number', models.CharField(max_length=50)),
                ('circuits_number', models.CharField(max_length=50)),
                ('used_circuits_number', models.CharField(max_length=50)),
                ('subMiniPilar', models.CharField(max_length=50)),
                ('manuf_code', models.CharField(max_length=50)),
                ('manuf_year', models.CharField(max_length=50)),
                ('image', models.ImageField(default='static/upload/imgs/no_img.png', upload_to='static/upload/imgs/')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('updated_by', models.CharField(max_length=50)),
                ('entrance_obstacles', models.CharField(max_length=100)),
                ('equipment_grounding', models.CharField(max_length=100)),
                ('rusted_earthing_connection', models.CharField(max_length=100)),
                ('availability_noDang_signsMono', models.CharField(max_length=100)),
                ('substation_cleanliness', models.CharField(max_length=100)),
                ('equipment_level', models.CharField(max_length=100)),
                ('bumt_marks_sparks', models.CharField(max_length=100)),
                ('oxidation_corrosions', models.CharField(max_length=100)),
                ('dust_foreignDebris', models.CharField(max_length=100)),
                ('connectors_lugs', models.CharField(max_length=100)),
                ('bumt_heatingMarksOnCable', models.CharField(max_length=100)),
                ('urgent_issue', models.CharField(max_length=100)),
                ('urgent_issue_body', models.TextField(default='Null', max_length=1000)),
                ('serious_issue', models.CharField(max_length=100)),
                ('serious_issue_body', models.TextField(default='Null', max_length=1000)),
                ('physicalCondition_dent_damages', models.CharField(max_length=20)),
                ('rust_corrosion_deterioration', models.CharField(max_length=20)),
                ('paint_condition', models.CharField(max_length=20)),
                ('gaps_slots', models.CharField(max_length=20)),
                ('locks_hinges', models.CharField(max_length=20)),
                ('latching_mechanism', models.CharField(max_length=20)),
                ('cracks_damages', models.CharField(max_length=20)),
                ('gaps_unblockCableEntry', models.CharField(max_length=20)),
                ('galvanization_bolts_nuts_screws', models.CharField(max_length=20)),
                ('grounding_bounding', models.CharField(max_length=20)),
                ('access_obstructions', models.CharField(max_length=20)),
                ('numbering_dangerSigns_monogram', models.CharField(max_length=20)),
                ('maintenance_completed', models.CharField(max_length=20)),
                ('minorRepair_made', models.CharField(max_length=20)),
                ('latitude', models.FloatField()),
                ('longitude', models.FloatField()),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
                ('device', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.Device')),
            ],
            options={
                'db_table': 'minipillars',
            },
        ),
        migrations.CreateModel(
            name='Location',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('latitude', models.FloatField()),
                ('longitude', models.FloatField()),
                ('elevation_m', models.FloatField()),
                ('time', models.CharField(max_length=255)),
                ('status', models.CharField(choices=[('active', 'Active'), ('inactive', 'Inactive'), ('deleted', 'Deleted')], default='active', max_length=16)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('area', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.Area')),
                ('device', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.Device')),
            ],
            options={
                'db_table': 'locations',
            },
        ),
        migrations.AddField(
            model_name='device',
            name='group',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.Group'),
        ),
        migrations.AddField(
            model_name='user',
            name='device',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.Device'),
        ),
        migrations.AddField(
            model_name='user',
            name='groups',
            field=models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.Group', verbose_name='groups'),
        ),
        migrations.AddField(
            model_name='user',
            name='user_permissions',
            field=models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.Permission', verbose_name='user permissions'),
        ),
    ]