from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render, HttpResponse
from django.http import JsonResponse
from django.contrib.auth.hashers import make_password
from django.contrib.auth.hashers import check_password
from django.contrib.auth import get_user_model, login as django_login
import psycopg2
from datetime import datetime
from . import utils
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
            INSERT INTO students (student_id, student_class_id, name, email, password)
            VALUES (%s, %s, %s, %s, %s)
        '''
        hashed_password = make_password(req_data['password'])
        unique_id = str(uuid.uuid4())
        data = (unique_id, 
                "unassigned",
                req_data["name"], 
                req_data["email"], 
                hashed_password
                )
        conn = psycopg2.connect('postgres://avnadmin:AVNS_Z5JtM8rzuT87CvdUQlZ@pg-30aab7f8-saurabhrajesh.f.aivencloud.com:26577/defaultdb?sslmode=require')
        cur = conn.cursor()
        cur.execute(insert_query, data)
        conn.commit()
        conn.close()

        return JsonResponse({"success":"true", "message": "Student User created successfully.",  "data": data})

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
        cur.execute("SELECT * FROM students WHERE email = %s", [req_data['email']])
        user = cur.fetchone()
        print(user)
        cur.close()
        conn.close()

        if user:
            user_id, hashed_password = user[0], user[4]
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
def create_test_attempt(request):
    try:
        if request.method != "POST":
            raise utils.CustomError(f"Method - {request.method} is not Allowed")
        
        req_data = json.loads(request.body.decode('utf-8'))
        for key in ["student_id", "test_id", "answer"]:
            if key not in req_data.keys():
                raise utils.CustomError(f"The parameter {key} is missing")
            
        insert_query = '''
            INSERT INTO test_attempts (attempt_id, test_id, student_id, answer, marks_obtained, attempt_date)
            VALUES (%s, %s, %s, %s, %s, %s)
        '''
        unique_id = str(uuid.uuid4())
        current_time = datetime.now()
        data = (unique_id, 
                req_data["test_id"], 
                req_data["student_id"], 
                req_data["answer"], 
                -1, 
                current_time
                )
        conn = psycopg2.connect('postgres://avnadmin:AVNS_Z5JtM8rzuT87CvdUQlZ@pg-30aab7f8-saurabhrajesh.f.aivencloud.com:26577/defaultdb?sslmode=require')
        cur = conn.cursor()
        cur.execute(insert_query, data)
        conn.commit()
        conn.close()

        return JsonResponse({"success":"true", "message": "Test attempted successfully.",  "data": data})

    except Exception as e:
        return JsonResponse({"success":"false", "message":f"{e}"})