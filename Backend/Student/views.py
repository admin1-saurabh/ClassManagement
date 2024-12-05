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

# @csrf_exempt 
# def register(request):
#     try:
#         if request.method != "POST":
#             raise utils.CustomError(f"Method - {request.method} is not Allowed")
        
#         req_data = json.loads(request.body.decode('utf-8'))
#         for key in ["first_name", "last_name", "email", "phone_no", "user_type", "password"]:
#             if key not in req_data.keys():
#                 raise utils.CustomError(f"The parameter {key} is missing")
 
#         insert_query = '''
#             INSERT INTO users (user_id, first_name, last_name, email, phone_no, user_type, password)
#             VALUES (%s, %s, %s, %s, %s, %s, %s)
#         '''
#         hashed_password = make_password(req_data['password'])
#         unique_id = str(uuid.uuid4())
#         data = (unique_id, 
#                 req_data['first_name'], 
#                 req_data['last_name'], 
#                 req_data['email'], 
#                 req_data['phone_no'], 
#                 req_data['user_type'], 
#                 hashed_password
#                 )
#         conn = psycopg2.connect('postgres://avnadmin:AVNS_mhniSnR50YlZg9vLspZ@pg-365a913b-test-project-16.i.aivencloud.com:21339/loadunload?sslmode=require')
#         cur = conn.cursor()
#         cur.execute(insert_query, data)
#         conn.commit()
#         cur.close()
#         conn.close()

#         return JsonResponse({"success":"true", "message": "User created successfully.",  "user_id": unique_id, "user_type": req_data['user_type']})

#     except Exception as e:
#         return JsonResponse({"success":"false", "message":f"{e}"})