import { api } from './api';

export const newsletterService = {
  subscribe: (email: string) =>
    api
      .post<{ subscribed: boolean; alreadySubscribed: boolean }>('/newsletter/subscribe', { email })
      .then((r) => r.data),
};
