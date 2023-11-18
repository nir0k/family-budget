// apiUtils.js
export const getHeaders = () => {
  const authToken = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': authToken ? `${authToken}` : '',
  };
};
