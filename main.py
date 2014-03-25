from flask import Flask
from flask import render_template
import os
import json
from readFile import *
app=Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')

@app.route("/data")
@app.route("/data/<int:ndata>")
def data(ndata=100):
   n=ndata;
   temp=getCityInfo();
   return temp
    
