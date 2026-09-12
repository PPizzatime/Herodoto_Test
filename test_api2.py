import urllib.request
import json

url = 'https://xyrvjfhalabgfaktcmsn.supabase.co/auth/v1/token?grant_type=password'
data = json.dumps({'email': 'nonexistent@test.com', 'password': 'password123'}).encode('utf-8')
req = urllib.request.Request(url, data=data, headers={'apikey': 'sb_publishable_BghbLvfmswri2_0YAlSASA_kins7HDi', 'Content-Type': 'application/json'}, method='POST')

try:
    with urllib.request.urlopen(req) as response:
        print('SUCCESS:', response.read().decode()[0:100])
except urllib.error.HTTPError as e:
    print('Error:', e.code)
    print(e.read().decode())
