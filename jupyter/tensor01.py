import tensorflow as tf
print("TensorFlow 버전: ",tf.__version__)
print("GPU 사용가능 여부:", tf.config.list_physical_devices('GPU'))

import torch
if torch.cuda.is_available():
    device = torch.device("cuda")
    print("Y")    
else:
    print("X")

import torch
print("", torch.__version__)
print("",torch.cuda.is_available())
