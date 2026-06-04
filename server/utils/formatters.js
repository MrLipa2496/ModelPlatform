exports.formatAddress = (city, type) => {
  if (type === 'remote') return 'Remote Work';
  return city || 'Location TBA';
};

exports.formatDateRange = (start, end) => {
  if (!start) return 'To Be Announced';
  const options = { month: 'long', day: 'numeric', year: 'numeric' };
  const startDate = new Date(start).toLocaleDateString('en-US', options);
  if (end) {
    const endDate = new Date(end).toLocaleDateString('en-US', options);
    return `${startDate} – ${endDate}`;
  }
  return startDate;
};

exports.formatRequirement = (min, max, unit) => {
  if (min && max) return `${min} - ${max} ${unit}`;
  if (min) return `${min}+ ${unit}`;
  if (max) return `Up to ${max} ${unit}`;
  return 'Any';
};
