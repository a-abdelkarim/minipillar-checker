from django.shortcuts import render


def dashboard(request):
    # latest_question_list = Question.objects.order_by('-pub_date')[:5]
    context = {'latest_question_list': "there is"}
    return render(request, 'dashboard/dashboard.html', context)
