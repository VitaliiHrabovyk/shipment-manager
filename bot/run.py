import threading
from pathlib import Path
from posixpath import split
import telebot
from telebot import types
import mysql.connector
from geopy.distance import geodesic
from datetime import datetime
import base64
from lib import SQLwrite, SQLselect, update_sring, inset_photo_in_files_table # Функции для работы с базой
import config #файл с токеном и подключением к базе

bot = telebot.TeleBot(config.token, parse_mode="HTML")

def check_base_timer():
	path = './img/new.jpg'
	photo = open(path, 'rb')

	try:
		check = SQLselect("SELECT * FROM users WHERE status ='in_processing'")
		user_id = check[2]# выбираем ID в переменную
		markup = types.ReplyKeyboardMarkup(resize_keyboard=True)
		accept_btn = types.KeyboardButton('Принять рейс')
		rejebt_btn = types.KeyboardButton('Отмена')
		markup.add(accept_btn)
		markup.add(rejebt_btn)
		path = 'img/new.jpg'
		photo = open(path, 'rb')
		select_from_shipment = SQLselect(f"SELECT * FROM shipments WHERE user ='{user_id}' and status='in_processing'")      
		shipment_message ="Вам назначен рейс №{}\nЗагрузка: {}\nВыгрузка: {}\nДата/время погрузки: {}\nДата/время выгрузки: {}\nКомментарий к рейсу : {}".format(select_from_shipment[0], select_from_shipment[1], select_from_shipment[2], datetime.fromtimestamp(select_from_shipment[3]), datetime.fromtimestamp(select_from_shipment[4]), select_from_shipment[8])
		bot.send_photo(user_id, photo, caption=shipment_message, reply_markup=markup)
		SQLwrite(f"UPDATE users SET current_shipment = '{select_from_shipment[0]}' WHERE user_id = '{user_id}' and status='in_processing'")
		SQLwrite(f"UPDATE shipments SET status = 'waiting_for_an_answer' WHERE user = '{user_id}' and status='in_processing'")
		SQLwrite(f"UPDATE users SET status = 'waiting_for_an_answer' WHERE user_id = '{user_id}' and status='in_processing'")
	except:
		print("SQL_chek. No data")
	threading.Timer(10, check_base_timer).start() # Повтор функции каждые 10 секунд
check_base_timer()


@bot.message_handler(content_types=['text', 'location']) #Фильтр всех текстовых сообщений и точек локации
def get_status(message):
    status = SQLselect(f"SELECT * FROM users WHERE user_id ='{message.chat.id}'")
    try:
        if(status[3] == "free"):
            bot.send_message(message.chat.id, f"У вас нет назначенных рейсов. Ожидайте назначение!")

        if(status[3] == "waiting_for_an_answer"):
            if (message.text == "Принять рейс"):
                waiting_for_an_answer(message)
            elif(message.text == "Отмена"):
                 bot.send_message(message.chat.id, "Вы отказались от рейса")
            else:
                 bot.send_message(message.chat.id, "Используйте кнопки для ответа")

        if(status[3] == "accepted"):
            accepted(message)

        if(status[3] == "on_loading"):
            if (message.text == "Готово. Документы погрузки отправлены"):
                on_loading(message)
            else:
                 bot.send_message(message.chat.id, "Пожалуйста пришлите фото документов или нажмите готово, если все фото загружены")

        if(status[3] == "in_transit"):
           in_transit(message)
            
        if(status[3] == "on_uploading"):
            if (message.text == "Готово. Документы выгрузки отправлены"):
                on_uploading(message)
            else:
                 bot.send_message(message.chat.id, "Пожалуйста пришлите фото документов или нажмите готово, если все фото загружены")

        if(status[3] == "on_uploading_got_pictures"):
            if (message.text == "Завершить рейс"):
                on_uploading_got_pictures(message)
            else:
                 bot.send_message(message.chat.id, "Подтвердите завершение рейса")
    except:
        if (status):
            bot.send_message(message.chat.id, "ERROR!")
        else:
            registration(message)
        

    
#Функции этапов рейса

def on_uploading_got_pictures(message):
	markup = types.ReplyKeyboardMarkup(resize_keyboard=True)
	markup = types.ReplyKeyboardRemove(selective=False) #убираем кнопки
	update_sring("shipments", "status", "delivered", "user", message.chat.id, "status", "on_uploading_got_pictures")
	update_sring("users", "status", "free", "user_id", message.chat.id, "status", "on_uploading_got_pictures")
	bot.send_message(message.chat.id, "Спасибо. Ожидайте следующего назначения.", reply_markup=markup)


