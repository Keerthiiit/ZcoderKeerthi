// Some usefull functions

import { toast } from 'react-toastify';

export const handleSuccess = (msg) => {
    toast.success(msg, {
        position: 'top-right'
    })
}

export const handleError = (msg) => {
    toast.error(msg, {
        position: 'top-right'
    })
}

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
}

export const isotpAuthenticated = () => {
  const token = localStorage.getItem('otptoken');
  return !!token;
}