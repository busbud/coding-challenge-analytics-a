from flask import Flask, render_template
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

# print '{} entries in `target-list.json`'.format(len(target)
# contained_count = len(id_frame[id_frame['in target'] == True])
# print '{} of which in `cities15000.txt`'.format(contained_count)

country_frame = frame.reset_index().set_index(['country code', 'geonameid'])
other_frame = country_frame[['name', 'latitude', 'longitude', 'in target']]


@app.route('/')
@app.route('/index')
def home():
    return render_template('index.html')
    # return ('o hai')


def main():
    app.run()

if __name__ == '__main__':
    main()
