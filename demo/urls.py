# -*- coding: utf-8 -*-
from django.conf.urls import patterns, include, url
from rest_framework import routers
import viewsets


router = routers.DefaultRouter()
router.register(r'persons', viewsets.PersonViewSet)


urlpatterns = patterns('demo.views',
    # Examples:
    # url(r'^$', 'demo_django_rest_fwk.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    url(r'^', include(router.urls)),
    url(r'^home/$','home'),
)