def on_uploading(message):
	markup = types.ReplyKeyboardMarkup(resize_keyboard=True)
	itembtn1 = types.KeyboardButton('Завершить рейс')
	markup.add(itembtn1)
	update_sring("shipments", "status", "on_uploading_got_pictures", "user", message.chat.id, "status", "on_uploading")
	update_sring("users", "status", "on_uploading_got_pictures", "user_id", message.chat.id, "status", "on_uploading")
	bot.send_message(message.chat.id, "Документы получены. Подтвердите завершение рейса", reply_markup=markup)


def in_transit(message):
		if(message.content_type == "location"):
			coordinates_uploading = SQLselect(f"SELECT * FROM shipments WHERE status ='in_transit' and user ='{message.chat.id}'")
			current_coordinates = "{}, {}".format(message.location.latitude, message.location.longitude)
			distance = geodesic(coordinates_uploading[6] , current_coordinates).meters
			if(distance<1000000):
				markup = types.ReplyKeyboardMarkup(resize_keyboard=True)
				itembtn1 = types.KeyboardButton('Готово. Документы выгрузки отправлены',)
				markup.add(itembtn1)
				bot.send_message(message.chat.id, "До точки выгрузки {} метров.\nПожалуйста отправьте фото документов!".format(round(distance)), reply_markup=markup)
				update_sring("shipments", "coordinates_load_arrival", "{}, {}".format(message.location.latitude,message.location.longitude ), "user", message.chat.id, "status", "accepted")	
				update_sring("shipments", "status", "on_uploading", "user", message.chat.id, "status", "in_transit")
				update_sring("users", "status", "on_uploading", "user_id", message.chat.id, "status", "in_transit")
			else:
				bot.send_message(message.chat.id,f"До точки выгрузки более 1 км. ({round(distance)} метров). Пожалуйста повторите отправку позиции когда будете на месте!")
		else:
			bot.send_message(message.chat.id,"Пожалуйста воспользуйтесь кнопкой для отправки вашей гео-позиции")


def on_loading(message):
	markup = types.ReplyKeyboardMarkup(resize_keyboard=True)
	itembtn1 = types.KeyboardButton('Прибыл на выгрузку', request_location=True,)
	markup.add(itembtn1)
	get_location = SQLselect(f"SELECT * FROM shipments WHERE user ='{message.chat.id}' and status = 'on_loading'")
	get_location = get_location[6].split(", ")
	update_sring("shipments", "status", "in_transit", "user", message.chat.id, "status", "on_loading")
	update_sring("users", "status", "in_transit", "user_id", message.chat.id, "status", "on_loading")
	bot.send_message(message.chat.id, "Документы получены. Следуйте на точку выгрузки", reply_markup=markup)
	bot.send_location(message.chat.id, get_location[0], get_location[1])


def accepted(message):
		if(message.content_type == "location"):
			coordinates_loading = SQLselect(f"SELECT * FROM shipments WHERE status ='accepted' and user ='{message.chat.id}'")
			current_coordinates = "{}, {}".format(message.location.latitude, message.location.longitude)
			distance = geodesic(coordinates_loading[5] , current_coordinates).meters
			if(distance<1000000):
				markup = types.ReplyKeyboardMarkup(resize_keyboard=True)
				itembtn1 = types.KeyboardButton('Готово. Документы погрузки отправлены',)
				markup.add(itembtn1)
				bot.send_message(message.chat.id, "До точки погрузки {} метров.\n Пожалуйста отправьте фото документов!".format(round(distance)), reply_markup=markup)
				update_sring("shipments", "coordinates_load_arrival", "{}, {}".format(message.location.latitude,message.location.longitude ), "user", message.chat.id, "status", "accepted")	
				update_sring("shipments", "status", "on_loading", "user", message.chat.id, "status", "accepted")
				update_sring("users", "status", "on_loading", "user_id", message.chat.id, "status", "accepted")
			else:
				bot.send_message(message.chat.id,f"До точки погрузки более 1 км. ({round(distance)} метров) Пожалуйста повторите отправку позиции когда будете на месте!")
		else:
			bot.send_message(message.chat.id,"Пожалуйста воспользуйтесь кнопкой для отправки вашей гео-позиции")

def waiting_for_an_answer(message):
	markup = types.ReplyKeyboardMarkup(resize_keyboard=True)
	itembtn1 = types.KeyboardButton('Прибыл на загрузку', request_location=True,)
	markup.add(itembtn1)
	msg = bot.send_message(message.chat.id, "Вы приняли рейс, спасибо! Следуйте на точку погрузки в назначенное время", reply_markup=markup)
	get_location = SQLselect(f"SELECT * FROM shipments WHERE user ='{message.chat.id}' and status ='waiting_for_an_answer'")
	get_location = get_location[5].split(", ")
	bot.send_location(message.chat.id, get_location[0],get_location[1])
	update_sring("shipments", "status", "accepted", "user", message.chat.id, "status", "waiting_for_an_answer")
	update_sring("users", "status", "accepted", "user_id", message.chat.id, "status", "waiting_for_an_answer")




