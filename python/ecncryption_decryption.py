from Crypto.Cipher import PKCS1_OAEP
from Crypto.PublicKey import  RSA

def get_keys():
    with open(r"C:\Users\interndig\Music\login\login\public_key.pem", "r") as file:
        file_content = file.read()
        if not file_content:
            return "Public key nahi mili"
        pu_key = RSA.import_key(file_content)

    with open(r"C:\Users\interndig\Music\login\login\private_key.pem", "r") as file:
        file_content = file.read()
        if not file_content:
            return "Private key nahi mili"
        pr_key = RSA.import_key(file_content)
    return pu_key, pr_key


def foo(size):
    return b'\x0f\xdf\xd9\x9ef\xf9\xb75g*\xf8\x86*\xb1\xe9\xdaL\xf5\xc8k'

def encrypt(parameter, pu_key):
    if not parameter:
        return "Nahi hua"
    parameter_convert_to_bytes = parameter.encode('utf-8')
    cipher = PKCS1_OAEP.new(key = pu_key, randfunc = foo)
    encrypted_parameter = cipher.encrypt(parameter_convert_to_bytes)
    return encrypted_parameter

def decrypt(parameter, pr_key):
    if not parameter:
        return parameter
    cipher = PKCS1_OAEP.new(key = pr_key)
    decrypted_converted_to_bytes = cipher.decrypt(parameter)
    decypted_value = decrypted_converted_to_bytes.decode('utf-8')
    return decypted_value