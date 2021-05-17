#!/usr/bin/env python
# coding: utf-8

# In[1]:


import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report
from sklearn.ensemble import RandomForestClassifier


# In[2]:


train = pd.DataFrame(pd.read_excel("Constraint_English_Train.xlsx",engine='openpyxl'))
test = pd.DataFrame(pd.read_excel("Constraint_English_Val.xlsx",engine='openpyxl'))


# In[3]:


print('Shape of Training Data:',train.shape)
print('Shape of Test Data:',test.shape)
print('\n\n TRAIN \n', train.head())
print('\n\n TEST \n',test.head())
print('\n \nNumber of Null values in Train Set: ', train['tweet'].isna().sum())
print('Number of Null values in Test Set: ', test['tweet'].isna().sum())


# In[4]:


length=[]
[length.append(len(str(text))) for text in train['tweet']]
print('TRAIN\nMinimum Length: ', min(length), '\nMaximum Length: ', max(length), '\nAverage Length: ', round(sum(length)/len(length)))
length=[]
[length.append(len(str(text))) for text in test['tweet']]
print('\nTEST\nMinimum Length: ', min(length), '\nMaximum Length: ', max(length), '\nAverage Length: ', round(sum(length)/len(length)))


# In[5]:


X_train=train.iloc[0:,1].values
y_train=train.iloc[0:,-1].values
X_val=test.iloc[0:,1].values
y_val=test.iloc[0:,-1].values
X_train


# In[6]:


tfidf=TfidfVectorizer(stop_words="english",max_df=0.7)
tfidf_train=tfidf.fit_transform(X_train)
tfidf_val=tfidf.transform(X_val)


# In[7]:
 
model = RandomForestClassifier(n_estimators=1000, random_state=0)
model.fit(tfidf_train,y_train)
y_pred=model.predict(tfidf_val)
score=accuracy_score(y_pred,y_val)
print(f'Accuracy: {round(score * 100, 2)}%')
print('\nClassification Report: \n', classification_report(y_val, y_pred))


# In[8]:


from sklearn.metrics import plot_confusion_matrix
import matplotlib.pyplot as plt
import matplotlib
font = {'size'   : 15}
matplotlib.rc('font', **font)
fig, ax = plt.subplots(figsize=(9, 9))
plt.title('Random Forest')
plot_confusion_matrix(model, tfidf_val, y_val, ax=ax, cmap=plt.cm.Blues)
plt.show()

