from django.urls import path 
from . import views 

urlpatterns = [
    path('ensure/', views.ensure, name="ensure"),
    path('register/', views.register, name="register"),
    path('login/', views.login, name="login"),
    path('test_attempt/', views.create_test_attempt, name="test_attempt"),
]