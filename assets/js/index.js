import '../scss/main.scss';

// eslint-disable-next-line no-undef
var stripe = Stripe(
  'pk_test_51HCPpmDKI9cPkB0VWirowWE4ahr94GAZwSwxlTXD3xKJe02IFRHC5ejqQPq8N8KzxbZxXZC7kNFHXB74g5SpN3LA00LtG5N2lL'
);

var paymentIntentData = {
  items: [{ id: 'xl-shirt' }],
  customerId: '',
};

document.querySelector('button').disabled = true;

fetch('/create-payment-intent', {
  method: 'POST',
  heades: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(paymentIntentData),
})
  .then((result) => {
    return result.json();
  })
  .then((data) => {
    var elements = stripe.elements();

    var style = {
      base: {
        color: '#32325d',
        fontFamily: 'Arial, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#32325d',
        },
      },
      invalid: {
        fontFamily: 'Arial, sans-serif',
        color: '#fa755a',
        iconColor: '#fa7555a',
      },
    };

    var card = elements.create('card', { style: style });
    card.mount('#card-element');
    card.on('change', (event) => {
      document.querySelector('button').disabled = event.empty;
      document.querySelector('#card-error').textContent = event.error
        ? event.error.message
        : '';
    });

    const form = document.getElementById('payment-form');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      payWithCard(stripe, card, data.clientSecret);
    });
  });

const payWithCard = (stripe, card, clientSecret) => {
  loading(true);
  stripe
    .confirmCardPayment(clientSecret, {
      payment_method: {
        card: card,
      },
    })
    .then((result) => {
      if (result.error) {
        showError(result.error.message);
      } else {
        orderComplete(result.paymentIntent.id);
      }
    });
};

const orderComplete = (paymentIntentId) => {
  loading(false);
  document
    .querySelector('.result-message')
    .setAttribute(
      'href',
      'https://dashboard.stripe.com/test/payments/' + paymentIntentId
    );
  document.querySelector('.result-message').classList.remove('hidden');
  document.querySelector('button').disabled = true;
};

const showError = (errorMsgText) => {
  loading(false);
  const errorMsg = document.querySelector('#card-error');
  errorMsg.textContent = errorMsgText;
  setTimeout(() => {
    errorMsg.textContent = '';
  }, 4000);
};

const loading = (isLoading) => {
  if (isLoading) {
    document.querySelector('button').disabled = true;
    document.querySelector('#spinner').classList.remove('hidden');
    document.querySelector('#button-text').classList.add('hidden');
  } else {
    document.querySelector('button').disabled = false;
    document.querySelector('#spinner').classList.add('hidden');
    document.querySelector('#button-text').classList.remove('hidden');
  }
};
