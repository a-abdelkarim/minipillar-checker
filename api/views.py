from re import template
from rest_framework import viewsets
from django.shortcuts import render
from django.core import serializers
from django.db.models import Q
import uuid
import json
import time
import datetime
from datetime import timedelta
from django.utils import timezone
from django.conf import settings
from django.http import HttpResponseRedirect
# login
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.parsers import FileUploadParser, MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from rest_framework import status
import rest_framework.views as views
from rest_framework.decorators import parser_classes, api_view, permission_classes, authentication_classes, action
from app.rest_condition import Or
from django.db import IntegrityError, transaction
import os.path
import hashlib
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib.auth.hashers import check_password
# geo
import pyproj
import random
from functools import partial
from shapely.geometry import shape, GeometryCollection, Point
from shapely.geometry.polygon import Polygon
from shapely.ops import transform
import shapely
from turfpy.measurement import nearest_point

# models
from .models import *
# serializers
from api.serializers import *
from app.apiResponse import prepareResponse
from app.authorization import administrator, user, viewer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
# http response
from django.http import FileResponse, Http404

##########################
import os
from datetime import timezone
import time
import geojson
#########################
from modules.geography import Geography


""""""""""""""""""""""""""""""
# api ResponseSchema
""""""""""""""""""""""""""""""


def createResponseSchema(serializer):
    return {201: serializer(many=False), 422: 'Unprocessable entity'}


def updateResponseSchema(serializer):
    return {201: serializer(many=False),
            404: "Id is not exist or deleted from the database", 422: 'Unprocessable entity'}


def recordsResponseSchema(serializer):
    return {200:  serializer(many=True)}


def listResponseSchema(serializer):
    return {200:  serializer(many=True)}


def recordResponseSchema(serializer):
    return {200: serializer(many=False),
            404: "Id is not exist or deleted from the database"}


def deleteResponseSchema():
    return {200: 'Records data'}


def generate_random(polygon):
    points = []
    minx, miny, maxx, maxy = polygon.bounds
    while len(points) < 100:
        pnt = Point(random.uniform(minx, maxx), random.uniform(miny, maxy))
        if polygon.contains(pnt):
            return pnt


def geodesic_point_buffer(lat, lon, km):
    proj_wgs84 = pyproj.Proj('+proj=longlat +datum=WGS84')
    # Azimuthal equidistant projection
    aeqd_proj = '+proj=aeqd +lat_0={lat} +lon_0={lon} +x_0=0 +y_0=0'
    project = partial(
        pyproj.transform,
        pyproj.Proj(aeqd_proj.format(lat=lat, lon=lon)),
        proj_wgs84)
    buf = Point(0, 0).buffer(km * 1000)  # distance in metres
    return transform(project, buf).exterior.coords[:]


""""""""""""""""""""""""""""""
# Auth  .
""""""""""""""""""""""""""""""


class login(ObtainAuthToken, viewsets.ModelViewSet):
    parser_classes = [JSONParser]
    authentication_classes = []
    permission_classes = []

    @swagger_auto_schema(
        tags=(['auth']),
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'username': openapi.Schema(type=openapi.TYPE_STRING, description='string'),
                'password': openapi.Schema(format=openapi.FORMAT_PASSWORD, type=openapi.TYPE_STRING, description='string'),
            }
        ))
    @action(detail=True, methods=['POST'])
    def login(self, request):
        serializer = self.serializer_class(
            data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': UserSerializer(user).data
        })


