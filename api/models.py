from django.db import models
from django.contrib.auth.models import AbstractUser
from sorl.thumbnail import ImageField, get_thumbnail

from app.authorization import user
from .managers import CustomUserManager, SoftDeleteManager
import uuid
import jsonfield


# -----------------(choices)------------------
class StatusChoices(models.TextChoices):
    ACTIVE = 'active'
    INACTIVE = 'inactive'
    DELETED = 'deleted'

class MiniPillarType(models.TextChoices):
    TYPE_A = "A"
    TYPE_B = "B"
    TYPE_C = "C"


class UserTypeChoices(models.TextChoices):
    VIEWER = 'viewer'
    USER = 'editor'
    ADMINISTRATOR = 'administrator'

# -----------------(models)------------------

""""""""""""""""""""""""""""""
# groups  .
""""""""""""""""""""""""""""""

class Group(models.Model):
    id = models.AutoField(primary_key=True, serialize=False)
    name = models.CharField(max_length=256, blank=False, null=False)
    description = models.CharField(max_length=1024, blank=True, null=True)

    # General
    status = models.CharField(
        max_length=16, choices=StatusChoices.choices,  default=StatusChoices.ACTIVE)
    created_at = models.DateTimeField(auto_now_add=True, null=False)
    updated_at = models.DateTimeField(auto_now=True, null=False)
    objects = SoftDeleteManager()

    class Meta:
        db_table = "groups"

    def save(self, **kwargs):
        self.full_clean()
        super().save(**kwargs)

    def clean(self):
        super().clean()

    def str(self):
        return str(self.id)

    @staticmethod
    def protected():
        return ['updated_at', 'created_at', 'status']

""""""""""""""""""""""""""""""
# areas  .
""""""""""""""""""""""""""""""
class Area(models.Model):
    id = models.AutoField(primary_key=True, serialize=False)
    latitude = models.FloatField(blank=False, null=False)
    longitude = models.FloatField(blank=False, null=False)
    radius = models.FloatField(blank=False, null=False)

    # General
    status = models.CharField(
        max_length=16, choices=StatusChoices.choices,  default=StatusChoices.ACTIVE)
    created_at = models.DateTimeField(auto_now_add=True, null=False)
    updated_at = models.DateTimeField(auto_now=True, null=False)
    objects = SoftDeleteManager()

    class Meta:
        db_table = "areas"

    def save(self, **kwargs):
        self.full_clean()
        super().save(**kwargs)

    def clean(self):
        super().clean()

    def str(self):
        return str(self.id)

    @staticmethod
    def protected():
        return ['updated_at', 'created_at', 'status']

""""""""""""""""""""""""""""""
# devices  .
""""""""""""""""""""""""""""""
class Device(models.Model):
    id = models.AutoField(primary_key=True, serialize=False)
    username = models.CharField(max_length=255, blank=False, null=False)
    user_type = models.CharField(max_length=50, blank=False, null=False)
    full_name = models.CharField(max_length=255, blank=False, null=False)
    email = models.EmailField(blank=True, null=True)
    password = models.CharField(max_length=255, blank=False, null=False)
    dateOfBirth = models.CharField(max_length=255)
    group = models.ForeignKey(Group, on_delete=models.SET_NULL,  null=True, blank=True)
    description = models.CharField(max_length=1024, blank=True, null=True)
    code = models.CharField(max_length=4, blank=True, null=True)
    hardware = models.CharField(max_length=256, blank=True, null=True)

    # General
    status = models.CharField(
        max_length=16, choices=StatusChoices.choices,  default=StatusChoices.ACTIVE)
    created_at = models.DateTimeField(auto_now_add=True, null=False)
    updated_at = models.DateTimeField(auto_now=True, null=False)
    objects = SoftDeleteManager()

    class Meta:
        db_table = "devices"

    def save(self, **kwargs):
        self.full_clean()
        super().save(**kwargs)

    def clean(self):
        super().clean()

    def str(self):
        return str(self.id)

    @staticmethod
    def protected():
        return ['updated_at', 'created_at', 'status','group']

