
import express, { Request, Response } from 'express';
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import * as dotenv from 'dotenv';
import pool from './db';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const region = process.env.AWS_REGION || 'us-east-1';

const sqsClient = new SQSClient({ region });
const snsClient = new SNSClient({ region });

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.status(200).send('(-_-) Hello?');
});

app.post('/queue', async (req: Request, res: Response) => {
  const command = new SendMessageCommand({
    QueueUrl: process.env.SQS_QUEUE_URL,
    MessageBody: JSON.stringify(req.body),
  });

  try {
    const data = await sqsClient.send(command);
    res.json({ success: true, messageId: data.MessageId });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/publish', async (req: Request, res: Response) => {
  const command = new PublishCommand({
    TopicArn: process.env.SNS_TOPIC_ARN,
    Message: JSON.stringify(req.body),
  });

  try {
    const data = await snsClient.send(command);
    res.json({ success: true, messageId: data.MessageId });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/db-test', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT NOW() as current_time');
    res.json({ 
      success: true, 
      dbTime: result.rows[0].current_time 
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
