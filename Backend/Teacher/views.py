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

        return JsonResponse({"success":"true", "message": "User created successfully.",  "user_id": unique_id, "user_type": "student"})

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
                return JsonResponse({"success":"true", "message": "Login successful", "user_id": user[0], "user_type": "student"})
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
        for key in ["teacher_id", "name", "description"]:
            if key not in req_data.keys():
                raise utils.CustomError(f"The parameter {key} is missing")
            
        insert_query = '''
            INSERT INTO classrooms (classroom_id, teacher_id, name, description, created_at)
            VALUES (%s, %s, %s, %s, %s)
        '''
        unique_id = str(uuid.uuid4())
        current_time = datetime.datetime.now()
        data = (unique_id, 
                req_data["teacher_id"], 
                req_data["name"], 
                req_data["description"], 
                current_time
                )
        conn = psycopg2.connect('postgres://avnadmin:AVNS_Z5JtM8rzuT87CvdUQlZ@pg-30aab7f8-saurabhrajesh.f.aivencloud.com:26577/defaultdb?sslmode=require')
        cur = conn.cursor()
        cur.execute(insert_query, data)
        conn.commit()
        conn.close()

        return JsonResponse({"success":"true", "message": "User created successfully.",  "user_id": unique_id, "user_type": "student"})

    except Exception as e:
        return JsonResponse({"success":"false", "message":f"{e}"})
    
@csrf_exempt 
def create_test(request):
    try:
        if request.method != "POST":
            raise utils.CustomError(f"Method - {request.method} is not Allowed")
        
        req_data = json.loads(request.body.decode('utf-8'))
        for key in ["classroom_id", "teacher_id", "name", "description", "max_marks"]:
            if key not in req_data.keys():
                raise utils.CustomError(f"The parameter {key} is missing")
            
        insert_query = '''
            INSERT INTO tests (test_id, classroom_id, teacher_id, name, description, max_marks, created_at)
            VALUES (%s, %s, %s, %s, %s)
        '''
        unique_id = str(uuid.uuid4())
        current_time = datetime.datetime.now()
        data = (unique_id, 
                req_data["classroom_id"], 
                req_data["teacher_id"], 
                req_data["name"], 
                req_data["description"], 
                req_data["max_marks"], 
                current_time
                )
        conn = psycopg2.connect('postgres://avnadmin:AVNS_Z5JtM8rzuT87CvdUQlZ@pg-30aab7f8-saurabhrajesh.f.aivencloud.com:26577/defaultdb?sslmode=require')
        cur = conn.cursor()
        cur.execute(insert_query, data)
        conn.commit()
        conn.close()

        return JsonResponse({"success":"true", "message": "User created successfully.",  "user_id": unique_id, "user_type": "student"})

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
            
        update_query = '''
            update test_attempts set marks_obtained = %s where test_id = %s and student_id = %s
        '''
        unique_id = str(uuid.uuid4())
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

        return JsonResponse({"success":"true", "message": "User created successfully.",  "user_id": unique_id, "user_type": "student"})

    except Exception as e:
        return JsonResponse({"success":"false", "message":f"{e}"})