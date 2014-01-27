# Busbud Coding Challenge

## Requirements
Create a web page that shows a map of the most populated cities in the world

- The page is served by a Python webserver
- Use D3.js (or similar tool) to display the world map
- Use `/data/cities15000.txt` to get the list of cities with population > 15000 (see http://download.geonames.org/export/dump/readme.txt for more information)
- Use `/data/target_cities.json` to get the list of targeted cities by geoname_id.
- Clicking on a country on the map should display the number of cities with population > 15000 in that country and the fraction covered by target list.  For example, if there are 100 cities in the US in `cities15000.txt` and 15 of those cities are in the target list, clicking on the US on the map should display `15 / 100 = 15%`.
- the app should be deployed on [heroku](https://devcenter.heroku.com/categories/python)


### Non-functional

* the code should be written in Javascript and Python (Python 2.7 compatible).
* any packages required must be installable via `pip install -r requirements.txt`, see [pip](http://www.pip-installer.org/en/latest/)
* Work should be submitted as a pull-request to this repo
