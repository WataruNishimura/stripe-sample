const express = require('express');
const app = express();
//const path = require('path');

const stripe = require('stripe')(
  'sk_test_51HCPpmDKI9cPkB0VAGfLmTzizuBBJ7IM2xWXLemizkY1AgoZEmH6Md0x2Wya4ZCCqlCSGr3VIwx8cAkG64a1iPNK00pujNjVeB'
);

app.use(express.static('.'));
app.use(express.json());

// eslint-disable-next-line no-unused-vars
const calculationOrderAmount = (items) => {
  return 1400;
};

// eslint-disable-next-line no-unused-vars
const chargeCustomer = async (customerId) => {
  const paymentMethods = await stripe.paymentMethods.list({
    customer: customerId,
    type: 'card',
  });

  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1099,
    currency: 'jpy',
    customer: customerId,
    payment_method: paymentMethods.data[0].id,
    off_session: true,
    confirm: true,
  });

  if (paymentIntent.status === 'succeeded') {
    console.log('Successfully');
  }
};

app.post('/create-payment-intent', async (req, res) => {
  const customer = await stripe.customers.create();

  const { items } = req.body;
  const paymentIntent = await stripe.paymentIntents.create({
    customer: customer.id,
    setup_future_usage: 'off_session',
    amount: calculationOrderAmount(items),
    currency: 'jpy',
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

app.listen(8080, () => {
  console.log('Running at Port 8080');
});
