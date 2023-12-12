import requests
import pandas as pd

AUTH_TOKEN = '''eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NUb2tlbiI6ImV5SmhiR2NpT2lKU1V6STFOaUlzSW5SNWNDSTZJa3BYVkNKOS5leUoxYzJWeUlqb2lZamxpWkdFek16Y3RZMk0wTmkwME5UY3hMV0ZrTURRdE1URmhZbVJtTXpaall6YzJJaXdpYVdGMElqb3hOekF5TkRFd016QTVmUS5ZTUY1c3VrTGdsQU9OdXg2LVJNRld2RGQySnFOTktGY2o0aDZoeFBpbUdwblUwV2hEV280SmNCMWkyWVlyOEYxV2dYRDFUWk0tUnFmSzZ1c1p1MEpUekNSNlZBWC03TWNITFNfdE1sVzhidG1yYVFwYVlPVEpYTVF5dTZIa0ZZOGxTREl6ZG05dnlEanF3a3UxNkdpa2FTRWE5eDNLUF9JMWhuVC1tZndMLURibU1CZjU5WFgwT0VwangwRktoaEUySVdlMi1IUmN1aC13UlJuX1pSQUJWcjd0U252ZDJJTFRKSjgzblk2S1lqdkpEeGFEeFVEdjRvblBNRlZMYzBjVnl0cnlIMGpZSnhGNWZ6RTExRm9oZHkyTFBtLUVfdHo1S3ZocEQwd19ZT0J1YTdyTmpVcTVIMWtreGJCNjVqanhsZmhqSEtLLUlaa3VWc002c2VlbGciLCJpYXQiOjE3MDI0MTAzMDl9.FntDnY5Oj0luIh464hQV-3ZNiJwjwNGdimEWhaOLCWaebA_DrV8vVsprMTQx4Pjh853VEL_Kfazmezi2eOTEmAv9poDmZzWp5vDue-I8kc32T8PoA8d6CC3GUz50LqAhocVw0jhEDeB-EPB_AksPKkaGI2qmOM-DUxfgYz2UKub8uwFhdOYrpruhdFvu6cDhwi_ssmJKcrEjkBB3_hgvshFnIVudx1tk1ono8QMSK7RJ1YgRbYRLWGXQOhRFuwmMa3fUXbwXNm-uP_60ebTkw57GA5VK731LaDEopei30z5j8EtmadWW-j4PTCvxQmvB4Qz2DZq_tmWmuuQCqouJJA'''

centre_id = "fe3eb969-19df-4637-9180-3ff469c64a00"


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


# Row 6, Booking ID 000132: HTTP error - 500: {"statusCode":500,"message":"Internal server error"}
# Row 25, Booking ID 0003: HTTP error - 500: {"statusCode":500,"message":"Internal server error"}
# Row 66, Booking ID 00067: HTTP error - 500: {"statusCode":500,"message":"Internal server error"
# Row 67, Booking ID 00068: HTTP error - 500: {"statusCode":500,"message":"Internal server error"}
# Row 75, Booking ID 00075: HTTP error - 500: {"statusCode":500,"message":"Internal server error"}
# Row 80, Booking ID 0008: HTTP error - 500: {"statusCode":500,"message":"Internal server error"}
# Row 87, Booking ID 00086: HTTP error - 500: {"statusCode":500,"message":"Internal server error"}
# Row 90, Booking ID 00089: HTTP error - 500: {"statusCode":500,"message":"Internal server error"}
# Row 91, Booking ID 0009: HTTP error - 500: {"statusCode":500,"message":"Internal server error"}
# Row 107, Booking ID 00106: HTTP error - 500: {"statusCode":500,"message":"Internal server error"}
# Row 138, Booking ID 00137: HTTP error - 500: {"statusCode":500,"message":"Internal server error"}
# Row 140, Booking ID 00139: HTTP error - 500: {"statusCode":500,"message":"Internal server error"}
# Row 147, Booking ID 00146: HTTP error - 500: {"statusCode":500,"message":"Internal server error"}
# Row 153, Booking ID 00152: HTTP error - 500: {"statusCode":500,"message":"Internal server error"}
# Row 175, Booking ID 00174: HTTP error - 500: {"statusCode":500,"message":"Internal server error"}
# Row 177, Booking ID 00176: HTTP error - 500: {"statusCode":500,"message":"Internal server error"}
# Row 182, Booking ID 00181: HTTP error - 500: {"statusCode":500,"message":"Internal server error"}
# Row 201, Booking ID 00200: HTTP error - 500: {"statusCode":500,"message":"Internal server error"}
# Row 203, Booking ID 00202: HTTP error - 500: {"statusCode":500,"message":"Internal server error"}
