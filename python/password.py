# from werkzeug.security import check_password_hash
# import rsa
# import base64

# def load_keys():
#     with open('public_key.pem', 'rb') as pub_file:
#         public_key = rsa.PublicKey.load_pkcs1(pub_file.read())
#     with open('private_key.pem', 'rb') as priv_file:
#         private_key = rsa.PrivateKey.load_pkcs1(priv_file.read())
#     return public_key, private_key

# def encrypt(password, public_key):
#     encrypted_password = rsa.encrypt(password.encode(), public_key)
#     return base64.b64encode(encrypted_password).decode()

# def decrypt(encrypted_password, private_key):
#     encrypted_password = base64.b64decode(encrypted_password)
#     decrypted_password = rsa.decrypt(encrypted_password, private_key).decode()
#     return decrypted_password

# public_key, private_key = load_keys()