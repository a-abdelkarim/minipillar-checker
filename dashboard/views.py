from django.shortcuts import redirect, render
from .handle_uploaded_file import FileHandler
from django.contrib.auth.decorators import login_required
from django.http import FileResponse, HttpResponse, HttpResponseRedirect
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from api.models import Device, MiniPillar
from api.serializers import DeviceSerializer, MinipillarSerializer
from modules.geography import Geography
from modules.PDFReport import PDFReport
from modules.GIS import GIS
from .forms import *
from .models import *
import json
import portalocker


# dashboard
@login_required
def dashboard(request):
    if request.user.is_superuser:
        geoClass = Geography()
        # GET total records
        items = MiniPillar.objects.all()
        # GET CHECKED count
        checked_count = MiniPillar.objects.filter(checked=True).count()
        print(checked_count)
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
            if user_checked_count>0:
                user_obj = dict(user)
                user_obj["checked_mp"] = user_checked_count
                user_obj["checked_percent"] = int((int(user_checked_count)/checked_count) * 100)
                active_users_list.append(user_obj)

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
        template = 'dashboard/main/main/dashboard.html'
        
        return render(request, template, context)
    
    return redirect("unauthorized_user")


# user manager
@login_required
def user_list(request):
    if request.user.is_superuser:
        # GET total records
        user_list = Device.objects.all().order_by("-updated_at")
        # create pagination
        page = request.GET.get('page', 1)

        paginator = Paginator(user_list, 10)
        try:
            users = paginator.page(page)
        except PageNotAnInteger:
            users = paginator.page(1)
        except EmptyPage:
            users = paginator.page(paginator.num_pages)
        
        template = 'dashboard/users/user_list.html'
        context = {
            "users": users,
        }
        return render(request, template, context)
    
    return redirect("unauthorized_user")


@login_required
def user_activity_list(request):
    if request.user.is_superuser:
        active_users = Device.objects.filter(status="active").all().order_by('-updated_at')
        # get users data
        active_users = DeviceSerializer(active_users, many=True).data
        # GET CHECKED count
        checked_count = MiniPillar.objects.filter(checked=True).count()
        # get total mp checked by user
        active_users_list = []
        for user in active_users:
            user_id = dict(user)["id"]
            user_checked_count = MiniPillar.objects.filter(device=user_id).count()
            user_obj = dict(user)
            user_obj["checked_mp"] = user_checked_count
            user_obj["checked_percent"] = int((int(user_checked_count)/checked_count) * 100)
            active_users_list.append(user_obj)
            
        # create pagination
        page = request.GET.get('page', 1)

        paginator = Paginator(active_users_list, 10)
        try:
            users = paginator.page(page)
        except PageNotAnInteger:
            users = paginator.page(1)
        except EmptyPage:
            users = paginator.page(paginator.num_pages)
            
            
        template = 'dashboard/users/user_activity_list.html'
        context = {
            "user_activity_list": users,
        }
        
        return render(request, template, context)
    
    return redirect("unauthorized_user")

@login_required
def user_checked_list(request, pk):
    if request.user.is_superuser:
        # get minipillars checked by user
        minipillars = MiniPillar.objects.filter(device=pk).all()
        
        # create pagination
        page = request.GET.get('page', 1)

        paginator = Paginator(minipillars, 10)
        try:
            minipillars = paginator.page(page)
        except PageNotAnInteger:
            minipillars = paginator.page(1)
        except EmptyPage:
            minipillars = paginator.page(paginator.num_pages)
        
        template = "dashboard/users/user_checked_list.html"
        context = {
            "minipillars": minipillars,
        }
        
        return render(request, template, context)
    
    return redirect("unauthorized_user")
    


@login_required
def user_activate(request, pk):
    if request.user.is_superuser:
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
        
    return redirect("unauthorized_user")
    
    
@login_required
def user_deactivate(request, pk):
    if request.user.is_superuser:
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
        
    return redirect("unauthorized_user")
    
    
    

