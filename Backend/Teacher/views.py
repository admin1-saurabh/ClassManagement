from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render, HttpResponse
from django.http import JsonResponse
from django.contrib.auth.hashers import make_password
from django.contrib.auth.hashers import check_password
from django.contrib.auth import get_user_model, login as django_login
import psycopg2
from . import utils
from datetime import datetime 
import json
import uuid
import os

# Create your views here.
def ensure(request):
    try:
        if request.method != "GET":
            raise utils.CustomError(f"Method - {request.method} is not Allowed")
        
        return JsonResponse({"success":"true", "status":"online"})
    
    except Exception as e:
        return JsonResponse({"success":"false", "message":f"{e}"})
    
@csrf_exempt 
def register(request):
    print("Entered")
    print(request.method)
    try:
        if request.method != "POST":
            raise utils.CustomError(f"Method - {request.method} is not Allowed")
        
        req_data = json.loads(request.body.decode('utf-8'))
        for key in ["name", "email", "password"]:
            if key not in req_data.keys():
                raise utils.CustomError(f"The parameter {key} is missing")
 
        insert_query = '''
            INSERT INTO teachers (teacher_id, name, email, password)
            VALUES (%s, %s, %s, %s)
        '''
        print(req_data)
        hashed_password = make_password(req_data['password'])
        unique_id = str(uuid.uuid4())
        data = (unique_id, 
                req_data["name"], 
                req_data["email"], 
                hashed_password
                )
        conn = psycopg2.connect('postgres://avnadmin:AVNS_Z5JtM8rzuT87CvdUQlZ@pg-30aab7f8-saurabhrajesh.f.aivencloud.com:26577/defaultdb?sslmode=require')
        cur = conn.cursor()
        cur.execute(insert_query, data)
        conn.commit()
        conn.close()

        return JsonResponse({"success":"true", "message": "Teacher User created successfully.", "data": data})

    except Exception as e:
        return JsonResponse({"success":"false", "message":f"{e}"})
    
@csrf_exempt 
def login(request):
    try:
        if request.method != "POST":
            raise utils.CustomError(f"Method - {request.method} is not Allowed")
        
        req_data = json.loads(request.body.decode('utf-8'))
        for key in ["email", "password"]:
            if key not in req_data.keys():
                raise utils.CustomError(f"The parameter {key} is missing")
            
        conn = psycopg2.connect('postgres://avnadmin:AVNS_Z5JtM8rzuT87CvdUQlZ@pg-30aab7f8-saurabhrajesh.f.aivencloud.com:26577/defaultdb?sslmode=require')
        cur = conn.cursor()
        cur.execute("SELECT * FROM teachers WHERE email = %s", [req_data['email']])
        user = cur.fetchone()
        print(user)
        cur.close()
        conn.close()

        if user:
            user_id, hashed_password = user[0], user[3]
            if check_password(req_data['password'], hashed_password):
                request.session['student_id'] = user_id
                User = get_user_model()  
                user_instance = User(
                    first_name=user[1],
                    last_name=user[2],
                    email=user[3],
                )
                # django_login(request, user=None) 
                return JsonResponse({"success":"true", "message": "Login successful", "data": user})
            else:
                return JsonResponse({"success":"false", "error": "Invalid credentials"}, status=401)
        else:
            return JsonResponse({"success":"false", "error": "User not found"}, status=404)

    except Exception as e:
        return JsonResponse({"success":"false", "message":f"{e}"})
    
@csrf_exempt 
def create_classroom(request):
    try:
        if request.method != "POST":
            raise utils.CustomError(f"Method - {request.method} is not Allowed")
        
        req_data = json.loads(request.body.decode('utf-8'))
        for key in ["teacher_id", "name", "description", "class_id"]:
            if key not in req_data.keys():
                raise utils.CustomError(f"The parameter {key} is missing")
            
        insert_query = '''
            INSERT INTO classrooms (classroom_id, teacher_id, name, description, class_id, created_at)
            VALUES (%s, %s, %s, %s, %s, %s)
        '''
        unique_id = str(uuid.uuid4())
        current_time = datetime.now()
        data = (unique_id, 
                req_data["teacher_id"], 
                req_data["name"], 
                req_data["description"], 
                req_data["class_id"], 
                current_time
                )
        conn = psycopg2.connect('postgres://avnadmin:AVNS_Z5JtM8rzuT87CvdUQlZ@pg-30aab7f8-saurabhrajesh.f.aivencloud.com:26577/defaultdb?sslmode=require')
        cur = conn.cursor()
        cur.execute(insert_query, data)
        conn.commit()
        conn.close()

        return JsonResponse({"success":"true", "message": "Classroom created successfully.",  "data": data})

    except Exception as e:
        return JsonResponse({"success":"false", "message":f"{e}"})
    
