# -*- coding: utf-8 -*-
from django.conf.urls import patterns, include, url

from django.contrib import admin

admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'demo_django_rest_fwk.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^demo/', include('demo.urls')),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework'))
)