# MiniPillars
@login_required
def minipillar_checked_list(request):
    if request.user.is_superuser:
        # get latest checked minipillars
        latest_minipillars = MiniPillar.objects.filter(checked=True).all().order_by('-last_check_at')

        # create pagination
        page = request.GET.get('page', 1)

        paginator = Paginator(latest_minipillars, 10)
        try:
            latest_minipillars = paginator.page(page)
        except PageNotAnInteger:
            latest_minipillars = paginator.page(1)
        except EmptyPage:
            latest_minipillars = paginator.page(paginator.num_pages)
        
        template = "dashboard/minipillars/latest_checked.html"
        context = {
            "latest_minipillars": latest_minipillars,
        }
    
        return render(request, template, context)
    
    return redirect("unauthorized_user")

@login_required
def minipillar_details(request, id):
    if request.user.is_superuser:
        minipillar = MiniPillar.objects.get(id=id)
        minipillar_serializer = MinipillarSerializer(minipillar, many=False)
        minipillar_data = minipillar_serializer.data
        
        template = "dashboard/minipillars/minipillar_details.html"
        context={
            "minipillar":dict(minipillar_data),
        }
        
        return render(request, template, context)
    
    return redirect("unauthorized_user")


""""""""""""""""""""""""
# PDF Report
""""""""""""""""""""""""
def minipillar_report(request, mp_id):
    if request.user.is_superuser:
        minipillar = MiniPillar.objects.get(id=mp_id)
        minipillar_serializer = MinipillarSerializer(minipillar, many=False)
        minipillar_data = minipillar_serializer.data
        
        # report instance
        report = PDFReport(minipillar_data)
        report_path = report.create_table()

        report = open(report_path, 'rb')

        response = FileResponse(report)

        return response
    
    return redirect("unauthorized_user")


@login_required
def minipillar_export(request):
    if request.user.is_superuser:
        # GET total records
        items = MiniPillar.objects.all()
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
        json_object = geoClass.features_to_featureCollection(data_features)
        # report instance
        gis = GIS()
        file_path = gis.json_to_file(json_object)

        
        file = open(file_path, 'rb')
        response = HttpResponse(file)
        response['Content-Disposition'] = 'attachment; filename="minipillar_data.json"'
        return(response)
    
    return redirect("unauthorized_user")


@login_required
def minipillar_upload(request):
    if request.user.is_superuser:
        context = {}
        template = "dashboard/file/upload.html"
        response = render(request, template, context)
        return response
    
    return redirect("unauthorized_user")

@login_required
def minipillar_import(request):
    if request.user.is_superuser:
        if request.method == 'POST':
            form = MinipillarFileForm(request.POST, request.FILES)
            if form.is_valid():
                new_file = MinipillarFile(file = request.FILES['mp_file'])
                new_file.save()
                file_path = "media/" + str(new_file.file)
                fileClass = FileHandler(file_path)
                fileClass.extract()
                point_list = fileClass.convert_shp()
                # remove temp files
                fileClass.clean()
                total_created = 0
                total_exist = 0
                for point in point_list:
                    json_data, created = MiniPillar.objects.get_or_create(
                                    latitude=point[1],
                                    longitude=point[0],
                                    created_by = request.user,
                                    user = request.user.email
                                )
                    if created:
                        total_created+=1
                    else:
                        total_exist+=1
                print(f"total points: {len(point_list)},\ntotal created: {total_created},\ntotal exist: {total_exist}")

                # Redirect to the document list after POST
                return HttpResponseRedirect('/dashboard')
            else:
                form = MinipillarFileForm()
        else:
            form = MinipillarFileForm() # A empty, unbound form
        
        return render(request, 'dashboard/file/upload.html', {'form': form})
    
    return redirect("unauthorized_user")
    

def unauthorized_user(request):
      return render(request, 'dashboard/users/unauthorized.html', {})
