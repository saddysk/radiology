import requests
import pandas as pd
import re


def create_email_from_name(name):
    cleaned_string = re.sub(r'[^A-Za-z0-9\s]', '', name)
    formated_string = cleaned_string.replace(' ', '.').strip('.')
    formated_string = formated_string.lower()

    email = f"{formated_string}@gmail.com"
    return email


def send_post_request(doctor_name, email):
    url = "http://localhost:3010/api/auth"
    data = {
        "name": doctor_name,
        "email": email,
        "password": "doc@123",
        "role": "doctor"
    }
    try:
        response = requests.post(url, json=data)

        if response.status_code != 200:
            raise Exception(
                f"HTTP error - {email} {response.status_code}: {response.text}")
    except Exception as e:
        return str(e)


def process_doctors_data(file_path):
    df = pd.read_csv(file_path)
    failed_rows = []

    print('Looping through each row and storing...')
    for index, row in df.iterrows():
        doctor_name = row['DOCTOR NAME']
        email = create_email_from_name(doctor_name)
        request_error = send_post_request(doctor_name, email)

        if request_error:
            failed_rows.append((index+1, doctor_name, request_error))

    return failed_rows


# usage
failed_rows = process_doctors_data('./assets/doctors.csv')

if failed_rows:
    for failure in failed_rows:
        print(f"Row {failure[0]}: {failure[1]}\n{failure[2]}\n")
else:
    print("All rows processed successfully")
