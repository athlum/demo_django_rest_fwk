# -*- coding: utf-8 -*-
from rest_framework import serializers, viewsets
import models


class PersonSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.Person
        fields = ('id', 'name', 'age', 'sex', 'comment')