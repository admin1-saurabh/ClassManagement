from django.urls import path 
from . import views 

urlpatterns = [
    path('ensure/', views.ensure, name="ensure"),
    path('register/', views.register, name="ensure"),
    path('login/', views.login, name="ensure"),
]