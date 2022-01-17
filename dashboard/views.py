from django.shortcuts import render


def dashboard(request):
    # latest_question_list = Question.objects.order_by('-pub_date')[:5]
    context = {}
    return render(request, 'dashboard/dashboard.html', context)

def manage_users(request):
    context = {}
    return render(request, 'dashboard/manage_users.html', context)
