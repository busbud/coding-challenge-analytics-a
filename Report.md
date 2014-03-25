Programming Challenge: Report
-----------------------------

Roshanak Houmanfar

rhoumanf@uwaterloo.ca

March 24, 2014

Outline
-------

1.  Description

2.  Possible Solutions

    -   Python on the Server and the Client Side

    -   Python on the Server Side and Javascript on the Client Side

3.  Challenges

    -   Displaying the Map using D3.js and datamaps.js

    -   Communication between Python and Javascript

    -   Deploying with Heroku

Description
-----------

The main purpose of this code is to display a world map where upon
clicking on each country the number of cities with population over 15000
in that country, the number of these cities inside the target list, and
the fraction of the two numbers are displayed. The cities with
population over 15000 are specified in data/cities15000.txt and the
target list is specified in data/target-list.json. I have added a third
file which contains the ios2 and ios3 codes for each country which I
will explain later.

The requirements are as follows:

-   The page should be served by a Python webserver

-   D3.js (or similar tool) should be used to display the world map

-   The code should be written in Javascript and Python

Possible Solutions
------------------

Depending on the application, there are multiple possible solutions.
Based on the requirements, two of the possible solutions are discussed
in the following.

### Python on the Server and the Client Side

The major web browsers do not have Python built in and therefore Python
was not really considered for client side for quite sometime. However,
due to high calculation performance, Python is nowadays more common on
the client side. For this challenge, I decided to leave this option for
now because ... well I was not familiar with Javascript coding and I
wanted to use this opportunity to learn it. If you are interested in
this solution I suggest you visit [here](http://kartograph.org/) and
[here](http://www.skulpt.org/).

### Python on the Server Side and Javascript on the Client Side

Because of Javascript's graphical and user interface abilities and
Python's computational abilities this is an appropriate solution.

Challenges
----------

### Displaying the Maps

I used [datamaps.js](http://datamaps.github.io/) and d3.js to set up the
map in an html file and I used
[Flask](https://github.com/dfm/flask-d3-hello-world) on Python's server
side. datamaps.js uses the iso3 country code whereas cities15000.txt
uses iso2 country code. I have added a file containing both iso codes to
the data folder to detect the correspondence between the two.

### Python and Javascript Communication

If you are not experienced with Python and Javascript communication,
this section could be a bottle neck. It is worth mentioning that Python
can communicate with Javascript through Ajax and the data should be sent
in a format (json) that is understandable by Javascript.
[This](https://www.youtube.com/watch?v=bzl4hCH2CdY) video is also
helpful.

### Deploying with Heroku

This requirement could be intimidating at first but rest assured that
this is potentially one of the greatest cloud server tools you'll come
across these days. The instructions for local server and development are
pretty straight forward. There are just two possible issues you could
run into once you try deploying your program onto Heroku. Firstly, when
you want to run the pip freeze\>requirement.txt command make sure you
are in the virtual environment and you have pip installed everything
your program needs. If you run the command outside the virtual
environment then every installed package on your computer will be
included inside the requirement file which can be troublesome when
deploying your program. The second challenge you might encounter is
again with the requirement.txt file. For some weird reason, pip install
does not install the latest version of the packages. This could cause an
installation error for some of the packages when you try to deploy your
program. This could be fixed by changing your requirement.txt so that
x==version becomes x>=version, where x is the name of a package.
