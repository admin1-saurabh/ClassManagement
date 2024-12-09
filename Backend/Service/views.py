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
from dotenv import load_dotenv
load_dotenv()


postgres_endpoint = os.getenv('POSTGRE_SQL_ENDPOINT')
# Create your views here.
def ensure(request):
    try:
        if request.method != "GET":
            raise utils.CustomError(f"Method - {request.method} is not Allowed")
        
        return JsonResponse({"success":"true", "status":"online"})
    
    except Exception as e:
        return JsonResponse({"success":"false", "message":f"{e}"})
    
@csrf_exempt 
def get_classrooms(request):
    try:
        if request.method != "POST":
            raise utils.CustomError(f"Method - {request.method} is not Allowed")
        
        req_data = json.loads(request.body.decode('utf-8'))
        for key in ["teacher_id"]:
            if key not in req_data.keys():
                raise utils.CustomError(f"The parameter {key} is missing")
            
        insert_query = '''
            select * from classrooms where teacher_id = %s;
        '''
        conn = psycopg2.connect('postgres_endpoint')
        cur = conn.cursor()
        cur.execute(insert_query, (req_data["teacher_id"],))
        data = cur.fetchall()
        conn.commit()
        conn.close()

        return JsonResponse({"success":"true", "data": data})

    except Exception as e:
        return JsonResponse({"success":"false", "message":f"{e}"})
    
@csrf_exempt 
def get_student_classrooms(request):
    try:
        if request.method != "POST":
            raise utils.CustomError(f"Method - {request.method} is not Allowed")
        
        req_data = json.loads(request.body.decode('utf-8'))
        for key in ["student_id"]:
            if key not in req_data.keys():
                raise utils.CustomError(f"The parameter {key} is missing")
            
        insert_query = '''
            select * 
            from classrooms 
            where classroom_id in (
                select distinct classroom_id
                from classrooms_assigns
                where student_id = %s
            );
        '''
        print(req_data)
        conn = psycopg2.connect('postgres_endpoint')
        cur = conn.cursor()
        cur.execute(insert_query, (req_data["student_id"],))
        data = cur.fetchall()
        conn.commit()
        conn.close()

        return JsonResponse({"success":"true", "data": data})

    except Exception as e:
        return JsonResponse({"success":"false", "message":f"{e}"})
    
@csrf_exempt 
def get_tests(request):
    try:
        if request.method != "POST":
            raise utils.CustomError(f"Method - {request.method} is not Allowed")
        
        req_data = json.loads(request.body.decode('utf-8'))
        for key in ["classroom_id"]:
            if key not in req_data.keys():
                raise utils.CustomError(f"The parameter {key} is missing")
            
        insert_query = '''
            select * from tests where classroom_id = %s;
        '''
        conn = psycopg2.connect('postgres_endpoint')
        cur = conn.cursor()
        cur.execute(insert_query, (req_data["classroom_id"],))
        data = cur.fetchall()
        conn.commit()
        conn.close()

        return JsonResponse({"success":"true", "data": data})

    except Exception as e:
        return JsonResponse({"success":"false", "message":f"{e}"})
    
@csrf_exempt
def get_tests_by_date(request):
    try:
        if request.method != "POST":
            raise utils.CustomError(f"Method - {request.method} is not Allowed")
        
        req_data = json.loads(request.body.decode('utf-8'))
        for key in ["classroom_id"]:
            if key not in req_data.keys():
                raise utils.CustomError(f"The parameter {key} is missing")
        
        classroom_id = req_data["classroom_id"]
        today = datetime.now().date()

        upcoming_tests_query = '''
            SELECT * FROM tests 
            WHERE classroom_id = %s AND schedule_time >= %s
            ORDER BY schedule_time ASC
        '''
        past_tests_query = '''
            SELECT * FROM tests 
            WHERE classroom_id = %s AND schedule_time < %s
            ORDER BY schedule_time DESC
        '''

        conn = psycopg2.connect('postgres_endpoint')
        cur = conn.cursor()

        cur.execute(upcoming_tests_query, (classroom_id, today))
        upcoming_tests = cur.fetchall()

        cur.execute(past_tests_query, (classroom_id, today))
        past_tests = cur.fetchall()

        conn.commit()
        conn.close()

        return JsonResponse({
            "success": "true",
            "data": {
                "upcoming_tests": upcoming_tests,
                "past_tests": past_tests
            }
        })

    except Exception as e:
        return JsonResponse({"success": "false", "message": f"{e}"})
    
@csrf_exempt 
def get_classroom_students(request):
    try:
        if request.method != "POST":
            raise utils.CustomError(f"Method - {request.method} is not Allowed")
        
        req_data = json.loads(request.body.decode('utf-8'))
        for key in ["classroom_id"]:
            if key not in req_data.keys():
                raise utils.CustomError(f"The parameter {key} is missing")
            
        fetch_classroom_students_query = '''
            select * from students 
            where student_id in (
                select distinct student_id 
                from classrooms_assigns 
                where classroom_id = %s
            ); 
        '''

        fetch_rem_students_query = '''
            select * from students 
            where student_id not in (
                select distinct student_id 
                from classrooms_assigns 
                where classroom_id = %s
            ); 
        '''

        conn = psycopg2.connect('postgres_endpoint')
        cur = conn.cursor()
        
        cur.execute(fetch_classroom_students_query, (req_data["classroom_id"],))
        classroom_students = cur.fetchall()
        
        cur.execute(fetch_rem_students_query, (req_data["classroom_id"],))
        rem_students = cur.fetchall()
        
        conn.commit()
        conn.close()

        return JsonResponse({"success":"true", "data": {
            "classroom_students": classroom_students, 
            "remaining_students": rem_students
        }})

    except Exception as e:
        return JsonResponse({"success":"false", "message":f"{e}"})
    
    
@csrf_exempt 
def fetch_test_details(request):
    try:
        if request.method != "POST":
            raise utils.CustomError(f"Method - {request.method} is not Allowed")
        
        req_data = json.loads(request.body.decode('utf-8'))
        for key in ["test_id"]:
            if key not in req_data.keys():
                raise utils.CustomError(f"The parameter {key} is missing")
            
        fetch_test_details_query = '''
            select * from tests where test_id = %s;
        '''

        fetch_test_students_query = '''
            select * 
            from test_attempts t join students s 
            on t.student_id = s.student_id
            where t.test_id = %s; 
        '''
        conn = psycopg2.connect('postgres_endpoint')
        cur = conn.cursor()
        
        cur.execute(fetch_test_details_query, (req_data["test_id"],))
        test_details = cur.fetchall()

        cur.execute(fetch_test_students_query, (req_data["test_id"],))
        student_details = cur.fetchall()
        
        conn.commit()
        conn.close()

        return JsonResponse({"success":"true", "data": {
            "test_details": test_details, 
            "student_details": student_details
        }})

    except Exception as e:
        return JsonResponse({"success":"false", "message":f"{e}"})
    
