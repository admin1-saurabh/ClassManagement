from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render, HttpResponse
from django.http import JsonResponse
from django.contrib.auth.hashers import make_password
from django.contrib.auth.hashers import check_password
from django.contrib.auth import get_user_model, login as django_login
import psycopg2
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
def get_classrooms(request):
    try:
        if request.method != "POST":
            raise utils.CustomError(f"Method - {request.method} is not Allowed")
        
        req_data = json.loads(request.body.decode('utf-8'))
        for key in ["teacher_id"]:
            if key not in req_data.keys():
                raise utils.CustomError(f"The parameter {key} is missing")
            
        insert_query = '''
            select * from classrooms where teacher_id = %s
        '''
        conn = psycopg2.connect('postgres://avnadmin:AVNS_Z5JtM8rzuT87CvdUQlZ@pg-30aab7f8-saurabhrajesh.f.aivencloud.com:26577/defaultdb?sslmode=require')
        cur = conn.cursor()
        cur.execute(insert_query, req_data["teacher_id"])
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
            select * from tests where classroom_id = %s
        '''
        conn = psycopg2.connect('postgres://avnadmin:AVNS_Z5JtM8rzuT87CvdUQlZ@pg-30aab7f8-saurabhrajesh.f.aivencloud.com:26577/defaultdb?sslmode=require')
        cur = conn.cursor()
        cur.execute(insert_query, req_data["classroom_id"])
        data = cur.fetchall()
        conn.commit()
        conn.close()

        return JsonResponse({"success":"true", "data": data})

    except Exception as e:
        return JsonResponse({"success":"false", "message":f"{e}"})