@csrf_exempt 
def create_test(request):
    print(request.method)
    print(json.loads(request.body.decode('utf-8')))
    try:
        if request.method != "POST":
            raise utils.CustomError(f"Method - {request.method} is not Allowed")
        
        req_data = json.loads(request.body.decode('utf-8'))
        for key in ["classroom_id", "teacher_id", "name", "description", "max_marks", "schedule_time"]:
            if key not in req_data.keys():
                raise utils.CustomError(f"The parameter {key} is missing")
            
        insert_query = '''
            INSERT INTO tests (test_id, classroom_id, name, description, max_marks, schedule_time, created_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        '''
        unique_id = str(uuid.uuid4())
        current_time = datetime.now()
        req_data["schedule_time"] = datetime.strptime(req_data["schedule_time"], "%Y-%m-%d %H:%M:%S")
        data = (unique_id, 
                req_data["classroom_id"], 
                req_data["name"], 
                req_data["description"], 
                req_data["max_marks"], 
                req_data["schedule_time"], 
                current_time
                )
        print(data)
        conn = psycopg2.connect('postgres://avnadmin:AVNS_Z5JtM8rzuT87CvdUQlZ@pg-30aab7f8-saurabhrajesh.f.aivencloud.com:26577/defaultdb?sslmode=require')
        cur = conn.cursor()
        cur.execute(insert_query, data)
        conn.commit()
        conn.close()

        return JsonResponse({"success":"true", "message": "Test created successfully.",  "data": data})

    except Exception as e:
        return JsonResponse({"success":"false", "message":f"{e}"})
    
@csrf_exempt 
def assign_classrooms(request):
    try:
        if request.method != "POST":
            raise utils.CustomError(f"Method - {request.method} is not Allowed")
        
        req_data = json.loads(request.body.decode('utf-8'))
        for key in ["classroom_id", "student_id"]:
            if key not in req_data.keys():
                raise utils.CustomError(f"The parameter {key} is missing")
            
        insert_query = '''
            INSERT INTO classrooms_assigns (assignment_id, classroom_id, student_id)
            VALUES (%s, %s, %s)
        '''
        unique_id = str(uuid.uuid4())
        data = (
                unique_id, 
                req_data["classroom_id"], 
                req_data["student_id"]
                )
        conn = psycopg2.connect('postgres://avnadmin:AVNS_Z5JtM8rzuT87CvdUQlZ@pg-30aab7f8-saurabhrajesh.f.aivencloud.com:26577/defaultdb?sslmode=require')
        cur = conn.cursor()
        cur.execute(insert_query, data)
        conn.commit()
        conn.close()

        return JsonResponse({"success":"true", "message": "Student Assigned to classroom successfully.",  "data": data})

    except Exception as e:
        return JsonResponse({"success":"false", "message":f"{e}"})
    
@csrf_exempt 
def deassign_classrooms(request):
    print(json.loads(request.body.decode('utf-8')))
    try:
        if request.method != "POST":
            raise utils.CustomError(f"Method - {request.method} is not Allowed")
        
        req_data = json.loads(request.body.decode('utf-8'))
        for key in ["classroom_id", "student_id"]:
            if key not in req_data.keys():
                raise utils.CustomError(f"The parameter {key} is missing")
            
        insert_query = '''
            delete from classrooms_assigns where student_id = %s and classroom_id = %s; 
        '''
        data = (
                req_data["student_id"],
                req_data["classroom_id"],
                )
        conn = psycopg2.connect('postgres://avnadmin:AVNS_Z5JtM8rzuT87CvdUQlZ@pg-30aab7f8-saurabhrajesh.f.aivencloud.com:26577/defaultdb?sslmode=require')
        cur = conn.cursor()
        cur.execute(insert_query, data)
        conn.commit()
        conn.close()

        return JsonResponse({"success":"true", "message": "Student Deassigned to classroom successfully.",  "data": data})

    except Exception as e:
        return JsonResponse({"success":"false", "message":f"{e}"})

@csrf_exempt 
def assign_marks(request):
    try:
        if request.method != "POST":
            raise utils.CustomError(f"Method - {request.method} is not Allowed")
        
        req_data = json.loads(request.body.decode('utf-8'))
        for key in ["test_id", "student_id", "marks"]:
            if key not in req_data.keys():
                raise utils.CustomError(f"The parameter {key} is missing")

        print(req_data)   
        update_query = '''
            update test_attempts set marks_obtained = %s where test_id = %s and student_id = %s;
        '''
        data = (
                req_data["marks"],
                req_data["test_id"],  
                req_data["student_id"]
                )
        conn = psycopg2.connect('postgres://avnadmin:AVNS_Z5JtM8rzuT87CvdUQlZ@pg-30aab7f8-saurabhrajesh.f.aivencloud.com:26577/defaultdb?sslmode=require')
        cur = conn.cursor()
        cur.execute(update_query, data)
        conn.commit()
        conn.close()

        return JsonResponse({"success":"true", "message": "Marks assigned successfully.",  "data": data})

    except Exception as e:
        return JsonResponse({"success":"false", "message":f"{e}"})
    
@csrf_exempt 
def assign_student_class_id(request):
    try:
        if request.method != "POST":
            raise utils.CustomError(f"Method - {request.method} is not Allowed")
        
        req_data = json.loads(request.body.decode('utf-8'))
        for key in ["student_id", "student_class_id"]:
            if key not in req_data.keys():
                raise utils.CustomError(f"The parameter {key} is missing")
            
        update_query = '''
            update students set student_class_id = %s where student_id = %s
        '''
        data = (
                req_data["student_class_id"], 
                req_data["student_id"]
                )
        conn = psycopg2.connect('postgres://avnadmin:AVNS_Z5JtM8rzuT87CvdUQlZ@pg-30aab7f8-saurabhrajesh.f.aivencloud.com:26577/defaultdb?sslmode=require')
        cur = conn.cursor()
        cur.execute(update_query, data)
        conn.commit()
        conn.close()

        return JsonResponse({"success":"true", "message": "Student Class Id assigned successfully.",  "data": data})

    except Exception as e:
        return JsonResponse({"success":"false", "message":f"{e}"})