class auth(ObtainAuthToken, viewsets.ModelViewSet):
    parser_classes = [JSONParser]
    authentication_classes = []
    permission_classes = []

    @swagger_auto_schema(
        tags=(['auth']),
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'username': openapi.Schema(type=openapi.TYPE_STRING, description='string'),
                'password': openapi.Schema(format=openapi.FORMAT_PASSWORD, type=openapi.TYPE_STRING, description='string'),
            }
        ))
    @action(detail=True, methods=['POST'])
    def login(self, request):
        serializer = self.serializer_class(
            data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token = Token.objects.filter(user=user).first()
        # if token:
        #     token.delete()
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': UserSerializer(user).data
        })

    @swagger_auto_schema(
        tags=(['auth']),
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'old_password': openapi.Schema(format=openapi.FORMAT_PASSWORD, type=openapi.TYPE_STRING, description='string'),
                'new_password': openapi.Schema(format=openapi.FORMAT_PASSWORD, type=openapi.TYPE_STRING, description='string'),
            }
        ))
    @action(detail=True, methods=['POST'])
    def changePassword(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            # Check old password
            old_password = serializer.data.get("old_password")
            if not request.user.check_password(old_password):
                return Response(prepareResponse({"status": 422, "instance": "logs/error"}, [["old_password", ["Wrong password."]]], False), 422)

            # set_password also hashes the password that the user will get
            request.user.set_password(serializer.data.get("new_password"))
            request.user.save()
            return Response(prepareResponse({"message": 'Your password was successfully updated!'}, {}), 201)

        return Response(prepareResponse({"status": 422, "instance": "logs/error"}, [["new_password", ['The password does not meet the password policy requirements']]], False), 422)

    @swagger_auto_schema(
        tags=(['auth']),
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'first_name': openapi.Schema(type=openapi.TYPE_STRING, description='string'),
                'last_name': openapi.Schema(type=openapi.TYPE_STRING, description='string'),
                'email': openapi.Schema(type=openapi.TYPE_STRING, description='string'),
                'mobile': openapi.Schema(type=openapi.TYPE_STRING, description='string'),
            }
        ))
    @action(detail=True, methods=['PUT'])
    def updateUserInfo(self, request):
        item = User.objects.filter(id=request.user.id).update(
            first_name=request.data['first_name'],
            last_name=request.data['last_name'],
            email=request.data['email'],
            mobile=request.data['mobile'],
        )
        if(item):
            return Response(prepareResponse({"message": 'Your information was successfully updated!'}, {}), 201)

        return Response(prepareResponse({"status": 400, "instance": "logs/error"}, {'error': 'error'}, False), 400)

    @swagger_auto_schema(
        tags=(['auth']),
        responses=recordResponseSchema(UserSerializer)
    )
    @action(detail=True, methods=['GET'])
    def logout(self, request):
        """
        GET user by id .
        """
        token = Token.objects.filter(user=request.user).first()
        if token != None:
            token.delete()
        return Response(prepareResponse({}, {}))


""""""""""""""""""""""""""""""
# users  .
""""""""""""""""""""""""""""""


