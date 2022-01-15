import requests
from django.shortcuts import render, redirect
from rest_framework import generics
from django.urls import reverse
 
 
def index(request, path=None, uuid=None):
    return redirect('/accounts/login')
    return render(request, 'index.html', context={})
 