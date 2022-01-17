from django.db.models import fields
from rest_framework import serializers
from django.conf import settings
from rest_framework.fields import ReadOnlyField
# models
from api.models import *
from django.contrib.auth.password_validation import validate_password

date_format = getattr(settings, "DATE_FORMAT", None)
datetime_format = getattr(settings, "DATETIME_FORMAT", None)
datetime_utc_format = getattr(settings, "DATETIME_UTC_FORMAT", None)


""""""""""""""""""""""""""""""
# change password .
""""""""""""""""""""""""""""""


class ChangePasswordSerializer(serializers.Serializer):
    """
    Serializer for password change endpoint.
    """
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate_new_password(self, value):
        validate_password(value)
        return value


""""""""""""""""""""""""""""""
# groups .
""""""""""""""""""""""""""""""


class GroupSerializer(serializers.ModelSerializer):

    class Meta:
        model = Group
        fields = '__all__'


class GroupListSerializer(serializers.ModelSerializer):

    class Meta:
        model = Group
        fields = ('id', 'name')


""""""""""""""""""""""""""""""
# areas .
""""""""""""""""""""""""""""""


class AreaSerializer(serializers.ModelSerializer):

    class Meta:
        model = Area
        fields = '__all__'


""""""""""""""""""""""""""""""
# devices .
""""""""""""""""""""""""""""""


class DeviceSerializer(serializers.ModelSerializer):
    group_id = serializers.IntegerField(required=False)
    group = GroupSerializer(many=False)

    class Meta:
        model = Device
        fields = '__all__'


""""""""""""""""""""""""""""""
# locations .
""""""""""""""""""""""""""""""


class LocationSerializer(serializers.ModelSerializer):
    area_id = serializers.IntegerField(required=False)
    area = AreaSerializer(many=False)

    device_id = serializers.IntegerField(required=False)
    device = DeviceSerializer(many=False)

    class Meta:
        model = Location
        fields = '__all__'



""""""""""""""""""""""""""""""
# user .
""""""""""""""""""""""""""""""


class UserSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    type = serializers.CharField(max_length=16)
    first_name = serializers.CharField(max_length=32)
    last_name = serializers.CharField(max_length=32)
    email = serializers.CharField(max_length=256)
    mobile = serializers.CharField(max_length=64)
    update = serializers.BooleanField()
    delete = serializers.BooleanField()
    # foreign keys
    device_id = serializers.IntegerField(required=False)
    device = DeviceSerializer(many=False)
    # General
    status = serializers.CharField(read_only=True, max_length=16)
    created_at = serializers.DateTimeField(
        read_only=True, format=datetime_format)
    updated_at = serializers.DateTimeField(
        read_only=True, format=datetime_format)
    date_joined = serializers.DateTimeField(format=datetime_format)

    class Meta:

        model = User
        fields = ('id', 'email', 'mobile', 'date_joined',
                  'last_name', 'first_name', 'type', 'update', 'delete', 'status',   'created_at', 'updated_at', 'device_id', 'device')






""""""""""""""""""""""""""""""
# MiniPillar .
""""""""""""""""""""""""""""""
class MiniPillarJsonFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = MiniPillarJsonFile
        fields = ('name', 'json_object', 'uploaded_at')

class MinipillarSerializer(serializers.ModelSerializer):
    checked = serializers.BooleanField()
    image = serializers.ImageField()
    class Meta:
        model = MiniPillar
        fields = '__all__'