class users(viewsets.ModelViewSet):
    permission_classes = [viewer] #[adminstartor]
    parser_classes = [JSONParser]
    serializer_class = UserSerializer

    @swagger_auto_schema(
        tags=(['users']),
        responses=recordsResponseSchema(UserSerializer)
    )
    @action(detail=True, methods=['GET'])
    def records(self, request):
        """
        List all users.
        """
        # GET total records
        items = User.objects.exclude(status=StatusChoices.DELETED).all()
        total = items.count()
        # create pegnation [ start record ]
        start = ((0 if ('page' not in request.GET)
                  else int(request.GET['page']) - 1)) * settings.PER_PAGE
        # create pegnation [ end record ]
        end = start + settings.PER_PAGE

        # sort update
        if 'order' in request.GET:
            if request.GET['order'].find('asc') != -1:
                order = "-" + request.GET['order'].split('.')[0]
            else:
                order = request.GET['order'].split('.')[0]
        else:
            # if not order data will order by ID DESC
            order = '-id'

        # multi search for the data
        if 'search' in request.GET and len(request.GET['search'].split(',')) >= 1:
            # Turn list of values into list of Q objects
            queries = [(Q(first_name__contains=value) | Q(
                last_name__contains=value)) for value in request.GET['search'].split(',')]
            # Take one Q object from the list
            initQuery = queries.pop()
            # Or the Q object with the ones remaining in the list
            for query in queries:
                initQuery |= query
            items = items.filter(initQuery)

        # GET all records from the table with order and pegnation
        items = items.order_by(order)[start:end]

        serializer = UserSerializer(items, many=True)
        # return the data
        return Response(prepareResponse({"total": items.count(), "count": settings.PER_PAGE, "page":   1 if ('page' not in request.GET) else request.GET['page']}, serializer.data))

    @swagger_auto_schema(
        tags=(['users']),
        responses=recordResponseSchema(UserSerializer)
    )
    @action(detail=True, methods=['GET'])
    def record(self, request, id=None):
        """
        GET user by id .
        """
        # GET records from table
        item = User.objects.exclude(
            status=StatusChoices.DELETED).filter(id=id).first()
        if item:
            serializer = UserSerializer(item, many=False)
            return Response(prepareResponse({"total": 1}, serializer.data))
        # if record not found
        else:
            return Response(prepareResponse({"status": 404, "instance": request.get_full_path()}, {}, False), 404)

    @swagger_auto_schema(
        tags=(['users']),
        request_body=UserSerializer,
        responses=createResponseSchema(UserSerializer)
    )
    @action(detail=True, methods=['POST'])
    @transaction.atomic
    def create(self, request):
        """
        create new users.
        """
        item = User()
        # create all from post
        for attr, value in request.data.items():
            # if field is allowed
            if attr not in User.protected():
                setattr(item, attr, value)
            if attr == 'password':
                item.set_password(value)
        try:
            with transaction.atomic():
                # save data
                item.save()

                item.set_password(request.data['password'])
                # GET new data
                serializer = UserSerializer(item, many=False)
                # retuen new data
                return Response(prepareResponse({"total": 1}, serializer.data), 201)
        except Exception as error:
            print(error)
            print('------------------')
            # return valiation error
            return Response(prepareResponse({"status": 422, "instance": request.get_full_path()}, error, False), 422)

    @swagger_auto_schema(
        tags=(['users']),
        request_body=UserSerializer,
        responses=updateResponseSchema(UserSerializer)
    )
    @action(detail=True, methods=['PUT'])
    @transaction.atomic
    def update(self, request, id=None):
        """
        update user by id .
        """
        # GET records from table
        item = User.objects.get(id=id)
        if item:
            # update all from post
            for attr, value in request.data.items():
                # if field is allowed
                if attr not in User.protected():
                    setattr(item, attr, value)
                if attr == 'password':
                    if (value == ""):
                        setattr(item, attr, item.password)
                    else:
                        item.set_password(value)
            try:
                with transaction.atomic():
                    # save data
                    item.save()

                    # GET new data
                    serializer = UserSerializer(item, many=False)
                    # retuen new data
                    return Response(prepareResponse({"total": 1}, serializer.data), 201)
            except Exception as error:
                print(error)
                # return valiation error
                return Response(prepareResponse({"status": 422, "instance": request.get_full_path()}, error, False), 422)
        # if record not found
        else:
            return Response(prepareResponse({"status": 404, "instance": request.get_full_path()}, {}, False), 404)

    @swagger_auto_schema(
        tags=(['users']),
        responses=deleteResponseSchema()
    )
    @action(detail=True, methods=['DELETE'])
    @transaction.atomic
    def delete(self, request, id=None):
        """
        delete user by id .
        """
        # GET records from table
        item = User.objects.filter(id=id).first()
        if item:
            with transaction.atomic():
                # delete record
                User.objects.filter(id=id).update(
                    status=StatusChoices.DELETED)
                return Response(prepareResponse({"total": 0}, {}), 201)
        # if record not found
        else:
            return Response(prepareResponse({"status": 404, "instance": request.get_full_path()}, {}, False), 404)


""""""""""""""""""""""""""""""
# devices  .
""""""""""""""""""""""""""""""


