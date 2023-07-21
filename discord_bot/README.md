Zip file: zip -r discord-bot.zip ./

View files in AWS S3 with AWS CLI: aws s3 ls s3://mo-discord-bot-code
Remove previous zipped file: aws s3 rm s3://mo-discord-bot-code/discord-bot.zip
Upload zipped file to AWS S3 with CLI: aws s3 cp discord-bot.zip s3://mo-discord-bot-code

In totality: zip -r discord-bot.zip ./ && aws s3 rm s3://mo-discord-bot-code/discord-bot.zip && aws s3 cp discord-bot.zip s3://mo-discord-bot-code

Ref: https://betterprogramming.pub/build-a-discord-bot-with-aws-lambda-api-gateway-cc1cff750292
