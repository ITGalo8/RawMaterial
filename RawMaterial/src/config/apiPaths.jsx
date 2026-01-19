// import Api from "../auth/Api";

// export const fetchPaymentRequestsApi = (role) => {
//   return Api.get(
//     `/${role.toLowerCase()}-dept/purchase-orders/payments/requests/show`
//   );
// };



import Api from "../auth/Api";

// GET payment requests (role-based)
export const fetchPaymentRequestsApi = (role) => {
  return Api.get(
    `/${role.toLowerCase()}-dept/purchase-orders/payments/requests/show`
  );
};

export const updatePaymentRequestStatusApi = ({
  role,
  paymentRequestId,
  status,
  remarks,
}) => {
  return Api.patch(
    `/${role.toLowerCase()}-dept/purchase-orders/payments/requests/status`,
    {
      paymentRequestId,
      status,
      remarks,
    }
  );
};
