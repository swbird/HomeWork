import os 
import re

filepath = "..\\contracts\\"
allfile = []
for i in os.walk(filepath):
    for t in i[2]:
        file = i[0]+"\\"+t
        if file[-4:] == ".sol": 
            allfile.append(file)
regex = r"=(0\.[0-9]{1}\.[0-9]{1,2})"
regex_new = r"pragma solidity ([\.0-9\^\>\=]{3,40});"
for i in allfile:
    with open(i,"r",encoding="utf-8") as r:
        result = r.read()
        content = re.findall(regex_new, result, re.S)
        if len(content)==0:
            continue
        result = result.replace(f"{content[0]}",f">=0.6.6")
    with open(i, "w",encoding="utf-8") as w:
        w.write(result)
print('Done')