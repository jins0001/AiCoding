import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(-5,5,100)
relu = np.maximum(0,x)
sigmoid = 1 /(1+np.exp(-x))
tanh = np.tanh(x)

plt.plot(x, relu, label="ReLU")
plt.plot(x,sigmoid, label="Sigmoid")
plt.plot(x,tanh, label="Tanh")
plt.legend()
plt.show()

