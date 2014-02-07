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
frame = frame[['geonameid', 'name', 'asciiname', 'latitude', 'longitude',
               'country code', 'population']].set_index('geonameid')
frame['in target'] = False

target = json.loads(open('static/data/target-list.json').read())
print '{} countries in target-list.json'.format(len(target))

for item in target:
    if item in frame.index:
        frame['in target'].ix[item] = True

country_frame = frame.set_index(['country code']).sort_index()


def get_counts(key=None, column=None, dframe=None):
    return_dict = dframe.ix[key][column].value_counts().to_dict()
    print return_dict
    return return_dict


@app.route('/')
@app.route('/index')
def home():
    print 'inside home'
    # return render_template('index.html')
    return render_template('example.html')


@app.route('/country-data', methods=['POST'])
def country():
    print 'inside country'
    print 'value for country_code in request:', request.form['country_code']
    country_code = request.form['country_code']
    if country_code in country_frame.index:
        value_counts = get_counts(key=country_code, column='in target',
                                  dframe=country_frame)
        print value_counts.keys()
        total_over_15k = str(country_frame.ix[country_code]
                             ['name'].count())
        cities_covered = str(value_counts[True] if True in value_counts
                             else 0)
        percentage_covered = str(100 * (value_counts[True] /
                                        float(total_over_15k))
                                 if True in value_counts else 0)

    else:
        total_over_15k = None
        cities_covered = None
        percentage_covered = None

    response_dict = {
        'country_code': country_code,
        'total_over_15k': total_over_15k,
        'cities_covered': cities_covered,
        'percentage_covered': percentage_covered
    }
    return json.dumps(response_dict)


def main():

    app.run(debug=True)

if __name__ == '__main__':
    main()
