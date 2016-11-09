import os, sys, json
from glob import glob
labels = ['collegeName','courseName','sectionTitle']
parents = ['calendarYear','term','subject','course']
parentLabels = ['year','semester','collegeName','courseTitle']

def getSubDirs(a_dir):
    return [name for name in os.listdir(a_dir)
                if os.path.isdir(os.path.join(a_dir, name))]

def format(filePath,level):
    if level != -1:
        checkDir("formatted/"+filePath)
    else:
        filePath = filePath.replace('.json','')
    with open(filePath+'.json',"r+") as jsonFile:    
        data=jsonFile.read().replace('.xml','.json');
        data=data.replace('http://courses.illinois.edu/cisapp/explorer/schedule','');
        #data=data.replace('content',labels[level]);
        parsed = json.loads(data)
        data =  json.dumps(parsed,indent=4, sort_keys=True)
        with open("formatted/"+filePath+".json","w") as newfile:
            newfile.write(data)
    if level != -1:
        subDirs = getSubDirs(filePath)
        if (len(subDirs)==0):
            for x in os.listdir(filePath):
                format(filePath+'/'+x,-1)
        else:
            for x in subDirs:
                format(filePath+'/'+x,level+1)

def checkDir(f):
    if not os.path.exists(f):
        os.makedirs(f)

checkDir('formatted')
checkDir('formatted/2017')
format('2017/spring',0)
