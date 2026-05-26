from django.shortcuts import render

# Create your views here.
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from django.db.models import Count
from django.db.models.functions import TruncMonth
from exams.models import Exam, Submission


#status in the admin dassbadrd
@csrf_exempt
def admin_stats(request):
    if request.method != "GET":
        return JsonResponse({"error": "Only GET allowed"}, status=405)
    
    try:
        # Fix total users count to exclude admins
        total_users = User.objects.filter(
            is_superuser=False,
            is_staff=False
         ).count()

        total_students = User.objects.filter(profile__user_type="student").count()
        total_teachers = User.objects.filter(profile__user_type="teacher").count()
        total_exams    = Exam.objects.count()
        
        # is_published is a BooleanField — True means active
        active_exams   = Exam.objects.filter(is_published=True).count()
        
        return JsonResponse({
            "total_users":    total_users,
            "total_students": total_students,
            "total_teachers": total_teachers,
            "total_exams":    total_exams,
            "active_exams":   active_exams,
            "system_health":  "99.8%"
        })
    
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    


#usser growth

@csrf_exempt
def admin_user_growth(request):
    if request.method != "GET":
        return JsonResponse({"error": "Only GET allowed"}, status=405)
    
    try:
        growth = (
            User.objects
            .annotate(month=TruncMonth("date_joined"))
            .values("month")
            .annotate(users=Count("id"))
            .order_by("month")
        )
        
        data = [
            {
                "month": item["month"].strftime("%b"),
                "users": item["users"]
            }
            for item in growth
        ]
        
        return JsonResponse(data, safe=False)
    
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    

#user distribution

@csrf_exempt
def admin_user_distribution(request):
    if request.method != "GET":
        return JsonResponse({"error": "Only GET allowed"}, status=405)
    
    try:
        # exclude admins from students/teachers count
        students = User.objects.filter(
            profile__user_type="student",
            is_superuser=False,
            is_staff=False
        ).count()
        
        teachers = User.objects.filter(
            profile__user_type="teacher",
            is_superuser=False,
            is_staff=False
        ).count()
        
        # count only real admins
        admins = User.objects.filter(is_staff=True).count()
        
        data = [
            {"name": "Students", "value": students, "color": "#1e3a8a"},
            {"name": "Teachers", "value": teachers, "color": "#10b981"},
            {"name": "Admins",   "value": admins,   "color": "#f59e0b"},
        ]
        
        return JsonResponse(data, safe=False)
    
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


#users table
@csrf_exempt
def admin_users(request):
    if request.method == "GET":
        try:
            users = User.objects.all().order_by("-date_joined")
            
            data = [
                {
                    "id":     user.id,
                    "name":   user.first_name or user.username,
                    "email":  user.email,
                    "role":   user.profile.user_type,
                    "date":   user.date_joined.strftime("%b %d, %Y"),
                    "status": "active" if user.is_active else "inactive",
                }
                for user in users
            ]
            
            return JsonResponse(data, safe=False)
        
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    elif request.method == "DELETE":
        try:
            data    = json.loads(request.body)
            user_id = data.get("user_id")
            user    = User.objects.get(id=user_id)
            user.delete()
            return JsonResponse({"message": "User deleted successfully"})
        
        except User.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=404)
        
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    
    return JsonResponse({"error": "Method not allowed"}, status=405)



#exam tables me7taga fehm 
@csrf_exempt
def admin_exams(request):
    if request.method != "GET":
        return JsonResponse({"error": "Only GET allowed"}, status=405)
    
    try:
        exams = Exam.objects.all()
        
        data = [
            {
                "name":     exam.title,  #  title not name
                "teacher":  exam.instructor.first_name or exam.instructor.username,
                # instructor is the ForeignKey field linking exam to teacher
                
                "students": exam.submission_set.count(),
                # submission_set is auto-created by Django because
                # Submission has a ForeignKey to Exam
                # it counts how many students submitted this exam
                
                "questions": exam.questions.count(),
                # questions is a ManyToManyField so .count() works directly
                
                "status":   "active" if exam.is_published else "closed",
                # is_published is a BooleanField — True=active, False=closed
            }
            for exam in exams
        ]
        
        return JsonResponse(data, safe=False)
    
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

# data about students all students
@csrf_exempt

def admin_students(request):
    if request.method == "GET":
        try:
            from exams.models import Submission
            from accounts.models import InstitutionMember

            #  exclude superusers and staff from students list
            students = User.objects.filter(
                profile__user_type="student",
                is_superuser=False,
                is_staff=False
            )

            # get all students
            students = User.objects.filter(profile__user_type="student")

            data = []
            for student in students:
                # check if student is institutional or free
                # getattr is a built-in Python function that safely gets an attribute
                membership = getattr(student, "institution_membership", None)

                # count how many exams this student took
                # Submission has a ForeignKey to student
                exams_taken = Submission.objects.filter(student=student).count()

                data.append({
                    "id": student.id,
                    "name": student.first_name or student.username,
                    "email": student.email,
                    "type": "Institutional" if membership else "Free",
                    "institution": membership.institution.name if membership else "N/A",
                    "exams_taken": exams_taken,
                    "date_joined": student.date_joined.strftime("%b %d, %Y"),
                    "status": "active" if student.is_active else "inactive",
                })

            return JsonResponse(data, safe=False)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    elif request.method == "DELETE":
        try:
            data = json.loads(request.body)
            user_id = data.get("user_id")
            user = User.objects.get(id=user_id)
            user.delete()
            return JsonResponse({"message": "Student deleted successfully"})

        except User.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=404)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Method not allowed"}, status=405)

# data about teaschers
@csrf_exempt
def admin_teachers(request):
    if request.method == "GET":
        try:
            from exams.models import Exam

             # exclude superusers and staff from teachers list
            teachers = User.objects.filter(
                profile__user_type="teacher",
                is_superuser=False,
                is_staff=False
            )

            # get all teachers
            teachers = User.objects.filter(profile__user_type="teacher")

            data = []
            for teacher in teachers:
                # check if teacher belongs to an institution
                membership = getattr(teacher, "institution_membership", None)

                # count how many exams this teacher created
                # Exam has a ForeignKey called instructor linking to teacher
                exams_created = Exam.objects.filter(instructor=teacher).count()

                data.append({
                    "id": teacher.id,
                    "name": teacher.first_name or teacher.username,
                    "email": teacher.email,
                    "institution": membership.institution.name if membership else "N/A", # mafy4 teacher 3ady 
                    "exams_created": exams_created,
                    "date_joined": teacher.date_joined.strftime("%b %d, %Y"),
                    "status": "active" if teacher.is_active else "inactive",
                })

            return JsonResponse(data, safe=False)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    elif request.method == "DELETE":
        try:
            data = json.loads(request.body)
            user_id = data.get("user_id")
            user = User.objects.get(id=user_id)
            user.delete()
            return JsonResponse({"message": "Teacher deleted successfully"})

        except User.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=404)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Method not allowed"}, status=405)