import os

key = """-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDHxAF/GtoSoWmi
gCnzFDb9cQMdcos15fg5q8lX4kaityEfhiaP59ttZvJ1bp+XSSqdJV/M58tzxlbk
PEDfbIPpLblfBL+CkHo3L4SqaNBUOqQY2umNkqY0EHDjQRNCEQULIVjMdk2iSdui
T0sBwFoUZlVrg9Fz07bh/AK8PgpujoSDOe5lIdaL9Q/RUdSGGSQqjm9h4cHlZpNa
d25WIMzfnXVok3MxKu3zeH/+54YNzduwQp48i+TVaZ6M7ZRUCaerbSmL9JDbHsKp
seHhbU7/z+HmjbQCX38poh2LdHGDtyRBNyFavO5ipt91sA0c8cvOi96xEs2oE1xe
je9t4vXDAgMBAAECggEAReOgxGfQEMGRFA2z33vci0nNFbHb23UEJaUg0ZL0NHxO
ZdmIx0MOZVWlkQktY3/xHT6UqDsWVoB3KO2doq0z71IUbxZZrCPA5mrFBtuZu0Yy
4BFCscmzRTbVT+SWCMCsm4rEpu/i1FrzsPL94nR573Yn/3AESPoymxiQmmw4ORoc
H6IR8Q6lVkjg9fBd7Fuv64iLikGbzXyZ5njPgVFEIIZ+xNDbP4hzRznLZmWvJj8t
424i7gCXsoceWv4ACJ5L2oaVLZY20Oxn3lmIUGeKFcI1TpOUjL391GSD9iyDcLbQ
U42BdTB9AfzdC1peuiLiP51tmNJK+Q1phy2iQ1zQ2QKBgQDn/EskuCqvDRNIqFva
Ia23wQ3i2EUYBscSCQkM6M+EsWBl7Q0YIjCG4NabNlu7A/XwfU0VoC1qbEKbUqaX
6mmJlwHht9eF+jye2x/WJY6vITx/9mUiRVDnmt9BvjdkuOtXDyHFlrfRouwLdiPX
WemXTVdaHDxOgYued6JuS7u/2wKBgQDccd+GMpsMcXnMwXqIP5zMWJ2BRL/Q/FLL
2aYvKP1IF/fgwi0sY7Jwls9lVMSmrg/xpU0TVKH8aSeJ5n7juxDf5cFLaSLFc7mP
/orqQYHCLqM/XLDFfxtTN5RyXI9kQeLikTTtg2hrIObHg2AhDlb3HmcfHYix1h7C
uW/Z4psaOQKBgQDluiajlyjVrqoRAn/rE/zWgfwBTs+lSljqWD45JXcS3SAr70JP
StQpTQ/YJk1SdkqfO0YRi0xOHiUbcQ5+U+jtErgPUSHBkBtl6HKvewPAE7a4tURT
WrcSk4BQt1Bdku2iid6Ur3sawy7i7rvxbx1t8m31Uw65Y3nilHAqrx6ejwKBgFkX
8MX09/McfaSCYbplM0LnYajYF0ooYHIg4ehXgZ48iaMd91HkbT7RxLpoex3+ZVU9
gJwabWltOlyiepAhj51d5zRKJpJ0xf9rWct5dC792F6IYK1BRNLqOKXLwOw9MKxv
EVwY6v+5CWyDLTvO5tjzQawyrIdrSX1botgFnLgJAoGALSy+3VC6YQQ2/AwF2Is+
sfWRtZuP//s9FRp9BBIBhjaZgQDZOLNIZ9TAwj8XofrkV8T4TPqzYlHOxTyeHkgw
8Rmd7f8Yre5xLQw9y25Dnl4HQYvIRZvWjtAzMjrKukPvRNvbADFJylM8w0U2TTIB
GA+imRbLGHjV0Eaednn9voY=
-----END PRIVATE KEY-----
"""

env_path = os.path.join(os.path.dirname(__file__), "..", ".env.local")
env_path = os.path.abspath(env_path)

with open(env_path, "r") as f:
    content = f.read()

if "FIREBASE_PRIVATE_KEY=" in content:
    print("FIREBASE_PRIVATE_KEY already present, skipping.")
else:
    # Escape newlines for dotenv format
    escaped = key.strip().replace("\n", "\\n")
    with open(env_path, "a") as f:
        f.write(f'\nFIREBASE_PRIVATE_KEY="{escaped}"\n')
    print("Added FIREBASE_PRIVATE_KEY to .env.local")
