from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from api.models import Device, MiniPillar
from api.serializers import DeviceSerializer, MinipillarSerializer
from modules.geography import Geography
import json




@login_required
def dashboard(request):
    geoClass = Geography()
    # GET total records
    items = MiniPillar.objects.all()
     # GET all records from the table with order and pegnation
    serializer = MinipillarSerializer(items, many=True)
    # get data
    data_object = serializer.data
    # data object to features
    data_features = geoClass.data_to_features(data_object)
    # features to featureCollection
    data_featureCollection = geoClass.features_to_featureCollection(data_features)
    # print(data_featureCollection)
    
    context = {
        "featureCollection": json.dumps(data_featureCollection)
    }
    return render(request, 'dashboard/dashboard.html', context)

@login_required
def manage_users(request):
    # GET total records
    items = Device.objects.all()
    serializer = DeviceSerializer(items, many=True)
    
    
    context = {
        "devices": json.dumps(serializer.data)
    }
    return render(request, 'dashboard/manage_users.html', context)
