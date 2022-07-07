import config
import mysql.connector


#Функция для INSER UPDATE в БД#
def SQLwrite(sql_string):
    connection = mysql.connector.connect(user=config.user, password=config.password, host=config.host, database=config.database)
    #print (sql_string)
    mycursor = connection.cursor()
    mycursor.execute(sql_string)
    connection.commit()
    connection.close()

#Функция для SELECT c БД#    
def SQLselect(sql_string):
    connection = mysql.connector.connect(user=config.user, password=config.password, host=config.host, database=config.database)
    #print (sql_string)
    mycursor = connection.cursor()
    mycursor.execute(sql_string)
    info = mycursor.fetchone()
    return info

def inset_photo_in_files_table(shipment, file_name, user,file, caption):
    connection = mysql.connector.connect(user=config.user, password=config.password, host=config.host, database=config.database)
    mycursor = connection.cursor()
    sql = "INSERT INTO files (shipment, file_name, user, file, caption) VALUES (%s,%s,%s,%s,%s)"
    values = shipment, file_name, user,file, caption
    mycursor.execute(sql,values)
    connection.commit()
    connection.close()

def update_sring(table_name, what_to_update, to_what, column1, condition1, column2, condition2):
    connection = mysql.connector.connect(user=config.user, password=config.password, host=config.host, database=config.database)
    if connection:
        mycursor = connection.cursor()
        sql = "UPDATE {} SET {} = '{}' WHERE {} = '{}' and {}='{}'".format(table_name, what_to_update, to_what, column1, condition1, column2,condition2)
        print (sql)
        mycursor.execute(sql)
        connection.commit()
        connection.close()
