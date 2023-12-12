import requests
import pandas as pd
from datetime import datetime


AUTH_TOKEN = '''eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NUb2tlbiI6ImV5SmhiR2NpT2lKU1V6STFOaUlzSW5SNWNDSTZJa3BYVkNKOS5leUoxYzJWeUlqb2lZamxpWkdFek16Y3RZMk0wTmkwME5UY3hMV0ZrTURRdE1URmhZbVJtTXpaall6YzJJaXdpYVdGMElqb3hOekF5TkRFd016QTVmUS5ZTUY1c3VrTGdsQU9OdXg2LVJNRld2RGQySnFOTktGY2o0aDZoeFBpbUdwblUwV2hEV280SmNCMWkyWVlyOEYxV2dYRDFUWk0tUnFmSzZ1c1p1MEpUekNSNlZBWC03TWNITFNfdE1sVzhidG1yYVFwYVlPVEpYTVF5dTZIa0ZZOGxTREl6ZG05dnlEanF3a3UxNkdpa2FTRWE5eDNLUF9JMWhuVC1tZndMLURibU1CZjU5WFgwT0VwangwRktoaEUySVdlMi1IUmN1aC13UlJuX1pSQUJWcjd0U252ZDJJTFRKSjgzblk2S1lqdkpEeGFEeFVEdjRvblBNRlZMYzBjVnl0cnlIMGpZSnhGNWZ6RTExRm9oZHkyTFBtLUVfdHo1S3ZocEQwd19ZT0J1YTdyTmpVcTVIMWtreGJCNjVqanhsZmhqSEtLLUlaa3VWc002c2VlbGciLCJpYXQiOjE3MDI0MTAzMDl9.FntDnY5Oj0luIh464hQV-3ZNiJwjwNGdimEWhaOLCWaebA_DrV8vVsprMTQx4Pjh853VEL_Kfazmezi2eOTEmAv9poDmZzWp5vDue-I8kc32T8PoA8d6CC3GUz50LqAhocVw0jhEDeB-EPB_AksPKkaGI2qmOM-DUxfgYz2UKub8uwFhdOYrpruhdFvu6cDhwi_ssmJKcrEjkBB3_hgvshFnIVudx1tk1ono8QMSK7RJ1YgRbYRLWGXQOhRFuwmMa3fUXbwXNm-uP_60ebTkw57GA5VK731LaDEopei30z5j8EtmadWW-j4PTCvxQmvB4Qz2DZq_tmWmuuQCqouJJA'''

centre_id = "fe3eb969-19df-4637-9180-3ff469c64a00"


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
