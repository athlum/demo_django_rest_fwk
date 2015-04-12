# -*- coding: utf-8 -*-
from rest_framework import serializers, viewsets
from rest_framework.response import Response
from rest_framework.decorators import detail_route, list_route
import serializers
import models
import json

class PersonViewSet(viewsets.ModelViewSet):
    queryset = models.Person.objects.all()
    serializer_class = serializers.PersonSerializer
    permission_classes = []

    def create(self,request):
        data = json.loads(request.body)
        if type(data) != list:
            data = [data]

        for d in data:
            person = models.Person(
                name = d.get('name',''), 
                age = d.get('age',''), 
                sex = d.get('sex',''), 
                comment = d.get('comment','')
                )
            person.save()

        return Response({'status':'OK'})

    @detail_route(methods=['get'])
    def update_data(self,request,pk=None):
    	print request.query_params
        name = request.query_params.get('name','')
        age = request.query_params.get('age','')
        sex = request.query_params.get('sex','')
        comment = request.query_params.get('comment','')
        user = self.get_object()
        changed = False
        if name:
        	changed = True
        	user.name = name
        if age:
        	changed = True
        	user.age = int(age)
        if sex:
        	changed = True
        	user.sex = sex
        if comment:
        	changed = True
        	user.comment = comment

        # for attr, value in validated_data.items():
        #     setattr(instance, attr, value)
        # instance.save()

        if changed:
        	user.save()	
        return Response({'status':'OK'})