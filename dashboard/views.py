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
    # Get active users
    active_users = Device.objects.filter(status="active").all().order_by('-updated_at')[:6]
    # get users data
    active_users = DeviceSerializer(active_users, many=True).data
    # get total mp checked by user
    active_users_list = []
    for user in active_users:
        user_id = dict(user)["id"]
        user_checked_count = MiniPillar.objects.filter(device=user_id).count()
        user_obj = dict(user)
        user_obj["checked_mp"] = user_checked_count
        active_users_list.append(user_obj)
        # print(user_obj)
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
        "active_users":active_users_list,
        "total_active_users": total_active_users,
        "latest_minipillars": latest_checked_minipillars_list
    }
    return render(request, 'dashboard/main/main/dashboard.html', context)


# user manager
@login_required
def user_list(request):
    # GET total records
    items = Device.objects.all().order_by("-updated_at")
    serializer = DeviceSerializer(items, many=True)
    
    
    context = {
        "users": serializer.data
    }
    return render(request, 'dashboard/users/user_list.html', context)


@login_required
def user_activity_list(request):
    active_users = Device.objects.filter(status="active").all().order_by('-updated_at')
    # get users data
    active_users = DeviceSerializer(active_users, many=True).data
    # get total mp checked by user
    active_users_list = []
    for user in active_users:
        user_id = dict(user)["id"]
        user_checked_count = MiniPillar.objects.filter(device=user_id).count()
        user_obj = dict(user)
        user_obj["checked_mp"] = user_checked_count
        active_users_list.append(user_obj)
        
    template = 'dashboard/users/user_activity_list.html'
    context = {
        "user_activity_list": active_users_list
    }
    
    return render(request, template, context)

@login_required
def user_checked_list(request, pk):
    # get minipillars checked by user
    minipillars = MiniPillar.objects.filter(device=pk).all()
    serializer = MinipillarSerializer(minipillars, many=True)
    minipillars_data = serializer.data
    # print(dict(minipillars_data))
    template = "dashboard/users/user_checked_list.html"
    context = {
        "minipillars": minipillars_data
    }
    
    return render(request, template, context)
    


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
        
        return redirect("user_list")
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
        
        return redirect("user_list")
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
        "minipillar":dict(minipillar_data),
    }
    
    return render(request, template, context)
    