class devices(viewsets.ModelViewSet):
    permission_classes = [administrator]
    parser_classes = [JSONParser]

    @ swagger_auto_schema(
        tags=(['devices']),
        responses=recordsResponseSchema(DeviceSerializer)
    )
    @ action(detail=True, methods=['GET'])
    def records(self, request):
        """
        List all devices.
        """
        # GET total records
        items = Device.objects.all()
        total = items.count()
        # create pegnation [ start record ]
        start = ((0 if ('page' not in request.GET)
                  else int(request.GET['page']) - 1)) * settings.PER_PAGE
        # create pegnation [ end record ]
        end = start + settings.PER_PAGE

        # sort update
        if 'order' in request.GET:
            if request.GET['order'].find('asc') != -1:
                order = "-" + request.GET['order'].split('.')[0]
            else:
                order = request.GET['order'].split('.')[0]
        else:
            # if not order data will order by ID DESC
            order = '-id'

        # multi search for the data
        if 'search' in request.GET and len(request.GET['search'].split(',')) >= 1:
            # Turn list of values into list of Q objects
            queries = [Q(name__contains=value)
                       for value in request.GET['search'].split(',')]
            # Take one Q object from the list
            initQuery = queries.pop()
            # Or the Q object with the ones remaining in the list
            for query in queries:
                initQuery |= query
            items = items.filter(initQuery)

        # GET all records from the table with order and pegnation
        items = items.order_by(order)[start:end]

        serializer = DeviceSerializer(items, many=True)
        # return the data
        return Response(prepareResponse({"total": total, "count": settings.PER_PAGE, "page":   1 if ('page' not in request.GET) else request.GET['page']}, serializer.data))

    @ swagger_auto_schema(
        tags=(['devices']),
        responses=recordResponseSchema(DeviceSerializer)
    )
    @ action(detail=True, methods=['GET'])
    def record(self, request, id=None):
        """
        GET device by id .
        """
        # GET records from table
        item = Device.objects.filter(id=id).first()

        if item:
            serializer = DeviceSerializer(item, many=False)
            return Response(prepareResponse({"total": 1}, serializer.data))
        # if record not found
        else:
            return Response(prepareResponse({"status": 404, "instance": request.get_full_path()}, {}, False), 404)

    @ swagger_auto_schema(
        tags=(['devices']),
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'device_id': openapi.Schema(type=openapi.TYPE_INTEGER),
                'start_date': openapi.Schema(type=openapi.FORMAT_DATETIME),
                'end_date': openapi.Schema(type=openapi.FORMAT_DATETIME),
                'date': openapi.Schema(type=openapi.FORMAT_DATETIME)
            }, required=["device_id", "start_date", "end_date"],
        ),
        responses=recordResponseSchema(MinipillarSerializer)
    )
    @ action(detail=True, methods=['POST'])
    def history(self, request):
        """
        GET history by device id .
        """
        # GET records from table
        # start_date = datetime.datetime.strptime(
        #     request.data['start_date'], "%Y-%m-%d %H:%M:%S")
        # end_date = datetime.datetime.strptime(
        #     request.data['end_date'], "%Y-%m-%d %H:%M:%S")
        start_date = float(request.data['start_date'])
        end_date = float(request.data['end_date'])
        item = MiniPillar.objects.filter(device_id=request.data['device_id'],time__range=(start_date, end_date)).all()
        serializer = MinipillarSerializer(item, many=True)

        ##--> read text files

        # Get device id
        device_id = request.data['device_id']
        # Get device name
        device_name = list(Device.objects.filter(id=device_id).values())[0]["name"]
        # Get date filtering
        date = request.data['date']
        text_file = open('logs/{}/{}.txt'.format(str(device_id), date), 'r')
        points = []
        with open('logs/{}/{}.txt'.format(str(device_id), date)) as f:
            data = f.readlines()
            points = []
    
            for line in data:
                line = line.split(",")
                latitude = line[1].split(':')[1]
                longitude = line[2].split(':')[1]
                speed = line[0].split(":")[1]

                point = [float(latitude), float(longitude)]
                point = geojson.Point(point)
                properties = {
                    "marker-color": "#000000",
                    "marker-size": "medium",
                    "marker-symbol": "circle",
                    "device_id":request.data['device_id'], 
                    "device_name":device_name, 
                    "speed": speed
                    }
            
                # Create geojson point feature
                point_feature = geojson.Feature(geometry=point, properties=properties)
                
                points.append(point_feature)

            # create geojson feature collection
            points_feature = {
                "type": "FeatureCollection",
                "features": points
                }
        
        
        
        return Response(prepareResponse({"total": item.count()}, points_feature))
        # return Response(prepareResponse({"total": item.count()}, serializer.data))

    @ swagger_auto_schema(
        tags=(['devices']),
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'name': openapi.Schema(type=openapi.TYPE_STRING),
                'description': openapi.Schema(type=openapi.TYPE_STRING),
                'code': openapi.Schema(type=openapi.TYPE_STRING),
                'hardware': openapi.Schema(type=openapi.TYPE_STRING),
                'group_id': openapi.Schema(type=openapi.TYPE_INTEGER),
            }, required=["name", "code", "hardware"],
        ),
        responses=createResponseSchema(DeviceSerializer)
    )
    @ action(detail=True, methods=['POST'])
    @ transaction.atomic
    def create(self, request):
        """
        create new devices.
        """
        item = Device()
        user = User()
        # create all from post
        print(request.data.items())
        for attr, value in request.data.items():
            # if field is allowed
            if attr not in Device.protected():
                setattr(item, attr, value)
        try:
            with transaction.atomic():
                # save data

                item.save()

                # GET new data
                serializer = DeviceSerializer(item, many=False)

                # retuen new data
                return Response(prepareResponse({"total": 1}, serializer.data), 201)

        except Exception as error:
            print(error)
            # return valiation error
            return Response(prepareResponse({"status": 422, "instance": request.get_full_path()}, error, False), 422)

    @ swagger_auto_schema(
        tags=(['devices']),
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'name': openapi.Schema(type=openapi.TYPE_STRING),
                'description': openapi.Schema(type=openapi.TYPE_STRING),
                'code': openapi.Schema(type=openapi.TYPE_STRING),
                'hardware': openapi.Schema(type=openapi.TYPE_STRING),
                'group_id': openapi.Schema(type=openapi.TYPE_INTEGER),
            }, required=["name", "code", "hardware", "group_id"],
        ),
        responses=createResponseSchema(DeviceSerializer)
    )
    @ action(detail=True, methods=['PUT'])
    @ transaction.atomic
    def update(self, request, id=None):
        """
        update device by id .
        """
        # GET records from table
        item = Device.objects.get(id=id)
        if item:
            # update all from post
            for attr, value in request.data.items():
                # if field is allowed
                if attr not in Device.protected():
                    setattr(item, attr, value)
            try:
                with transaction.atomic():
                    # save data
                    item.save()
                    # GET new data
                    serializer = DeviceSerializer(item, many=False)
                    # retuen new data
                    return Response(prepareResponse({"total": 1}, serializer.data), 201)
            except Exception as error:
                # return valiation error
                return Response(prepareResponse({"status": 422, "instance": request.get_full_path()}, error, False), 422)
        # if record not found
        else:
            return Response(prepareResponse({"status": 404, "instance": request.get_full_path()}, {}, False), 404)

    @ swagger_auto_schema(
        tags=(['devices']),
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'name': openapi.Schema(type=openapi.TYPE_STRING),
                'description': openapi.Schema(type=openapi.TYPE_STRING),
                'group_id': openapi.Schema(type=openapi.TYPE_INTEGER),
            },
        ),
        responses=createResponseSchema(DeviceSerializer)
    )
    @ action(detail=True, methods=['PUT'])
    @ transaction.atomic
    def activate(self, request, id=None):
        """
        activate device by id .
        """
        # GET records from table
        item = Device.objects.get(id=id)
        user = User()
        if item:
            # update all from post
            for attr, value in request.data.items():
                # if field is allowed
                if attr not in Device.protected():
                    setattr(item, attr, value)
            # update all from post
            setattr(user, 'username', item.username)
            setattr(user, 'email', item.email)
            setattr(user, 'type', UserTypeChoices.VIEWER)
            user.set_password(item.password)
            try:
                with transaction.atomic():
                    # save data
                    item.status = "active"
                    item.save()
                    user.save()
                    token, created = Token.objects.get_or_create(user=user)
                    # GET new data
                    serializer = DeviceSerializer(item, many=False)
                    # retuen new data
                    return Response(prepareResponse({"total": 1}, serializer.data), 201)
            except Exception as error:
                # return valiation error
                return Response(prepareResponse({"status": 422, "instance": request.get_full_path()}, error, False), 422)
        # if record not found
        else:
            return Response(prepareResponse({"status": 404, "instance": request.get_full_path()}, {}, False), 404)

    @ swagger_auto_schema(
        tags=(['devices']),
        responses=deleteResponseSchema()
    )
    @ action(detail=True, methods=['DELETE'])
    @ transaction.atomic
    def delete(self, request, id=None):
        """
        delete device by id .
        """
        # GET records from table
        item = Device.objects.filter(id=id).first()
        if item:
            with transaction.atomic():
                # delete record
                Device.objects.filter(id=id).update(
                    status=StatusChoices.DELETED)

                return Response(prepareResponse({"total": 0}, {}), 201)
        # if record not found
        else:
            return Response(prepareResponse({"status": 404, "instance": request.get_full_path()}, {}, False), 404)


