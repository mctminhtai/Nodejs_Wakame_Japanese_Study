import pandas as pd
variety_mappings = {1: 'real', 0: 'fake'}

def load():
    train = pd.DataFrame(pd.read_excel("./Dataset/Constraint_English_Train.xlsx",engine='openpyxl'))
    test = pd.DataFrame(pd.read_excel("./Dataset/Constraint_English_Val.xlsx",engine='openpyxl'))

    train = train.replace(['fake', 'real'],[0, 1])
    test = test.replace(['fake', 'real'],[0, 1])

    

    X_train=train.iloc[0:,1].values
    y_train=train.iloc[0:,-1].values
    X_test=test.iloc[0:,1].values
    y_test=test.iloc[0:,-1].values

    return X_train,X_test,y_train,y_test
