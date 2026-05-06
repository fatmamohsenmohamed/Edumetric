from django.urls import path
from .views import about,  pricing #,contact

urlpatterns = [
    path("about/", about, name="about"),
    #path("contact/", contact, name="contact"),
    path("pricing/", pricing, name="pricing"),
]