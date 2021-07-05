import moment from 'moment';

export const setAdminAuth = (): void => localStorage.setItem('admin', moment().toString());

export const getAdminAuth = (): string => localStorage.getItem('admin') || '';

export const setAdminAuthAndReload = () => {
  setAdminAuth();
  window.location.reload();
};
