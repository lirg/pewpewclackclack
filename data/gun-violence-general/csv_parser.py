# Used to parse big gun violence data file, only kept fatal gun violence
import csv
input = open('gun-violence-data_01-2013_03-2018.csv', 'rb')
output = open('gun-violence-general-edit1.csv', 'wb')
writer = csv.writer(output)
for row in csv.reader(input):
    if row[5]!= '0':
        writer.writerow(row)
input.close()
output.close()
