import requests
import pandas as pd

AUTH_TOKEN = '''eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NUb2tlbiI6ImV5SmhiR2NpT2lKU1V6STFOaUlzSW5SNWNDSTZJa3BYVkNKOS5leUoxYzJWeUlqb2lNR1ppTTJaa05UY3RNbUZoWXkwMFpHRXhMVGxrTjJFdE1qTTVZbUUwWm1JeU9UbGtJaXdpYVdGMElqb3hOekF4TVRjNE56WTRmUS5uSW1PN2tEV25nUlRON2J6SF95SEF1aTd4dVZhWF9VSF8wYWRtNHBFR1Bha1M4aExHT2U2MDNITWZKeEQtRWdTZlhWV3VwSmJWNXdEbWowcnEtR0I5SUdZNkhMU0UzUDdyYnFkY0lOdzBHOE9XVHFLY2QtM1NyRXFZOTItNTZ2NHE0U3M2dEhCQTZzVk1JZDFsMXVCdFdPdThndDNRc1k1VU1UbEtlc1BBVm50OVgtZDRxXzlvaVk4UjRUMk1KZVJMeEhaQ2Zma1NOLUlua0NCbGhBcmJJRmFpWHdfLTdqNFgwUUFLbUkxS2xhWndQdWhlenNjZ2wwQUdXMGpIbmN1UjdWRmdSYmhYdXpINHNpbWE3bkI3aUM5MkUwNlUyRkgtNnFfV3MxUDNlYnJtSmM0M2ZNRkt2VDlrUmYyS2ZwRGFUZUhTdmtXaTRCR2dHY0NHbVU1clEiLCJpYXQiOjE3MDExNzg3Njh9.UtCzmpmfjGsXmZ9_SnzjqGE2THWabj5Rw3B2mac73Fi9Ga3yU-suCHKG07xp2gde0BeOCgNIoDjoSyxoJbO0szs9zINCR3QR_FQLFyt2qgVk6QIlgGfmreWTh-yGHZY7AOMf3lUs40EU8dGwApwDtdzNiDRrl4BPbLMfC6fWXLIdRZIxyaa4pC3AwkNlaQ2rHTbY20nyzDYie-0wFE8HS2ZfqwEtpQk1tRmuM6mlU_rKq99JEfk9yJXVMTmPr-mXVHXAQdrrUSRHV7mII6_vWLywzSQIco44-o_8_WX0UVCfrdxFLnFgGwKfHryNmvOW7JZOnQHijXmTNcyGwyve2Q'''


centre_id = "0ad5afc2-184f-4739-a39b-e67891e3d85d"
modalities = ["CT %", "XRAY %", "USG %"]


def create_commissions_entry(row):
    commissions = []
    let_go = []

    for modality in modalities:
        amount = row[modality]
        if amount > 0:
            let_go.append(False)
        else:
            let_go.append(True)

        modality_formatted = modality.strip('%').replace(' ', '').lower()
        commissions.append({"modality": modality_formatted, "amount": amount})

    return commissions, any(let_go)


def send_commission_post_request(doctor_name, commissions, let_go):
    url = "http://localhost:3010/api/doctor-commission"
    data = {
        "centreId": centre_id,
        "doctorId": '8414414c-35fc-44f3-a945-644899f0c190',
        "doctorName": doctor_name,
        "commissions": commissions,
        "letGo": let_go
    }

    try:
        response = requests.post(url, json=data, headers={
                                 "Authorization": f"Bearer {AUTH_TOKEN}"})
        if response.status_code != 200:
            raise Exception(
                f"HTTP error - {doctor_name} {response.status_code}: {response.text}")
    except Exception as e:
        return str(e)


def process_doctor_commissions(file_path):
    df = pd.read_csv(file_path)
    failed_rows = []

    print('Processing each doctor for commissions...')
    for index, row in df.iterrows():
        doctor_name = row['DOCTOR NAME']
        commissions, let_go = create_commissions_entry(row)
        request_error = send_commission_post_request(
            doctor_name, commissions, let_go)

        if request_error:
            failed_rows.append((index+1, doctor_name, request_error))

    return failed_rows


# Example usage
failed_rows = process_doctor_commissions('./assets/doctors.csv')

if failed_rows:
    for failure in failed_rows:
        print(f"Row {failure[0]}: {failure[1]}\n{failure[2]}\n")
else:
    print("All doctor commissions processed successfully")
