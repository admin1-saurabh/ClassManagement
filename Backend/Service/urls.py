from django.urls import path 
from . import views 

urlpatterns = [
    path('ensure/', views.ensure, name="ensure"),
    path('classrooms/', views.get_classrooms, name="get_classrooms"),
    path('classroom_students/', views.get_classroom_students, name="get_classroom_students"),
    path('tests/', views.get_tests, name="get_tests"),
    path('tests_by_date/', views.get_tests_by_date, name="get_tests_by_date"),
]