""""""""""""""""""""""""""""""
# Mini Pillar
""""""""""""""""""""""""""""""
class UpdateMiniPillar(views.APIView):
    permission_classes = []
    parser_classes = [JSONParser ,MultiPartParser, FormParser]
    # parser_classes = [MultiPartParser, JSONParser]

    @ swagger_auto_schema(
        tags=(['minipillars']),
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                # general
                'code': openapi.Schema(type=openapi.TYPE_STRING),
                'manuf_serial_number': openapi.Schema(type=openapi.TYPE_STRING),
                'miniPillar_type': openapi.Schema(type=openapi.TYPE_STRING),
                'subtype_cd': openapi.Schema(type=openapi.TYPE_STRING),
                'substation_number': openapi.Schema(type=openapi.TYPE_STRING),
                'feeder_number': openapi.Schema(type=openapi.TYPE_STRING),
                'circuits_number': openapi.Schema(type=openapi.TYPE_STRING),
                'used_circuits_number': openapi.Schema(type=openapi.TYPE_STRING),
                'subMiniPilar': openapi.Schema(type=openapi.TYPE_STRING),
                'image': openapi.Schema(type=openapi.TYPE_FILE),
                # visual inspection
                'entrance_obstacles': openapi.Schema(type=openapi.TYPE_STRING),
                'equipment_grounding': openapi.Schema(type=openapi.TYPE_STRING),
                'rusted_earthing_connection': openapi.Schema(type=openapi.TYPE_STRING),
                'availability_noDang_signsMono': openapi.Schema(type=openapi.TYPE_STRING),
                'substation_cleanliness': openapi.Schema(type=openapi.TYPE_STRING),
                'bumt_marks_sparks': openapi.Schema(type=openapi.TYPE_STRING),
                'oxidation_corrosions': openapi.Schema(type=openapi.TYPE_STRING),
                'dust_foreignDebris': openapi.Schema(type=openapi.TYPE_STRING),
                'connectors_lugs': openapi.Schema(type=openapi.TYPE_STRING),
                'bumt_heatingMarksOnCable': openapi.Schema(type=openapi.TYPE_STRING),
                'urgent_issue': openapi.Schema(type=openapi.TYPE_STRING),
                'urgent_issue_body': openapi.Schema(type=openapi.TYPE_STRING),
                'serious_issue': openapi.Schema(type=openapi.TYPE_STRING),
                'serious_issue_body': openapi.Schema(type=openapi.TYPE_STRING),
                # IR inspection
                'physicalCondition_dent_damages': openapi.Schema(type=openapi.TYPE_STRING),
                'rust_corrosion_deterioration': openapi.Schema(type=openapi.TYPE_STRING),
                'paint_condition': openapi.Schema(type=openapi.TYPE_STRING),
                'gaps_slots': openapi.Schema(type=openapi.TYPE_STRING),
                'locks_hinges': openapi.Schema(type=openapi.TYPE_STRING),
                'latching_mechanism': openapi.Schema(type=openapi.TYPE_STRING),
                'cracks_damages': openapi.Schema(type=openapi.TYPE_STRING),
                'gaps_unblockCableEntry': openapi.Schema(type=openapi.TYPE_STRING),
                'galvanization_bolts_nuts_screws': openapi.Schema(type=openapi.TYPE_STRING),
                'grounding_bounding': openapi.Schema(type=openapi.TYPE_STRING),
                'access_obstructions': openapi.Schema(type=openapi.TYPE_STRING),
                'numbering_dangerSigns_monogram': openapi.Schema(type=openapi.TYPE_STRING),
                'maintenance_completed': openapi.Schema(type=openapi.TYPE_STRING),
                'minorRepair_made': openapi.Schema(type=openapi.TYPE_STRING), 
            }
        ),
        responses=createResponseSchema(MinipillarSerializer)
    )
    @ action(detail=True, methods=['PUT'])
    def put(self, request, id=None):
        """
        update minipillar by id .
        """
        # GET records from table
        item = MiniPillar.objects.get(id=id)
        
        if item:
            # update all from post
                     
            for attr, value in json.loads(request.data["body"]).items():
                # if field is allowed
                setattr(item, attr, value)
            
            try:
                with transaction.atomic():
                    # get device id
                    item.device = request.user.device
                    item.checked = True
                    item.checked_by = request.user.device.username
                    item.image = request.data["file"]
                    # item.created_by = request.user
                    # save data
                    item.save()
                    # GET new data
                    serializer = MinipillarSerializer(item, many=False)
                    # retuen new data
                    return Response(prepareResponse({"total": 1}, serializer.data), 201)
            except Exception as error:
                # return valiation error
                return Response(prepareResponse({"status": 422, "instance": request.get_full_path()}, error, False), 422)
        # if record not found
        else:
            return Response(prepareResponse({"status": 404, "instance": request.get_full_path()}, {}, False), 404)
        
        
