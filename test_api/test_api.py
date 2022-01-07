import json
import requests



# json_str = json.dumps(json_object)


# name = "ahmssed"


auth_token='94760c704091c517d5eff3a2e03414be867fd3ec'
hed = {'Authorization': 'Token ' + auth_token}
# data = {'json_object' : json_object, "name": name}

url = 'http://localhost:8000/api/minipillar/records'
response = requests.get(url, headers=hed)
print(response)
print(response.json())