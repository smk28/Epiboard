import Dialog from '@/components/Dialog';

export default {
  getAll() {
    return new Promise((resolve, reject) => {
      browser.permissions.getAll((res) => {
        if (browser.runtime.lastError) return reject(browser.runtime.lastError);
        return resolve(res);
      });
    });
  },
  contains(payload) {
    return new Promise((resolve, reject) => {
      browser.permissions.contains(payload, (res) => {
        if (browser.runtime.lastError) return reject(browser.runtime.lastError);
        return resolve(res);
      });
    });
  },
  request(payload) {
    return new Promise((resolve, reject) => {
      browser.permissions.request(payload, (res) => {
        if (browser.runtime.lastError) return reject(browser.runtime.lastError);
        return resolve(res);
      });
    });
  },
  remove(payload) {
    return new Promise((resolve, reject) => {
      browser.permissions.remove(payload, (res) => {
        if (browser.runtime.lastError) return reject(browser.runtime.lastError);
        return resolve(res);
      });
    });
  },
  allowed(payload) {
    return this.contains(payload)
      .then((res) => {
        if (res) return res;
        return this.request(payload);
      }).catch(() => Dialog.show({
        title: 'Permissions are required',
        text: 'Some cards ask for permissions that are necessary for them to work properly, are they okay?',
        ok: 'Allow',
        cancel: 'Deny',
      }).then((res) => {
        if (res) return this.request(payload);
        throw new Error('User has refused');
      }));
  },
};
