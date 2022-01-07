from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from django.utils import timezone
from decimal import Decimal

# file uploader requirements
from django.core.files.storage import FileSystemStorage

import datetime
from datetime import timedelta
import json
import os
import platform
import requests
from api.models import *
import uuid
# from shapely.geometry.polygon import Polygon
from django.db import transaction
import time
import sys
import multiprocessing


class Command(BaseCommand):

    def add_arguments(self, parser):

        parser.add_argument(
            '--dump',
            action='store_true',
            help='dump message five from API',
        )

    def handle(self, *args, **options):

        if options['dump']:

            arr = os.listdir(os.path.join(os.getcwd(), 'dump'))
            fs = FileSystemStorage()
            if(len(arr) > 0):
                for value in arr:
                    name = value.split(".")[0]
                    extension = value.split(".")[-1]
                    fileName = str(uuid.uuid4()) + '.'+extension
                    icon = Icon.objects.filter(name=name).first()

                    if not icon and name != "":
                        icon = Icon.objects.create(
                            name=name,
                            file=fileName
                        )

                        fileSource = os.path.join(
                            os.getcwd(), 'dump', value)
                        os.rename(fileSource, os.path.join(
                            os.getcwd(), "static", 'icons', fileName))
