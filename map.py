# -*- coding: utf-8 -*-

import json
from collections import defaultdict

from csv import reader
from flask import Flask, request


app = Flask(__name__)

target_list = set(json.load(open('./data/target-list.json')))
GEONAMEID = 0
CC = 8
cities = reader(open('./data/cities15000.txt', 'rb'), delimiter='\t')
lookup = defaultdict(list)

for city in cities:
    lookup[city[CC]].append(int(city[GEONAMEID]))


@app.route('/')
def hello():
    return open('index.html', 'r').read()


@app.route('/lookup')
def lookupview():
    cc = request.args.get('country')
    city_set = set(lookup[cc])
    n_target = len(target_list.intersection(city_set))
    city_len = len(city_set)
    pcent = n_target * 100 / city_len
    return ("<p>Number of countries with a population over 15000: {}</p>"
            "<p>Percent in Target List: {} / {} = {}%</p>").format(city_len,
                                                                   n_target,
                                                                   city_len,
                                                                   pcent)