class MiniPillarRecord(views.APIView):
    permission_classes = []
    parser_classes = [JSONParser]

    @ swagger_auto_schema(
        tags=(['minipillars']),
        responses=recordsResponseSchema(MinipillarSerializer)
    )
    @ action(detail=True, methods=['GET'])
    def get(self, request, id):
        minipilar = MiniPillar.objects.filter(id=id).first()
        serializer = MinipillarSerializer(minipilar, many=False)
        
        return Response(serializer.data, status=status.HTTP_200_OK)
        


class MiniPillarList(views.APIView):
    permission_classes = (Or(viewer, administrator),)
    parser_classes = [JSONParser]

    @ swagger_auto_schema(
        tags=(['minipillars']),
        responses=recordsResponseSchema(MinipillarSerializer)
    )
    @ action(detail=True, methods=['GET'])
    def get(self, request):
        """
        List all devices.
        """

        # GET total records
        items = MiniPillar.objects.all()
        # create pegnation [ start record ]
        start = ((0 if ('page' not in request.GET)
                else int(request.GET['page']) - 1)) * settings.PER_PAGE
        # create pegnation [ end record ]
        end = start + settings.PER_PAGE

        # GET all records from the table with order and pegnation
        serializer = MinipillarSerializer(items, many=True)
        # return the data
        
        # create featureCollection
        geoClass = Geography()
        
        # get data
        data_object = serializer.data
        # data object to features
        data_features = geoClass.data_to_features(data_object)
        # features to featureCollection
        data_featureCollection = geoClass.features_to_featureCollection(data_features)
        
        return Response(prepareResponse({"total": items.count(), "status":status.HTTP_200_OK,"featureCollection": data_featureCollection , "count": settings.PER_PAGE, "page":   1 if ('page' not in request.GET) else request.GET['page']}, serializer.data))
        
        
        
        
