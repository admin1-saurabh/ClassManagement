from django.urls import path 
from . import views 

urlpatterns = [
    path('ensure/', views.ensure, name="ensure"),
    path('register/', views.register, name="register"),
    path('login/', views.login, name="login"),
    path('create_classroom/', views.create_classroom, name="create_classroom"),
    path('create_test/', views.create_test, name="create_test"),
    path('assign_classrooms/', views.assign_classrooms, name="assign_classrooms"),
    path('assign_marks/', views.assign_marks, name="assign_marks"),
    path('assign_student_class_id/', views.assign_student_class_id, name="assign_student_class_id"),
]