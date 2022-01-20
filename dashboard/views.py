from django.shortcuts import render
from django.contrib.auth.decorators import login_required

@login_required
def dashboard(request):
    # latest_question_list = Question.objects.order_by('-pub_date')[:5]
    context = {}
    return render(request, 'dashboard/dashboard.html', context)

@login_required
def manage_users(request):
    context = {}
    return render(request, 'dashboard/manage_users.html', context)