#Функции регистрации

def registration(message):
    markup = types.ReplyKeyboardMarkup(resize_keyboard=True)
    itembtn1 = types.KeyboardButton('Регистрация')
    markup.add(itembtn1)    
    msg = bot.send_message(message.chat.id,message.chat.first_name+", Вы не зарегистириованы - Пожалуйста пройдите регистрацию", reply_markup=markup)
    bot.register_next_step_handler(msg, process_name_step)

def process_name_step(message):
    connection = mysql.connector.connect(user=config.user, password=config.password, host=config.host, database=config.database)
    mycursor = connection.cursor()
    sql = "INSERT INTO users (user_id, truck, full_name, status) VALUES (%s,%s,%s,%s)"
    val = (message.chat.id, "truck", message.chat.first_name, "free")
    mycursor.execute(sql, val)
    connection.commit()
    connection.close()

    markup = types.ReplyKeyboardRemove(selective=False) #убираем кнопки
    msg = bot.send_message(message.chat.id, "Введите полное имя:",reply_markup=markup )
    bot.register_next_step_handler(msg, process_truck)

def process_truck(message):
	SQLwrite(f"UPDATE users SET full_name = '{message.text}' WHERE user_id = '{message.chat.id}'")
	msg = bot.send_message(message.chat.id, "Введите номер авто/прицепа в следующем формате: АА1010ВВ; АА2020ВВ")
	bot.register_next_step_handler(msg, registration_over)

def registration_over(message):
	SQLwrite(f"UPDATE users SET truck = '{message.text}' WHERE user_id = '{message.chat.id}'")
	bot.send_message(message.chat.id, "Регистарция завершена 👍. Ожидайте назначение на рейс.")


# Ответ на остальные типи контента
@bot.message_handler(content_types=['document', 'audio', 'sticker', 'video', 'video_note', 'voice', ]) 
def document(message):
	bot.reply_to(message,"Извините, Документ не поддерживается. Отправьте фото!")	



# Функция сохранения фото
@bot.message_handler(content_types=['photo']) 
def save_photo(message):
		try:
			Path(f'./files/{message.chat.id}/photos').mkdir(parents=True, exist_ok=True) # создадим папку если её нет
			file_info = bot.get_file(message.photo[len(message.photo) - 1].file_id) # сохраним изображение
			downloaded_file = bot.download_file(file_info.file_path)
			src = f'./files/{message.chat.id}/' + file_info.file_path
			with open(src, 'wb') as new_file:
				new_file.write(downloaded_file)

				# откроем файл на чтение  преобразуем в base64
				with open(f'files/{message.chat.id}/{file_info.file_path}', "rb") as image_file:
					encoded_string = str(base64.b64encode(image_file.read()))
					x = encoded_string.replace("b\'", "")
					x = x.replace("'", "")
					y = SQLselect(f"SELECT * FROM shipments WHERE user ='{message.chat.id}' and status ='on_loading'")
					inset_photo_in_files_table(y[0],file_info.file_unique_id,message.chat.id, x, 'on_loading')
			bot.reply_to(message,"Фото добавлено к рейсу № {}".format(y[0]))

		except:
			try:
				Path(f'files/{message.chat.id}/photos').mkdir(parents=True, exist_ok=True) # создадим папку если её нет
				file_info = bot.get_file(message.photo[len(message.photo) - 1].file_id) # сохраним изображение
				downloaded_file = bot.download_file(file_info.file_path)
				src = f'files/{message.chat.id}/' + file_info.file_path
				with open(src, 'wb') as new_file:
					new_file.write(downloaded_file)

					# откроем файл на чтение  преобразуем в base64
					with open(f'files/{message.chat.id}/{file_info.file_path}', "rb") as image_file:
						encoded_string = str(base64.b64encode(image_file.read()))
						x = encoded_string.replace("b\'", "")
						x = x.replace("'", "")
						y = SQLselect(f"SELECT * FROM shipments WHERE user ='{message.chat.id}' and status ='on_uploading'")
						inset_photo_in_files_table(y[0],file_info.file_unique_id,message.chat.id,x, 'on_uploading')
				bot.reply_to(message,"Фото добавлено к рейсу № {}".format(y[0]))	
			except:
				bot.reply_to(message,"UPLOADING ERROR\nВы должны быть в точке погрузки или выгрузки для добавления фото.")	

bot.infinity_polling()