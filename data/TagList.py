import csv
import pickle
import codecs
with open('USvideos.csv', encoding = "utf-8") as csvDataFile:
    csvReader = csv.reader(csvDataFile)
    next(csvReader)
    allTags = {}
    for row in csvReader:
        tags = row[6].replace('"', '').split('|')
        for t in tags:
            if (t in list(allTags.keys())):
                allTags[t]+=1
            else:
                allTags[t] = 1
    outTags = []
    for key in list(allTags.keys()):
        if (allTags[key] > 9):
            outTags.append(key)
print(len(list(allTags.keys())))
print(len(outTags))

text_file = codecs.open("tags.txt", "w", "utf-8")
text_file.write(str(outTags))
text_file.close()
