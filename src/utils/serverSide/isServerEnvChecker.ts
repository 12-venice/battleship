const isServer = !(typeof window !== 'undefined' && window.document);

// eslint-disable-next-line import/no-default-export
export default isServer;
