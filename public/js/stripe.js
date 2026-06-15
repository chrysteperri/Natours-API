/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe(
  'pk_test_51THV53RuZ3zOHDzTnWDXC2VHqnU8py2IflLSJJFJPOdIetIS1ofC6ODAlsOAfbvC5bBCAeAamMC5YqzmaY1J3DyK00l7WlOaOq',
);

export const bookTour = async (tourId) => {
  try {
    // Get checkout session from API
    const session = await axios.get(
      `/api/v1/bookings/checkout-session/${tourId}`,
    );
    // console.log(session);

    // Create checkout form and charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};

