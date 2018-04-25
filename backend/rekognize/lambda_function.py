import json
import urllib
import boto3
import os
import logging
import decimal
from botocore.exceptions import ClientError

print('Loading function')
logger = logging.getLogger()
logger.setLevel(logging.INFO)

s3 = boto3.client('s3')
rekognition = boto3.client('rekognition', 'us-east-1')
dynamodb = boto3.resource('dynamodb',region_name = 'ap-northeast-1')
table = dynamodb.Table(os.getenv('TABLE_NAME'))

def lambda_handler(event, context):

    bucket = event['Records'][0]['s3']['bucket']['name']
    key = urllib.parse.unquote_plus(event['Records'][0]['s3']['object']['key'],'utf8')
    try:
        obj = s3.get_object(Bucket=bucket, Key=key)
        body = obj['Body'].read()
        
        labels = rekognition.detect_labels(Image={'Bytes':body},MinConfidence=75)
        faces = rekognition.detect_faces(Image={'Bytes':body},Attributes=['ALL'])
        
        rekognized_label = {}
        rekognized_label['Labels'] = labels['Labels']
        rekognized_label['FaceDetails'] = faces['FaceDetails']
        logger.info(json.dumps(rekognized_label))
        
        photo_id = key.split('.')[0]
        
        table.update_item(
            Key={
                'photo_id':photo_id
                },
            AttributeUpdates={
                'labels':{
                    'Value': json.loads(json.dumps(rekognized_label),parse_float=decimal.Decimal),
                    'Action': 'PUT'
                    }
            }
        )
                
        return
        
    except Exception as e:
        print(e)
        print('Error getting object {} from bucket {}. Make sure they exist and your bucket is in the same region as this function.'.format(photo_id, bucket))
        raise e
