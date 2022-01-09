import json
import requests



# json_str = json.dumps(json_object)


# name = "ahmssed"


auth_token='9c7eabce2e356a5012bfec85dd946e9dd85b1a6d'
hed = {'Authorization': 'Token ' + auth_token}
# data = {'json_object' : json_object, "name": name}

url = 'http://localhost:8000/api/minipillar/records'
response = requests.get(url, headers=hed)
print(response)
data = response.json()
for row in data["items"]:
    print(row["latitude"])
    print("###############################")