class NearestMiniPillar(views.APIView):
    permission_classes = (Or(viewer, administrator),)
    parser_classes = [JSONParser]

    @ swagger_auto_schema(
         tags=(['minipillars']),
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'latitude': openapi.Schema(type=openapi.TYPE_STRING),
                'longitude': openapi.Schema(type=openapi.TYPE_STRING)
            }
        ),
        responses=createResponseSchema(MinipillarSerializer)
    )
    @ action(detail=True, methods=['POST'])
    def post(self, request):
        # init Geography class
        geoClass = Geography()
        # get current point 
        current_point = [float(request.data["latitude"]), float(request.data["longitude"])]
        
        # get minipillars from db
        minipillars_object = MiniPillar.objects.all()
        minipillars_object = MinipillarSerializer(minipillars_object, many=True)
        # get data
        data_object = minipillars_object.data
        # data object to features
        data_features = geoClass.data_to_features(data_object)
        # features to featureCollection
        data_featureCollection = geoClass.features_to_featureCollection(data_features)
        # get nearest minipillar
        nearest_minipillar = geoClass.nearest_point(current_point, data_featureCollection)
        # get nearest minipillar id
        nearest_minipillar_id = nearest_minipillar["properties"]["id"]
        # get from db
        minipilar = MiniPillar.objects.filter(id=nearest_minipillar_id).first()
        # create serializer
        serializer = MinipillarSerializer(minipilar, many=False)
        

        return Response({"meta":{"status": status.HTTP_200_OK}, "items":[serializer.data]}, status=status.HTTP_200_OK)

""""""""""""""""""""""""""""""
# Operations
""""""""""""""""""""""""""""""

