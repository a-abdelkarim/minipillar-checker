from django.shortcuts import redirect, render
from django.contrib.auth.decorators import login_required
from api.models import Device, MiniPillar
from api.serializers import DeviceSerializer, MinipillarSerializer
from modules.geography import Geography
import json



# dashboard
@login_required
def dashboard(request):
    geoClass = Geography()
    # GET total records
    items = MiniPillar.objects.all()
    # GET CHECKED count
    checked_count = MiniPillar.objects.filter(checked=True).count()
    # GET UNCHECKED count
    unchecked_count = items.count() - checked_count
    # GET ACTIVE USERS COUNT
    total_active_users = Device.objects.filter(status="active").count()
    # GET all records from the table with order and pegnation
    serializer = MinipillarSerializer(items, many=True)
    # get data
    data_object = serializer.data
    # data object to features
    data_features = geoClass.data_to_features(data_object)
    # features to featureCollection
    data_featureCollection = geoClass.features_to_featureCollection(data_features)
    
    
    # get latest checked minipillars
    latest_minipillars = MiniPillar.objects.filter(checked=True).all().order_by('-last_check_at')[:5]
    latest_minipillars_object =  MinipillarSerializer(latest_minipillars, many=True)
    latest_minipillars_data = latest_minipillars_object.data
    
    # get latest checked minipillars
    latest_checked_minipillars_list = []
    for item in latest_minipillars_data:
        latest_checked_minipillars_list.append(dict(item)) 
        
    
    
    context = {
        "featureCollection": json.dumps(data_featureCollection),
        "minipillars_count": items.count(),
        "total_checked_minipillars":checked_count,
        "total_unchecked_minipillars":unchecked_count,
        "total_active_users": total_active_users,
        "latest_minipillars": latest_checked_minipillars_list
    }
    return render(request, 'dashboard/main/main/dashboard.html', context)


# user manager
@login_required
def manage_users(request):
    # GET total records
    items = Device.objects.all()
    serializer = DeviceSerializer(items, many=True)
    
    
    context = {
        "devices": json.dumps(serializer.data)
    }
    return render(request, 'dashboard/users/manage_users.html', context)


@login_required
def user_activate(request, pk):
    user = Device.objects.filter(id=pk).first()
    user_serializer = DeviceSerializer(user, many=False)
    user_data = user_serializer.data
    
    activated = False
    try:
        user.status = "active"
        user.save()
        activated = True
    except Exception as e:
        return render(request, "dashboard/users/activate_failed.html")
    
    if activated:
        context={
            "username": user_data["username"]
        }
        
        return render(request, "dashboard/users/activate_success.html", context)
    else:
        return render(request, "dashboard/users/activate_failed.html")
    
    
@login_required
def user_deactivate(request, pk):
    user = Device.objects.filter(id=pk).first()
    user_serializer = DeviceSerializer(user, many=False)
    user_data = user_serializer.data
    
    activated = False
    try:
        user.status = "inactive"
        user.save()
        activated = True
    except Exception as e:
        return render(request, "dashboard/users/activate_failed.html")
    
    if activated:
        context={
            "username": user_data["username"]
        }
        
        return redirect("manage_users")
    else:
        return render(request, "dashboard/users/activate_failed.html")
    
    
    

# MiniPillars
def minipillar_checked_list(request):
    # get latest checked minipillars
    latest_minipillars = MiniPillar.objects.filter(checked=True).all().order_by('-last_check_at')
    latest_minipillars_object =  MinipillarSerializer(latest_minipillars, many=True)
    latest_minipillars_data = latest_minipillars_object.data
    
    # get latest checked minipillars
    latest_checked_minipillars_list = []
    for item in latest_minipillars_data:
        latest_checked_minipillars_list.append(dict(item))
        
    context = {
        "latest_minipillars": latest_checked_minipillars_list
    }
        
    return render(request, "dashboard/main/main/latest_checked.html", context)


def minipillar_details(request, id):
    minipillar = MiniPillar.objects.get(id=id)
    minipillar_serializer = MinipillarSerializer(minipillar, many=False)
    minipillar_data = minipillar_serializer.data
    
    template = "dashboard/main/main/minipillar_details.html"
    context={
        "minipillar":dict(minipillar_data)
    }
    
    return render(request, template, context)
    
