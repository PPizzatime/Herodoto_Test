import urllib.request
import json

url = 'https://xyrvjfhalabgfaktcmsn.supabase.co/auth/v1/signup'
headers = {'apikey': 'sb_publishable_BghbLvfmswri2_0YAlSASA_kins7HDi', 'Content-Type': 'application/json'}
users = ['consumer@herodoto.app', 'employee@herodoto.app', 'manager@herodoto.app', 'admin@herodoto.app']

for u in users:
    data = json.dumps({'email': u, 'password': 'password123'}).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers=headers, method='POST')
    try:
        with urllib.request.urlopen(req) as response:
            print(f'Success {u}')
    except urllib.error.HTTPError as e:
        print(f'Error {u}:', e.code, e.read().decode())
