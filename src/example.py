def add_numbers(a,b):
    result = a+b
    return result
x = 10
y = 20

sum = add_numbers(x,y)
print("Sum is:",sum)

from sklearn.datasets import load_iris
iris = load_iris()
print(iris.feature_names)
print(iris.data[:5])
print(iris.target_names)

