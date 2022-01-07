import requests
from django.shortcuts import render, redirect
from rest_framework import generics
 
 
def index(request, path=None, uuid=None):
    return render(request, 'index.html', context={})
 