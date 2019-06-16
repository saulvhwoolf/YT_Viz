import csv
import string
import codecs
import json

def myDate(oldDate):
    dateParts = oldDate.split('.')
    newDate = '20'+dateParts[0]+'-'+dateParts[2]+'-'+dateParts[1]
    return newDate

outputMap= {}
with open('USvideos.csv', encoding = "utf-8") as csvDataFile:
    csvReader = csv.reader(csvDataFile)
    cats = ('0', "Film & Animation", "Autos & Vehicles", '3', '4', '5', '6', '7', '8', '9', "Music", '11',"12", "13", "14", "Pets & Animals", "16", "Sports", "Short Movies", "Travel & Events", "Gaming","Videoblogging", "People & Blogs", "Comedy" , "Entertainment", "News & Politics", "Howto & Style", "Education", "Science & Technology", "Nonprofits & Activism", "Movies", "Anime/Animation", "Action/Adventure", "Classics", "Comedy", "Documentary", "Drama", "Family" "Foreign", "Horror","Sci-Fi/Fantasy","Thriller","Shorts","Shows","Trailers");
    next(csvReader)
    for row in csvReader:
        if(row[0]not in list((outputMap.keys()))):
            category = cats[int(row[4])];
            outputMap[row[0]]= {'dates':{myDate(row[1]):{'views': row[7], 'likes': row[8], 'dislikes': row[9],'comment_count': row[10]}}, 'title': row[2], 'channel_title': row[3], 'category': category, 'publish_time': row[5], 'thumbnail_link': row[11], 'comments_disabled': row[12],	'ratings_disabled': row[13], 'video_error_or_removed': row[14], 'description': row[15]}
            outputMap[row[0]]['tags'] = row[6].replace( '"', '').split('|')
        else:
            outputMap[row[0]]['dates'][myDate(row[1])] = {'views': row[7], 'likes': row[8], 'dislikes': row[9],'comment_count': row[10]}

text_file = codecs.open("allVideos.json", "w", "utf-8")

json.dump(outputMap, text_file)

text_file.close()
