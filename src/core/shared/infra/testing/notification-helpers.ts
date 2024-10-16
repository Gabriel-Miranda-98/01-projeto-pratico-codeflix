import { Notification } from '../../domain/validators/notification';

expect.extend({
  notificationContainsErrorMessages(
    expected: Notification,
    received: Array<string | { [key: string]: string[] }>,
  ) {
    const errorsJSON = expected.toJSON();

    const every = received.every((error) => {
      if (typeof error === 'string') {
        return errorsJSON.some((e) => typeof e === 'string' && e === error);
      } else {
        return Object.entries(error).every(([field, messages]) => {
          const fieldError = errorsJSON.find(
            (e) => typeof e === 'object' && field in e,
          ) as { [key: string]: string[] } | undefined;
          if (!fieldError) return false;

          const fieldMessages = fieldError[field];
          return messages.every((message) => fieldMessages.includes(message));
        });
      }
    });

    return every
      ? {
          pass: true,
          message: () => 'Notification contains all expected error messages',
        }
      : {
          pass: false,
          message: () =>
            `The notification does not contain all expected error messages.\n` +
            `Expected: ${JSON.stringify(received)}\n` +
            `Received: ${JSON.stringify(errorsJSON)}`,
        };
  },
});
