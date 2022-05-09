from django.db import models


class MinipillarFile(models.Model):
    file = models.FileField(upload_to='temp/file/')
    
    class Meta:
        db_table = "minipillarfile"
