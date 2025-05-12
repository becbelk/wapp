import axios from 'axios';
import { Request, Response } from 'express';

const consumersUrl = process.env.CONSUMER_URL!;
if (!consumersUrl) {
  throw new Error('CONSUMER_URL is not defined in environment variables.');
}

// ✅ دالة موحدة للتعامل مع طلبات الاستهلاك
const forwardConsumerRequest = async (
  endpoint: string,
  req: Request,
  res: Response,
  functionName: string,
  method: 'get' | 'post' = 'get'
) => {
  console.debug(`[DEBUG][gateway][${functionName}] Forwarding to ${endpoint}`);

  try {
    const url = `${consumersUrl}${endpoint}`;
    const axiosResponse =
      method === 'get'
        ? await axios.get(url, { headers: req.headers })
        : await axios.post(url, req.body, { headers: req.headers });

    return res.status(200).json({
      message: `${functionName} successful`,
      data: axiosResponse.data,
    });
  } catch (error: any) {
    console.error(`[ERROR][gateway][${functionName}]`, error.message);
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || 'Error contacting consumer service';
    return res.status(status).json({ error: message });
  }
};

// 🧠 استخدم دوال صغيرة تقرأ بسهولة وتعيد الاستخدام
const getAllConsumers = async (req: Request, res: Response) =>
  forwardConsumerRequest('/get-all-consumers', req, res, 'getAllConsumers');

const getListConsumers = async (req: Request, res: Response) =>
  forwardConsumerRequest('/get-list-consumers', req, res, 'getListConsumers');

const getConsumer = async (req: Request, res: Response) => {
  const { id } = req.params;
  return forwardConsumerRequest(`/get-consumer/${id}`, req, res, 'getConsumer');
};



const createConsumer = async (req: Request, res: Response) => {
 
  return forwardConsumerRequest(`//create-one`, req, res, 'createConsumer');
};

const deleteConsumer = async (req: Request, res: Response) => {
  const { no } = req.params;
  return forwardConsumerRequest(`/delete-one//${no}`, req, res, 'deleteConsumer');
};


const updateConsumer = async (req: Request, res: Response) => {
  const { no } = req.params;
  return forwardConsumerRequest(`/update-one//${no}`, req, res, 'updateConsumer');
};

export { getAllConsumers, getListConsumers, getConsumer ,createConsumer,deleteConsumer,updateConsumer};
