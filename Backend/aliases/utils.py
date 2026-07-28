import base64
import os
import random
import string
import uuid

from cryptography.hazmat.primitives import padding
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from decouple import config


def _get_key():
    key_bytes = base64.b64decode(config('AES_KEY'))
    if len(key_bytes) != 32:
        raise ValueError('AES_KEY must decode to exactly 32 bytes for AES-256')
    return key_bytes


def encrypt(plain_text, iv=None):
    key = _get_key()

    if iv is None:
        iv = os.urandom(16)
    elif isinstance(iv, str):
        iv = base64.b64decode(iv)

    padder = padding.PKCS7(algorithms.AES.block_size).padder()
    padded_data = padder.update(plain_text.encode("utf-8")) + padder.finalize()

    cipher = Cipher(algorithms.AES(key), modes.CBC(iv))
    encryptor = cipher.encryptor()
    ciphertext = encryptor.update(padded_data) + encryptor.finalize()

    return (
        base64.b64encode(ciphertext).decode("utf-8"),
        base64.b64encode(iv).decode("utf-8"),
    )


def decrypt(ciphertext_b64, iv_b64):
    key = _get_key()
    ciphertext = base64.b64decode(ciphertext_b64)
    iv = base64.b64decode(iv_b64)

    cipher = Cipher(algorithms.AES(key), modes.CBC(iv))
    decryptor = cipher.decryptor()
    padded_data = decryptor.update(ciphertext) + decryptor.finalize()

    unpadder = padding.PKCS7(algorithms.AES.block_size).unpadder()
    plain_bytes = unpadder.update(padded_data) + unpadder.finalize()

    return plain_bytes.decode('utf-8')


def generate_alias():
    uuid_part = uuid.uuid4().hex[:8].upper()
    suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
    return f"STU-{uuid_part}-{suffix}"