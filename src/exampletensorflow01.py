import tensorflow as tf
import torch

print("Tensorflow version : ", tf.__version__)
print("GPU 사용가능 여부:", tf.config.list_physical_devices('GPU'))
print("PyTorch",torch.cuda.is_available())


