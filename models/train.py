import numpy as np
import pandas as pd
import tensorflow as tf

from sklearn.preprocessing import StandardScaler

# Import the dataset
df = pd.read_csv('phishing_websites.csv')

# Take out first column of IDs
df = df.iloc[:, 1:]

# The training data is categorical data that has already been preprocessed
# Each category indicates what that feature alone predicts about the website:
# Key: 1 = Phishing, 0 = Suspicious, -1 = Legitimate
X = df.iloc[:, :-1].values
y = df.iloc[:, -1].values

# Feature scaling
sc = StandardScaler()
X = sc.fit_transform(X)

# Build the ANN
ann = tf.keras.models.Sequential()

# Add input layer and three hidden layers
ann.add(tf.keras.layers.Dense(units=30, activation='relu'))
ann.add(tf.keras.layers.Dense(units=30, activation='relu'))
ann.add(tf.keras.layers.Dense(units=30, activation='relu'))

# Add output layer
ann.add(tf.keras.layers.Dense(units=1))

# Compile the ANN
ann.compile(optimizer = 'adam', loss = 'mean_squared_error')

# Train the ANN
ann.fit(X, y, batch_size = 32, epochs = 100)

# Save the ANN
ann.save('saved_model.pb')