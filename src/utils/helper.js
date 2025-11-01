export const convertTemp = (temp, unit) => {
  return unit === 'F' ? (temp * 9/5 + 32).toFixed(1) : temp.toFixed(1);
};

export const getBackgroundImage = (code) => {
  const conditions = {
    1000: 'clear-sky',
    1003: 'partly-cloudy',
    1006: 'cloudy',
    1063: 'rainy',
    1066: 'snowy'
  };
  const condition = conditions[code] || 'clear-sky';
  return `https://source.unsplash.com/1920x1080/?weather,${condition}`;
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
};

export const formatTime = (timeString) => {
  return new Date(timeString).toLocaleTimeString('en', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};