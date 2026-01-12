import pandas as pd
import numpy as np

def process_features(df):

    df = df.copy()


    if 'datetime' in df.columns and df['datetime'].dtype == 'object':
        df['datetime'] = pd.to_datetime(df['datetime'])


    if 'hour' not in df.columns and 'datetime' in df.columns:
        df['hour'] = df['datetime'].dt.hour


    for col in ['season', 'weather', 'holiday', 'workingday']:
        if col in df.columns:
            df[col] = df[col].astype(int)


    expected_cols = ['season', 'holiday', 'workingday', 'weather', 'temperature', 'humidity', 'windspeed', 'hour']

    for col in expected_cols:
        if col not in df.columns:
            df[col] = 0

    return df[expected_cols]
