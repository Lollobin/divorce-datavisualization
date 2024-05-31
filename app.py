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

    divorceDistrictPro1kDf = pd.read_csv('static/data/scheidung-bezirk-pro1k-2023.CSV', encoding='latin1', delimiter=";")
    divorceDistrictPro1k = divorceDistrictPro1kDf.to_dict('records')

    divorceMarriageDurationDf = pd.read_csv('static/data/scheidung-ehedauer-prozent.CSV',
                                            encoding='latin1', delimiter=";")
    divorceMarriageDuration = divorceMarriageDurationDf.to_dict('records')

    divorceTotal1946Df = pd.read_csv('static/data/scheidung-gesamt-1946.CSV', encoding='latin1', delimiter=";")
    divorceTotal1946 = divorceTotal1946Df.to_dict('records')

    divorceLandAbsoluteDf = pd.read_csv('static/data/scheidung-land-absolut.CSV', encoding='latin1', delimiter=";")
    divorceLandAbsolute = divorceLandAbsoluteDf.to_dict('records')

    divorceLandPro1kDf = pd.read_csv('static/data/scheidung-land-pro1k.CSV', encoding='latin1', delimiter=";")
    divorceLandPro1k = divorceLandPro1kDf.to_dict('records')

    divorceLandPercentDf = pd.read_csv('static/data/scheidung-land-prozent.CSV', encoding='latin1', delimiter=";")
    divorceLandPercent = divorceLandPercentDf.to_dict('records')

    divorceMonthlyDf = pd.read_csv('static/data/scheidung-monat-2005.CSV', encoding='latin1', delimiter=";")
    divorceMonthly = divorceMonthlyDf.to_dict('records')

    # return the index file and the data
    return render_template("index.html",
                           divorceDistricAbsolute=json.dumps(divorceDistrictAbsolute),
                           divorceDistrictPro1k=json.dumps(divorceDistrictPro1k),
                           divorceMarriageDuration=json.dumps(divorceMarriageDuration),
                           divorceTotal1946=json.dumps(divorceTotal1946),
                           divorceLandAbsolute=json.dumps(divorceLandAbsolute),
                           divorceLandPro1k=json.dumps(divorceLandPro1k),
                           divorceLandPercent=json.dumps(divorceLandPercent),
                           divorceMonthly=json.dumps(divorceMonthly))


if __name__ == '__main__':
    app.run()
