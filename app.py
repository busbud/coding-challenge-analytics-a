from flask import Flask, render_template, request
from pandas import DataFrame, Series
import pandas as pd
import json


app = Flask(__name__)

names = ['geonameid', 'name', 'asciiname', 'alternatenames', 'latitude',
         'longitude', 'feature class', 'feature code', 'country code', 'cc2',
         'admin1 code', 'admin2 code', 'admin3 code', 'admin4 code',
         'population', 'elevation', 'dem', 'timezone', 'modification date']
raw = pd.read_table('static/data/cities15000.txt', names=names)

frame = raw[raw['country code'].notnull()]

print '{} entries dropped: no country code'.format(len(raw) - len(frame))

frame['in target'] = False

target = json.loads(open('static/data/target-list.json').read())
print '{} countries in target-list'.format(len(target))


id_frame = frame.set_index('geonameid')

for item in target:
    if item in id_frame.index:
        id_frame['in target'].ix[item] = True


smaller_frame = frame.reset_index().set_index(['country code', 'geonameid'])
country_frame = smaller_frame[['name', 'latitude', 'longitude', 'in target']]

print 'Grabbing table from geonames'
countries_response = pd.io.html.read_html('http://www.geonames.org/countries/',
                                          attrs={'id': 'countries'},
                                          flavor='html5lib',
                                          infer_types=False, header=0)

response_frame = countries_response[0][['ISO-3166alpha2', 'Country']]
country_lookup = response_frame.set_index('ISO-3166alpha2')


@app.route('/')
@app.route('/index')
def home():
    print 'inside home'
    return render_template('index.html')


@app.route('/country-data', methods=['POST'])
def country():
    print 'inside country'
    print 'value for country in request:', request.form['country']
    country_code = request.form['country']

    if country_code in country_lookup.index:
        country_name = country_lookup.ix[country_code]['Country']
    else:
        country_name = 'Unknown'

    if country_code in country_frame.index:
        city_count = str(country_frame.ix[country_code]['name'].count())
    else:
        city_count = 'Unknown'

    response_dict = {
        'country_name': country_name,
        'cities_over_15k': city_count
    }
    return json.dumps(response_dict)


def main():

    app.run(debug=True)

if __name__ == '__main__':
    main()
