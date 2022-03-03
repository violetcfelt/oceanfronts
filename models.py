import tensorflow as tf
from tensorflow.keras.layers import Input, Conv2D, MaxPool2D, Conv2DTranspose
from tensorflow.keras import Model
from tensorflow.keras.applications.vgg16 import VGG16

def HED():
  vgg = VGG16(input_shape=[224,224,3], weights='imagenet', include_top=False)
  vgg.trainable = False
  input = Input(shape=(224,224,3))
  x = vgg.get_layer('block1_conv1')(input)
  x = vgg.get_layer('block1_conv2')(x)
  side1 = Conv2D(filters=64, kernel_size=3, padding='SAME')(x)
  side1 = Conv2DTranspose(filters=2, kernel_size=3, strides=1, padding='SAME')(side1)
  x = vgg.get_layer('block1_pool')(x)
  x = vgg.get_layer('block2_conv1')(x)
  x = vgg.get_layer('block2_conv2')(x)
  side2 = Conv2D(filters=128, kernel_size=3, padding='SAME')(x)
  side2 = Conv2DTranspose(filters=2, kernel_size=3, strides=2, padding='SAME')(side2)
  x = vgg.get_layer('block2_pool')(x)
  x = vgg.get_layer('block3_conv1')(x)
  x = vgg.get_layer('block3_conv2')(x)
  x = vgg.get_layer('block3_conv3')(x)
  side3 = Conv2D(filters=256, kernel_size=3, padding='SAME')(x)
  side3 = Conv2DTranspose(filters=2, kernel_size=3, strides=4, padding='SAME')(side3)
  x = vgg.get_layer('block3_pool')(x)
  x = vgg.get_layer('block4_conv1')(x)
  x = vgg.get_layer('block4_conv2')(x)
  x = vgg.get_layer('block4_conv3')(x)
  side4 = Conv2D(filters=512, kernel_size=3, padding='SAME')(x)
  side4 = Conv2DTranspose(filters=2, kernel_size=3, strides=8, padding='SAME')(side4)
  x = vgg.get_layer('block4_pool')(x)
  x = vgg.get_layer('block5_conv1')(x)
  x = vgg.get_layer('block5_conv2')(x)
  x = vgg.get_layer('block5_conv3')(x)
  side5 = Conv2D(filters=512, kernel_size=3, padding='SAME')(x)
  side5 = Conv2DTranspose(filters=2, kernel_size=3, strides=16, padding='SAME')(side5)
  side_outputs = [side1, side2, side3, side4, side5]
  output = Conv2D(filters=2, kernel_size=3, padding='SAME', activation='sigmoid')(tf.concat(side_outputs, axis=3))
  model = Model(inputs=input, outputs=output)
  return model

def CEDN():
  vgg = VGG16(input_shape=[224,224,3], weights='imagenet', include_top=False)
  vgg.trainable = False
  input = Input(shape=(224,224,3))
  x = vgg.get_layer('block1_conv1')(input)
  x = vgg.get_layer('block1_conv2')(x)
  x = vgg.get_layer('block1_pool')(x)
  x = vgg.get_layer('block2_conv1')(x)
  x = vgg.get_layer('block2_conv2')(x)
  x = vgg.get_layer('block2_pool')(x)
  x = vgg.get_layer('block3_conv1')(x)
  x = vgg.get_layer('block3_conv2')(x)
  x = vgg.get_layer('block3_conv3')(x)
  x = vgg.get_layer('block3_pool')(x)
  x = vgg.get_layer('block4_conv1')(x)
  x = vgg.get_layer('block4_conv2')(x)
  x = vgg.get_layer('block4_conv3')(x)
  x = vgg.get_layer('block4_pool')(x)
  x = vgg.get_layer('block5_conv1')(x)
  x = vgg.get_layer('block5_conv2')(x)
  x = vgg.get_layer('block5_conv3')(x)
  x = vgg.get_layer('block5_pool')(x)
  x = Conv2D(filters=4096, kernel_size=3, padding='SAME')(x)
  #start of decoding layers
  x = Conv2DTranspose(filters=512, kernel_size=1, padding='SAME', activation='relu')(x)
  x = Conv2DTranspose(filters=256, kernel_size=5, padding='SAME', activation='relu')(x)
  x = Conv2DTranspose(filters=128, kernel_size=5, padding='SAME', activation='relu')(x)
  x = Conv2DTranspose(filters=64, kernel_size=5, padding='SAME', activation='relu')(x)
  x = Conv2DTranspose(filters=32, kernel_size=5, padding='SAME', activation='relu')(x)
  output = Conv2DTranspose(filters=2, kernel_size=5, padding='SAME', activation='sigmoid')(x)
  model = Model(inputs=input, outputs=output)
  return model