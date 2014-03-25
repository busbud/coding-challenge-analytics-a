import json
import csv


def getCityInfo():
   # read the target file
   json_data=open('data/target-list.json');
   dataTarget = json.load(json_data);

   # read the cities txt file

   d = [];
   with open('data/cities15000.txt','rb') as source:
     for line in source:
        fields = line.split('\t');
        d.append(fields);

   #extract relevant columns from the txt file
   
   dPopulation=[];
   for i in range(len(d[:])):
      dPopulation.append([d[i][8],d[i][0]]);
   
   
   # open the file containing iso3 codes
   
   with open('data/countrycodes.csv', 'rb') as csvfile:
         
      reader = csv.reader(csvfile, delimiter=',')
      included_cols = [3,4]
      content=[];
      for row in reader:
            content.append( list(row[i] for i in included_cols))
         
   

   #Extracting the required info
   infoDataCountry=[];
   
   cityData={"list":[]};
   for i in range(len(content[:])):
          if content[i][0] not in infoDataCountry:
                  infoDataCountry.append(content[i][0]);
                  count=0;
                  countTarget=0;
                  for j in range(len(dPopulation[:])):
                             
                       if dPopulation[j][0]==content[i][1]:
                                 count=count+1;
                                 if int(dPopulation[j][1]) in dataTarget:
                                        countTarget=countTarget+1; 
                  temp={};
                  temp["country"]=content[i][0];
                  temp["count"]=count;
                  temp["countTarget"]=countTarget;
                  cityData["list"].append(temp);
   return json.dumps(cityData); 

                      
                    



