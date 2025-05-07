# %%
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score


# %%
iris=load_iris()

# %%
df = pd.DataFrame(iris.data, columns=iris.feature_names)
df['target']=iris.target
df['species']=df['target'].apply(lambda x : iris.target_names[x])
df.head()
                 

# %%
sns.pairplot(df,hue='species')
plt.show()

# %%
X = df[iris.feature_names]
y = df['target']
X_train, X_text, y_train, y_test = train_test_split(
    X,y,test_size=0.2, random_state=42
)

# %%
model = RandomForestClassifier(random_state=42)
model.fit(X_train,y_train)

# %%
y_pred = model.predict(X_text)
print("정확도:", accuracy_score(y_test,y_pred))
print("분류 보고서:\n",classification_report(y_test,y_pred,target_names=iris.target_names))

new_data =[[5.1,3.5,1.4,0.2]]
prediction = model.predict(new_data)
print("예측된 품종:",iris.target_names[prediction[0]])

# %%
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC

from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split

iris = load_iris()
X = iris.data
y = iris.target

X_train, X_test, y_train, y_test = train_test_split(X,y,test_size=0.2, random_state = 42)

from sklearn.metrics import accuracy_score

def train_and_evaluate(model):
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    acc =accuracy_score(y_test, y_pred)
    print(f"{model.__class__.__name__} 정확도: {acc:2f}")

models = [
      LogisticRegression(max_iter=200) ,
      DecisionTreeClassifier(),
      RandomForestClassifier(),
      SVC()
        ]

for m in models:
    train_and_evaluate(m)

# %%
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('svc', SVC())
])

pipeline.fit(X_train, y_train)
print("SVC with scaling 정확도:", pipeline.score(X_test, y_test))


# %%
from sklearn.model_selection import cross_val_score
scores =  cross_val_score(RandomForestClassifier(),X,y,cv=5)
print("교차 검증 정확도 평균;", scores.mean())



