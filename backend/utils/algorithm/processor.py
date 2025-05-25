from catboost import CatBoostClassifier
import pandas as pd
import json
import numpy as np
from scipy.stats import skew, kurtosis

model = CatBoostClassifier(
    iterations=1000,
    learning_rate=0.01,
    cat_features=['buildingType',],
    loss_function='Logloss',
    eval_metric='BalancedAccuracy',
    auto_class_weights='Balanced',
)
model.load_model('utils/algorithm/model/model_1.cbm')


def load_data(path: str = None, json_data: dict = None) -> tuple[pd.DataFrame, pd.Series]:

    if not json_data:
        with open(path, 'r') as f:
            json_data = json.load(f)

    json_data_processed = []

    for i in json_data:
        consumption = {}
        if 'consumption' in i:
            consumption = i.pop('consumption')
            for key, value in consumption.items():
                i[key] = value
        i['consumption'] = list(consumption.values())
        json_data_processed.append(i)

    data = pd.DataFrame(json_data_processed, columns=['1', '10', '11', '12', '2', '3', '4', '5', '6', '7', '8', '9', 'avg',
       'buildingType', 'deviation_from_mean', 'isCommercial', 'kurtosis',
       'median', 'per_person', 'per_room', 'person_room', 'residentsCount',
       'rolling_std_avg_3', 'roomsCount', 'skew', 'std', 'totalArea', 'consumption'])

    data['std'] = data['consumption'].apply(np.std)
    data['avg'] = data['consumption'].apply(np.average)
    data['skew'] = data['consumption'].apply(skew)
    data['kurtosis'] = data['consumption'].apply(kurtosis)
    data['median'] = data['consumption'].apply(np.median)
    data = data.drop('consumption', axis=1)

    data['per_person'] = data['avg']/data['residentsCount']
    data['per_room'] = data['avg']/data['roomsCount']
    data['person_room'] = data['roomsCount']/data['residentsCount']

    mean_avg = data['avg'].mean()
    data['deviation_from_mean'] = (data['avg'] - mean_avg).abs()
    data['rolling_std_avg_3'] = data['avg'].rolling(window=3).std()

    sorted_columns = sorted(data.columns)
    data = data[sorted_columns]

    if 'isCommercial' in data.columns:
        X = data.drop('isCommercial', axis=1)

    return X


def get_answers(data):
    if isinstance(data, dict):
        data = [data]

    X = load_data(json_data=data)

    # preds = model.predict(X).astype(int)

    probas = model.predict_proba(X)

    proba_class_1 = probas[:, 1].round(2) * 100

    return proba_class_1.astype(int).tolist()