""""""""""""""""""""""""""""""
# locations  .
""""""""""""""""""""""""""""""
class Location(models.Model):
    id = models.AutoField(primary_key=True, serialize=False)
    latitude = models.FloatField(blank=False, null=False)
    longitude = models.FloatField(blank=False, null=False)

    elevation_m = models.FloatField(blank=False, null=False)
    device = models.ForeignKey(Device, on_delete=models.SET_NULL,  null=True, blank=True)
    area = models.ForeignKey(Area, on_delete=models.SET_NULL,  null=True, blank=True)
    time = models.CharField(max_length=255)
    # time_unix = models.CharField(max_length=255)
    
    # General
    status = models.CharField(
        max_length=16, choices=StatusChoices.choices,  default=StatusChoices.ACTIVE)
    created_at = models.DateTimeField(auto_now_add=True, null=False)
    updated_at = models.DateTimeField(auto_now=True, null=False)
    objects = SoftDeleteManager()

    class Meta:
        db_table = "locations"

    def save(self, **kwargs):
        self.full_clean()
        super().save(**kwargs)

    def clean(self):
        super().clean()

    def str(self):
        return str(self.id)

    @staticmethod
    def protected():
        return ['updated_at', 'created_at', 'status']



""""""""""""""""""""""""""""""
# users  .
""""""""""""""""""""""""""""""
class User(AbstractUser):
    id = models.AutoField(primary_key=True, serialize=False)
    username = None
    email = models.CharField(
        max_length=256, blank=False, null=False, unique=True)
    type = models.CharField(
        max_length=32, choices=UserTypeChoices.choices,  default=UserTypeChoices.USER)
    title = models.CharField(max_length=32, blank=True, null=True)
    mobile = models.CharField(max_length=64, blank=True, null=True)
    device = models.ForeignKey(Device, on_delete=models.SET_NULL,  null=True, blank=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    items = CustomUserManager()
    update = models.BooleanField(default=True)
    delete = models.BooleanField(default=True)
    # General
    status = models.CharField(
        max_length=16, choices=StatusChoices.choices,  default=StatusChoices.ACTIVE)
    created_at = models.DateTimeField(auto_now_add=True, null=False)
    updated_at = models.DateTimeField(auto_now=True, null=False)

    class Meta:
        db_table = "users"

    def save(self, **kwargs):
        self.full_clean()
        super().save(**kwargs)

    def clean(self):
        super().clean()

    def str(self):
        return str(self.id)

    @staticmethod
    def protected():
        return ['updated_at', 'created_at', 'password', 'status']




""""""""""""""""""
# Mini Pillar
""""""""""""""""""

class MiniPillar(models.Model):
    id = models.AutoField(primary_key=True, serialize=False)
    #? General
    code = models.CharField(max_length=255, blank=True, null=True)
    manuf_serial_number = models.CharField(max_length=255, blank=True, null=True)
    miniPillar_type = models.CharField(max_length=50, blank=True, null=True)
    subtype_cd = models.CharField(max_length=50, blank=True, null=True)
    substation_number = models.CharField(max_length=50, blank=True, null=True)
    feeder_number = models.CharField(max_length=50, blank=True, null=True)
    circuits_number = models.CharField(max_length=50, blank=True, null=True)
    used_circuits_number = models.CharField(max_length=50, blank=True, null=True)
    subMiniPilar = models.CharField(max_length=50, blank=True, null=True)
    manuf_code = models.CharField(max_length=50, blank=True, null=True)
    manuf_year = models.CharField(max_length=50, blank=True, null=True)
    image = models.ImageField(upload_to="static/upload/imgs/", default="media/minipillar/upload/imgs/no_img.png")
    device = models.ForeignKey(Device, on_delete=models.CASCADE,  null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, null=False)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL,  null=True, blank=True)
    user = models.CharField(max_length=50,  null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=False)
    updated_by = models.CharField(max_length=50, blank=True, null=True)

    #? Visual Inspection
    entrance_obstacles = models.CharField(max_length=100, blank=True, null=True)
    equipment_grounding = models.CharField(max_length=100, blank=True, null=True)
    rusted_earthing_connection = models.CharField(max_length=100, blank=True, null=True)
    availability_noDang_signsMono = models.CharField(max_length=100, blank=True, null=True)
    substation_cleanliness = models.CharField(max_length=100, blank=True, null=True)
    #! to check
    equipment_level = models.CharField(max_length=100, blank=True, null=True)
    #!
    bumt_marks_sparks = models.CharField(max_length=100, blank=True, null=True)
    oxidation_corrosions = models.CharField(max_length=100, blank=True, null=True)
    dust_foreignDebris = models.CharField(max_length=100, blank=True, null=True)
    connectors_lugs = models.CharField(max_length=100, blank=True, null=True)
    bumt_heatingMarksOnCable = models.CharField(max_length=100, blank=True, null=True)
    urgent_issue = models.CharField(max_length=100, blank=True, null=True)
    urgent_issue_body = models.TextField(max_length=1000, default='Null', blank=True, null=True)
    serious_issue = models.CharField(max_length=100,  null=True, blank=True)
    serious_issue_body = models.TextField(max_length=1000, default='Null', blank=True, null=True)
    
    #? IR Inspection
    physicalCondition_dent_damages = models.CharField(max_length=20, blank=True, null=True)
    rust_corrosion_deterioration = models.CharField(max_length=20, blank=True, null=True)
    paint_condition = models.CharField(max_length=20, blank=True, null=True)
    gaps_slots = models.CharField(max_length=20, blank=True, null=True)
    locks_hinges = models.CharField(max_length=20, blank=True, null=True)
    latching_mechanism = models.CharField(max_length=20, blank=True, null=True)
    cracks_damages = models.CharField(max_length=20, blank=True, null=True)
    gaps_unblockCableEntry = models.CharField(max_length=20, blank=True, null=True)
    galvanization_bolts_nuts_screws = models.CharField(max_length=20, blank=True, null=True)
    grounding_bounding = models.CharField(max_length=20, blank=True, null=True)
    access_obstructions = models.CharField(max_length=20, blank=True, null=True)
    numbering_dangerSigns_monogram = models.CharField(max_length=20, blank=True, null=True)
    maintenance_completed = models.CharField(max_length=20, blank=True, null=True)
    minorRepair_made = models.CharField(max_length=20, blank=True, null=True)

    #? spatial data
    latitude = models.FloatField(blank=False, null=False)
    longitude = models.FloatField(blank=False, null=False)
    
    #? other
    # checked = models.CharField(max_length=5, default="no", blank=False, null=False)
    checked = models.BooleanField(default=False, blank=False, null=False)
    last_check_at = models.DateTimeField(auto_now=True, null=False)
    checked_by = models.CharField(max_length=100, null=True, blank=True)

    
    
    class Meta:
        db_table = "minipillars"

    def save(self, **kwargs):
        self.full_clean()
        # if self.image:
        #     self.image = get_thumbnail(self.image, '500x600', quality=25, format='JPEG')
        super().save(**kwargs)

    def clean(self):
        super().clean()

    def str(self):
        return str(self.id)

    @staticmethod
    def protected():
        return ['updated_at', 'created_at', 'status', 'created_by']


class MiniPillarJsonFile(models.Model):
    id = models.AutoField(primary_key=True, serialize=False)
    name = models.CharField(max_length=255, blank=True)
    json_object = models.TextField(max_length=4000)
    user = models.ForeignKey(User, on_delete=models.SET_NULL,  null=True, blank=True)
    username = models.CharField(max_length=50)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'minipillar_jsonfile'

