from flask import Flask, render_template
import json
import pandas as pd

app = Flask(__name__)

# ensure that we can reload when we change the HTML / JS for debugging
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
app.config['TEMPLATES_AUTO_RELOAD'] = True


@app.route('/')
def data():
    # load data files
    divorceDistrictAbsoluteDf = pd.read_csv('static/data/scheidung-bezirk-absolut-2023.CSV',
                                            encoding='latin1', delimiter=";")
    divorceDistrictAbsolute = divorceDistrictAbsoluteDf.to_dict('records')

    divorceDistrictPro1kDf = pd.read_csv('static/data/scheidung-bezirk-pro1k-2023.CSV', encoding='latin1',
                                         delimiter=";")
    divorceDistrictPro1k = divorceDistrictPro1kDf.to_dict('records')

    divorceMarriageDurationDf = pd.read_csv('static/data/scheidung-ehedauer-prozent.CSV',
                                            encoding='latin1', delimiter=";")
    divorceMarriageDuration = divorceMarriageDurationDf.to_dict('records')

    divorceTotal1951Df = pd.read_csv('static/data/scheidung-gesamt-1951.CSV', encoding='latin1', delimiter=";")
    divorceTotal1951 = divorceTotal1951Df.to_dict('records')

    divorceLandAbsoluteDf = pd.read_csv('static/data/scheidung-land-absolut.CSV', encoding='latin1', delimiter=";")
    divorceLandAbsolute = divorceLandAbsoluteDf.to_dict('records')

    divorceLandPro1kDf = pd.read_csv('static/data/scheidung-land-pro1k.CSV', encoding='latin1', delimiter=";")
    divorceLandPro1k = divorceLandPro1kDf.to_dict('records')

    divorceLandPercentDf = pd.read_csv('static/data/scheidung-land-prozent.CSV', encoding='latin1', delimiter=";", index_col=0, decimal=",")
    divorceLandPercentDf.reset_index(inplace=True)
    divorceLandPercent = divorceLandPercentDf.to_dict('records')

    # added on column to dataset containing population by state and year
    divorceMonthlyDf = pd.read_csv('static/data/scheidung-monat-2005.CSV', encoding='latin1', delimiter=";")

    # Remove all blanks
    divorceMonthlyDf.replace(' ', '', regex=True, inplace=True)

    # Convert population and divorce columns to numeric
    divorceMonthlyDf['Population'] = pd.to_numeric(divorceMonthlyDf['Population'], errors='coerce')
    for month in ["gesamt", "Jänner", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September",
                  "Oktober", "November", "Dezember"]:
        divorceMonthlyDf[month] = pd.to_numeric(divorceMonthlyDf[month], errors='coerce')

    # Calculate divorces per 1k people for each month
    for month in ["gesamt", "Jänner", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September",
                  "Oktober", "November", "Dezember"]:
        divorceMonthlyDf[f'{month}_per_1k'] = divorceMonthlyDf.apply(
            lambda row: (row[month] / row['Population']) * 1000 if row['Population'] else 0, axis=1)

    divorceMonthly = divorceMonthlyDf.to_dict('records')

    #load map data
    with open('static/maps/laender_95_geo.json', encoding='utf-8') as f:
        map = json.load(f)

    #print(divorceLandPercentDf)

    # return the index file and the data
    return render_template("index.html",
                           divorceDistricAbsolute=json.dumps(divorceDistrictAbsolute),
                           divorceDistrictPro1k=json.dumps(divorceDistrictPro1k),
                           divorceMarriageDuration=json.dumps(divorceMarriageDuration),
                           divorceRate=json.dumps(divorceTotal1951),
                           divorceLandAbsolute=json.dumps(divorceLandAbsolute),
                           divorceLandPro1k=json.dumps(divorceLandPro1k),
                           divorceLandPercent=json.dumps(divorceLandPercent),
                           divorceMonthly=json.dumps(divorceMonthly),
                           austriaMap=json.dumps(map))



if __name__ == '__main__':
    app.run()
