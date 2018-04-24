import boto3
import uuid
import json
import logging
import os
import datetime
import decimal
from botocore.exceptions import ClientError

logger = logging.getLogger()
logger.setLevel(logging.INFO)

class DecimalEncoder(json.JSONEncoder):
    def defalt(self, o):
        if isinstance(o, decimal.Decimal):
            if o % 1 > 0:
                return float(o)
            else:
                return int(o)
        return super(DecimalEncoder, self).default(o)

dynamodb = boto3.resource('dynamodb', region_name = 'ap-northeast-1')
table = dynamodb.Table(os.getenv('TABLE_NAME'))

def lambda_handler(event, context):
    try:
        photo_id = event['pathParameters']['id']
        try:
            response = table.get_item(
                Key = {
                    'photo_id' : photo_id
                }
            )
            if 'Item' not in response:
                logging.info("Specified key is not found.")
                response = {
                    'statusCode' : '404',
                    'body' : 'Not Found',
                    'headers' : {
                        'Content-Type' : 'application/json',
                        'Access-Control-Allow-Origin' : '*'
                    },
                }
                return response

        except ClientError as e:
            logging.info(e.response['Error']['Message'])
            response = {
                'statusCode' : '400',
                'body' : e.response['Error']['Message'],
                'headers' : {
                    'Content-Type' : 'application/json',
                    'Access-Control-Allow-Origin' : '*'
                },
            }
            return response

        else:
            items = json.dumps(response['Item'], cls = DecimalEncoder)
            response = {
                'statusCode' : '200',
                'body' : items,
                'headers' : {
                    'Content-Type' : 'application/json',
                    'Access-Control-Allow-Origin' : '*'
                },
            }
            return response

    except Exception as e:
        logging.error( 'type : %s', type(e))
        logging.error(e)
