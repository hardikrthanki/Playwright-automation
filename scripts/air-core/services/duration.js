function formatDuration(ms) {
  const seconds = Math.round((ms ?? 0) / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }

  return `${remainingSeconds}s`;
}

module.exports = {
  formatDuration,
};
