from django.db import models
from api.models import MiniPillar, User


class MinipillarFile(models.Model):
    file = models.FileField(upload_to='temp/file/')
    
    class Meta:
        db_table = "minipillarfile"
