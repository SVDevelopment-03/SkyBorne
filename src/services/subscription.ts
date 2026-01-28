import axios from "axios";

const API_URL = "http://localhost:8000"; 

export const createSubscriptionCheckout = async (
  email: string,
  priceId: string
) => {
  const response = await axios.post(
    `${API_URL}/api/subscription/create-checkout-session`,
    {
      email,
      priceId,
    }
  );

  return response.data;
};
