import requests
import pandas as pd
from datetime import datetime


AUTH_TOKEN = '''eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NUb2tlbiI6ImV5SmhiR2NpT2lKU1V6STFOaUlzSW5SNWNDSTZJa3BYVkNKOS5leUoxYzJWeUlqb2lNR1ppTTJaa05UY3RNbUZoWXkwMFpHRXhMVGxrTjJFdE1qTTVZbUUwWm1JeU9UbGtJaXdpYVdGMElqb3hOekF4TVRjNE56WTRmUS5uSW1PN2tEV25nUlRON2J6SF95SEF1aTd4dVZhWF9VSF8wYWRtNHBFR1Bha1M4aExHT2U2MDNITWZKeEQtRWdTZlhWV3VwSmJWNXdEbWowcnEtR0I5SUdZNkhMU0UzUDdyYnFkY0lOdzBHOE9XVHFLY2QtM1NyRXFZOTItNTZ2NHE0U3M2dEhCQTZzVk1JZDFsMXVCdFdPdThndDNRc1k1VU1UbEtlc1BBVm50OVgtZDRxXzlvaVk4UjRUMk1KZVJMeEhaQ2Zma1NOLUlua0NCbGhBcmJJRmFpWHdfLTdqNFgwUUFLbUkxS2xhWndQdWhlenNjZ2wwQUdXMGpIbmN1UjdWRmdSYmhYdXpINHNpbWE3bkI3aUM5MkUwNlUyRkgtNnFfV3MxUDNlYnJtSmM0M2ZNRkt2VDlrUmYyS2ZwRGFUZUhTdmtXaTRCR2dHY0NHbVU1clEiLCJpYXQiOjE3MDExNzg3Njh9.UtCzmpmfjGsXmZ9_SnzjqGE2THWabj5Rw3B2mac73Fi9Ga3yU-suCHKG07xp2gde0BeOCgNIoDjoSyxoJbO0szs9zINCR3QR_FQLFyt2qgVk6QIlgGfmreWTh-yGHZY7AOMf3lUs40EU8dGwApwDtdzNiDRrl4BPbLMfC6fWXLIdRZIxyaa4pC3AwkNlaQ2rHTbY20nyzDYie-0wFE8HS2ZfqwEtpQk1tRmuM6mlU_rKq99JEfk9yJXVMTmPr-mXVHXAQdrrUSRHV7mII6_vWLywzSQIco44-o_8_WX0UVCfrdxFLnFgGwKfHryNmvOW7JZOnQHijXmTNcyGwyve2Q'''

centre_id = "0ad5afc2-184f-4739-a39b-e67891e3d85d"


def send_post_request(row):
    url = "http://localhost:3010/api/centre/expense"

    remark = row['Remarks']
    data = {
        "centreId": centre_id,
        'amount': row['Amount'],
        'date': datetime.strptime(row['Date'], "%d/%m/%Y").isoformat(),
        'expenseType': row['Type of Expense'],
        'name': row['Name of Expense'],
        'paymentMethod': row['Expense Mode'],
        'remark': remark if pd.notna(remark) else None
    }

    try:
        response = requests.post(url, json=data, headers={
                                 "Authorization": f"Bearer {AUTH_TOKEN}"})
        if response.status_code != 200:
            print(data, '\n')
            raise Exception(
                f"HTTP error - {response.status_code}: {response.text}")
    except Exception as e:
        return str(e)


def process_expense(file_path):
    df = pd.read_csv(file_path)
    failed_rows = []

    print('Migrating each expense row...')
    for index, row in df.iterrows():
        request_error = send_post_request(row)

        if request_error:
            failed_rows.append(
                (index+1, row['Name of Expense'], request_error))

    return failed_rows


# usage
failed_rows = process_expense('./assets/expense.csv')

if failed_rows:
    for failure in failed_rows:
        print(f"Row {failure[0]}: {failure[1]}\n{failure[2]}\n")
else:
    print("All rows processed successfully")
