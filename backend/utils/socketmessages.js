function formatMessage(handle, text) {
  return {
    handle: handle,
    text: text,
    time: new Date()
  };
}

module.exports = formatMessage;