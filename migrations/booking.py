import requests
import pandas as pd

AUTH_TOKEN = '''eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NUb2tlbiI6ImV5SmhiR2NpT2lKU1V6STFOaUlzSW5SNWNDSTZJa3BYVkNKOS5leUoxYzJWeUlqb2lNR1ppTTJaa05UY3RNbUZoWXkwMFpHRXhMVGxrTjJFdE1qTTVZbUUwWm1JeU9UbGtJaXdpYVdGMElqb3hOekF4TVRjNE56WTRmUS5uSW1PN2tEV25nUlRON2J6SF95SEF1aTd4dVZhWF9VSF8wYWRtNHBFR1Bha1M4aExHT2U2MDNITWZKeEQtRWdTZlhWV3VwSmJWNXdEbWowcnEtR0I5SUdZNkhMU0UzUDdyYnFkY0lOdzBHOE9XVHFLY2QtM1NyRXFZOTItNTZ2NHE0U3M2dEhCQTZzVk1JZDFsMXVCdFdPdThndDNRc1k1VU1UbEtlc1BBVm50OVgtZDRxXzlvaVk4UjRUMk1KZVJMeEhaQ2Zma1NOLUlua0NCbGhBcmJJRmFpWHdfLTdqNFgwUUFLbUkxS2xhWndQdWhlenNjZ2wwQUdXMGpIbmN1UjdWRmdSYmhYdXpINHNpbWE3bkI3aUM5MkUwNlUyRkgtNnFfV3MxUDNlYnJtSmM0M2ZNRkt2VDlrUmYyS2ZwRGFUZUhTdmtXaTRCR2dHY0NHbVU1clEiLCJpYXQiOjE3MDExNzg3Njh9.UtCzmpmfjGsXmZ9_SnzjqGE2THWabj5Rw3B2mac73Fi9Ga3yU-suCHKG07xp2gde0BeOCgNIoDjoSyxoJbO0szs9zINCR3QR_FQLFyt2qgVk6QIlgGfmreWTh-yGHZY7AOMf3lUs40EU8dGwApwDtdzNiDRrl4BPbLMfC6fWXLIdRZIxyaa4pC3AwkNlaQ2rHTbY20nyzDYie-0wFE8HS2ZfqwEtpQk1tRmuM6mlU_rKq99JEfk9yJXVMTmPr-mXVHXAQdrrUSRHV7mII6_vWLywzSQIco44-o_8_WX0UVCfrdxFLnFgGwKfHryNmvOW7JZOnQHijXmTNcyGwyve2Q'''

centre_id = "0ad5afc2-184f-4739-a39b-e67891e3d85d"


def send_post_request(booking):
    url = "http://localhost:3010/api/booking/migration"

    # Here, you'll need to adjust the structure of 'data' based on the API's expected format
    data = {
        "centreId": centre_id,
        "smkId": booking['smkId'],
        "consultantName": booking['consultantName'],
        "modality": booking['modality'],
        "investigation": booking['investigation'],
        "remark": booking['remark'],
        "totalAmount": booking['totalAmount'],
        "patient": booking['patient'],
        "payment": booking['payment']
    }

    try:
        response = requests.post(url, json=data, headers={
                                 "Authorization": f"Bearer {AUTH_TOKEN}"})
        if response.status_code != 200:
            raise Exception(
                f"HTTP error - {response.status_code}: {response.text}")
    except Exception as e:
        return str(e)


def convert_int64(value):
    """Convert pandas int64 to native Python int, handle NaN values."""
    return int(value) if pd.notna(value) else None


def convert_age_to_months(age):
    try:
        if pd.isna(age) or age == "":
            return None  # Return None for missing or empty age values
        if 'month' in age.lower():
            # Age is specified in months, extract the number part
            return int(age.split()[0])
        else:
            # Age is specified in years, convert to integer and multiply by 12
            return int(age) * 12
    except Exception as e:
        print(age)
        return str(e)


def process_data(df):
    # Initialize an empty list to hold processed data
    processed_data = []

    # Iterate over the dataframe grouped by 'SMK ID'
    for smk_id, group in df.groupby('SMK ID'):
        # Select the first row for primary details
        first_row = group.iloc[0]

        # Create a dictionary for each booking
        remark = first_row['Emergency Charges']
        booking = {
            "smkId": smk_id,
            "consultantName": first_row['Consultant Name'],
            "modality": first_row['Select Modality'].lower(),
            "remark": remark if pd.notna(remark) else None,
            "totalAmount": convert_int64(group['Amount'].sum()),
            "patient": {
                "name": first_row["Patient's Name"],
                "age": convert_age_to_months(first_row["Patient's Age"]),
                "gender": first_row["Gender"],
                "phone": str(first_row["Patient's Mobile Number"]),
                "address": first_row["Patient's Address"]
            },
            "payment": {
                "discount": convert_int64(first_row["Discount Amount (If Any)"]),
                "extraCharge": convert_int64(first_row["Emergency Charges"]),
                "payments": []
            }
        }

        # Determine the investigation type and value
        for investigation_type in ['X-Ray Investigation', 'USG Investigation', 'CT Investigation']:
            if pd.notna(first_row[investigation_type]):
                booking['investigation'] = first_row[investigation_type]
                break

        # Add payment details for each row in the group
        for _, row in group.iterrows():
            payment = {
                "amount": convert_int64(row['Amount']),
                "paymentType": row['Payment Type']
            }
            booking['payment']['payments'].append(payment)

        # Add the processed booking to the list
        processed_data.append(booking)

    return processed_data


def process_booking(file_path):
    df = pd.read_csv(file_path, dtype={'SMK ID': str})
    failed_rows = []

    processed_bookings = process_data(df)

    print('Migrating each booking row...')
    for index, booking in enumerate(processed_bookings):
        request_error = send_post_request(booking)
        if request_error:
            failed_rows.append((index+1, booking['smkId'], request_error))

    return failed_rows


# usage
failed_rows = process_booking('./assets/booking.csv')

if failed_rows:
    for failure in failed_rows:
        print(f"Row {failure[0]}, Booking ID {failure[1]}: {failure[2]}\n")
else:
    print("All bookings processed successfully")
