class WeatherCache {
  constructor() {
    this.cache = new Map();
    this.duration = 60000; // 60 seconds
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > this.duration) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  clear() {
    this.cache.clear();
  }
}

export default new WeatherCache();