class Operations(viewsets.ModelViewSet):
    permission_classes = []
    parser_classes = [JSONParser]

    @ swagger_auto_schema(
        tags=(['Operations']),
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'username': openapi.Schema(type=openapi.TYPE_STRING),
                'user_type': openapi.Schema(type=openapi.TYPE_STRING),
                'full_name': openapi.Schema(type=openapi.TYPE_STRING),
                'email': openapi.Schema(type=openapi.TYPE_STRING),
                'password': openapi.Schema(type=openapi.TYPE_STRING),
                'dateOfBirth': openapi.Schema(type=openapi.TYPE_STRING),
                'description': openapi.Schema(type=openapi.TYPE_STRING),
                'code': openapi.Schema(type=openapi.TYPE_STRING),
                'hardware': openapi.Schema(type=openapi.TYPE_STRING),
            }, required=[],
        ),
        responses=createResponseSchema(DeviceSerializer)
    )
    @ action(detail=True, methods=['POST'])
    @ transaction.atomic
    def deviceCreate(self, request):
        """
        submit new device for being confirmed.
        """
        try:
            with transaction.atomic():
                device, created = Device.objects.get_or_create(
                    username = request.data["username"],
                    user_type = request.data["user_type"],
                    full_name = request.data["full_name"],
                    email = request.data["email"],
                    password = request.data["password"],
                    code=request.data['code'],
                    hardware=request.data['hardware'],
                    dateOfBirth = request.data['dateOfBirth'],
                    defaults={'description': request.data['description'] if 'description' in request.data else '' ,
                              'status': StatusChoices.INACTIVE,
                              'full_name': request.data['full_name']}
                )
                serializer = DeviceSerializer(device, many=False).data
                if (created):
                    user = User.objects.create(
                        type=UserTypeChoices.VIEWER, email=request.data['username'], device=device, password=request.data['password'])
                    user.set_password(request.data['password'])
                    user.save()

                    return Response(prepareResponse({"total": 1, "status": 200}, serializer), 200)
                else:

                    if device.status == StatusChoices.INACTIVE:
                        serializer = DeviceSerializer(device, many=False).data
                        return Response(prepareResponse({"total": 1, "status":401}, serializer), 401)
                    user = User.objects.filter(
                        email=request.data['username']).first()

                    if user:
                        if check_password(request.data['password'], user.password):
                            token, created = Token.objects.get_or_create(
                                user=user)
                            return Response(prepareResponse({"total": 1, 'token': token.key, 'status': 201}, serializer), 201)
                        else:
                            return Response(prepareResponse({"total": 1, 'status': 401}, serializer), 401)
                    else:
                        return Response(prepareResponse({"total": 1, 'status': 401}, serializer), 401)

        except Exception as error:
            print(error)
            # return valiation error
            return Response(prepareResponse({"status": 422, "instance": request.get_full_path()}, error, False), 422)
      

    @ swagger_auto_schema(
        tags=(['Operations']),
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'name': openapi.Schema(type=openapi.TYPE_STRING),
                'json_object': openapi.Schema(type=openapi.TYPE_STRING)
                
            }, required=["json_object"],
        ),
        responses=createResponseSchema(MiniPillarFileSerializer)
    )
    @ action(detail=True, methods=['POST'])
    @ transaction.atomic
    def minipilar_import(self, request):
        try:
            with transaction.atomic():
                json_file, created = MiniPillarFile.objects.get_or_create(
                    name=request.data['name'],
                    json_object=request.data['json_object'],
                    user = request.user,
                    username = request.user.email
                )
                
                json_object = request.data["json_object"]
                
                if json_object["features"]:
                    for feature in json_object["features"][:11]:
                        json_data, created = MiniPillar.objects.get_or_create(
                            latitude=feature["geometry"]["coordinates"][1],
                            longitude=feature["geometry"]["coordinates"][0],
                            created_by = request.user,
                            user = request.user.email
                        )

                          

                serializer = MiniPillarFileSerializer(json_file, many=False).data

                
                print("json_object imported successfully")

                return Response(prepareResponse({"total": 1, 'token': "token"}, serializer), 201)

        except Exception as error:
            print(error)
            # return valiation error
            return Response(prepareResponse({"status": 422, "instance": request.get_full_path()}, error, False), 422)




 







