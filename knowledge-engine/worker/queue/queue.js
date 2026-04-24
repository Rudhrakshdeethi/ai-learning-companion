const pendingJobs = [];
let activeJob = null;

const runNext = async () => {
  if (activeJob || !pendingJobs.length) {
    return;
  }

  activeJob = pendingJobs.shift();

  try {
    const result = await activeJob.handler(activeJob.payload);
    activeJob.resolve(result);
  } catch (error) {
    activeJob.reject(error);
  } finally {
    activeJob = null;
    await runNext();
  }
};

const pdfQueue = {
  add(payload, handler) {
    return new Promise((resolve, reject) => {
      pendingJobs.push({ payload, handler, resolve, reject });
      void runNext();
    });
  },
};

export default pdfQueue;
