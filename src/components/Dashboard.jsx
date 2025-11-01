import React, { useState, useEffect, useReducer, useMemo } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Cloud, CloudRain, Sun, Wind, Droplets, Eye, Gauge, Thermometer, MapPin, Search, Star, Settings, TrendingUp, Calendar, Clock, Navigation, X } from 'lucide-react';

const initialState = {
  favorites: [],
  selectedCity: null,
  unit: 'C',
  searchQuery: '',
  loading: false,
  lastUpdate: null
};

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_FAVORITE':
      return { ...state, favorites: [...state.favorites, action.payload] };
    case 'REMOVE_FAVORITE':
      return { ...state, favorites: state.favorites.filter(city => city !== action.payload) };
    case 'SELECT_CITY':
      return { ...state, selectedCity: action.payload };
    case 'SET_UNIT':
      return { ...state, unit: action.payload };
    case 'SET_SEARCH':
      return { ...state, searchQuery: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_LAST_UPDATE':
      return { ...state, lastUpdate: action.payload };
    default:
      return state;
  }
}

const API_KEY = 'a1fcd76f44ea48a5bd7175924241606';
const CACHE_DURATION = 60000;
const weatherCache = new Map();

function WeatherDashboard() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [weatherData, setWeatherData] = useState({});
  const [forecastData, setForecastData] = useState({});
  const [showSettings, setShowSettings] = useState(false);

  const defaultCities = useMemo(() => [
    'London', 'New York', 'Tokyo', 'Paris', 'Sydney', 'Mumbai', 
    'Dubai', 'Singapore', 'Hong Kong', 'Berlin', 'Toronto', 'Barcelona',
    'Rome', 'Amsterdam', 'Seoul', 'Bangkok'
  ], []);

  useEffect(() => {
    const citiesToFetch = state.favorites.length > 0 ? [...state.favorites, ...defaultCities].slice(0, 16) : defaultCities;
    citiesToFetch.forEach(city => fetchWeatherData(city));
    
    const interval = setInterval(() => {
      citiesToFetch.forEach(city => fetchWeatherData(city, true));
    }, 60000);

    return () => clearInterval(interval);
  }, [state.favorites, defaultCities]);

  const fetchWeatherData = async (city, forceRefresh = false) => {
    const cacheKey = `weather_${city}`;
    const cached = weatherCache.get(cacheKey);
    
    if (!forceRefresh && cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setWeatherData(prev => ({ ...prev, [city]: cached.data }));
      return;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=7&aqi=yes`
      );
      const data = await response.json();
      
      weatherCache.set(cacheKey, { data, timestamp: Date.now() });
      setWeatherData(prev => ({ ...prev, [city]: data }));
      setForecastData(prev => ({ ...prev, [city]: data.forecast }));
      dispatch({ type: 'SET_LAST_UPDATE', payload: Date.now() });
    } catch (error) {
      console.error('Error fetching weather:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const searchCity = async (query) => {
    if (!query) return;
    await fetchWeatherData(query);
    dispatch({ type: 'SET_SEARCH', payload: '' });
  };

  const toggleFavorite = (city) => {
    if (state.favorites.includes(city)) {
      dispatch({ type: 'REMOVE_FAVORITE', payload: city });
    } else {
      dispatch({ type: 'ADD_FAVORITE', payload: city });
      fetchWeatherData(city);
    }
  };

  const convertTemp = (temp) => {
    return state.unit === 'F' ? (temp * 9/5 + 32).toFixed(0) : temp.toFixed(0);
  };

  const getWeatherIcon = (code) => {
    if (code === 1000) return <Sun className="w-12 h-12 text-yellow-400 drop-shadow-glow animate-pulse" style={{ filter: 'drop-shadow(0 0 20px rgba(250, 204, 21, 0.8))' }} />;
    if ([1003, 1006, 1009].includes(code)) return <Cloud className="w-12 h-12 text-slate-300 drop-shadow-lg" style={{ filter: 'drop-shadow(0 0 15px rgba(203, 213, 225, 0.6))' }} />;
    if ([1063, 1180, 1183, 1186, 1189, 1192, 1195].includes(code)) return <CloudRain className="w-12 h-12 text-blue-400 drop-shadow-glow" style={{ filter: 'drop-shadow(0 0 20px rgba(96, 165, 250, 0.8))' }} />;
    return <Sun className="w-12 h-12 text-yellow-400 drop-shadow-glow animate-pulse" style={{ filter: 'drop-shadow(0 0 20px rgba(250, 204, 21, 0.8))' }} />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/10 border-b border-white/20 shadow-lg">
        <div className="max-w-[1600px] mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Cloud className="w-10 h-10 text-cyan-400 drop-shadow-lg" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">WeatherPro</h1>
                <p className="text-xs text-cyan-200">Real-time Global Weather</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search cities worldwide..."
                  value={state.searchQuery}
                  onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
                  onKeyPress={(e) => e.key === 'Enter' && searchCity(state.searchQuery)}
                  className="w-96 px-9 py-3 pl-12 bg-white/10 border border-white/20 rounded-1xl text-white placeholder-white/50 text-sm focus:outline-none focus:bg-white/20 focus:border-cyan-400 transition-all backdrop-blur-xl"
                />
                <Search className="absolute left-90 top-1 w-5 h-5 text-cyan-300" />
              </div>
              
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition-all backdrop-blur-xl group"
              >
                <Settings className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-500" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl shadow-2xl w-[480px] p-8 border border-white/10" style={{ animation: 'scale-in 0.3s ease-out' }}>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white">Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 rounded-xl hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-white mb-4">Temperature Unit</label>
                <div className="flex gap-4">
                  <button
                    onClick={() => dispatch({ type: 'SET_UNIT', payload: 'C' })}
                    className={`flex-1 py-4 px-6 rounded-2xl text-base font-semibold transition-all ${
                      state.unit === 'C'
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50'
                        : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                    }`}
                  >
                    °C Celsius
                  </button>
                  <button
                    onClick={() => dispatch({ type: 'SET_UNIT', payload: 'F' })}
                    className={`flex-1 py-4 px-6 rounded-2xl text-base font-semibold transition-all ${
                      state.unit === 'F'
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50'
                        : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                    }`}
                  >
                    °F Fahrenheit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-[1600px] mx-auto px-8 pt-8 pb-12 relative z-10 top-12">
        {/* City Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-20 lg:grid-cols-3 xl:grid-cols-4 gap-12">
          {Object.entries(weatherData).slice(0, 16).map(([city, data]) => {
            if (!data?.current) return null;
            
            return (
              <div
                key={city}
                onClick={() => dispatch({ type: 'SELECT_CITY', payload: city })}
                className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-1.5xl overflow-hidden cursor-pointer hover:shadow-2xl hover:shadow-cyan-500/20 hover:scale-105 transition-all duration-500 hover:border-cyan-400/50"
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <MapPin className="w-5 h-5 text-cyan-400" style={{ filter: 'drop-shadow(0 0 8px rgba(34, 211, 238, 0.6))' }} />
                        <h3 className="text-xl font-bold text-white tracking-tight">{data.location.name}</h3>
                      </div>
                      <p className="text-sm text-cyan-200 font-medium">{data.location.country}</p>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(city);
                      }}
                      className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all backdrop-blur-xl group/star"
                    >
                      <Star
                        className={`w-5 h-5 transition-all duration-300 ${
                          state.favorites.includes(city) 
                            ? 'fill-yellow-400 text-yellow-400 scale-110' 
                            : 'text-white/60 group-hover/star:text-yellow-400 group-hover/star:scale-110'
                        }`}
                        style={state.favorites.includes(city) ? { filter: 'drop-shadow(0 0 10px rgba(250, 204, 21, 0.8))' } : {}}
                      />
                    </button>
                  </div>

                  <div className="flex items-center gap-6 mb-6">
                    <div className="relative">
                      {getWeatherIcon(data.current.condition.code)}
                      <div className="absolute -inset-2 bg-white/10 rounded-full blur-xl -z-10"></div>
                    </div>
                    <div>
                      <div className="text-6xl font-bold text-white drop-shadow-lg">
                        {convertTemp(data.current.temp_c)}°
                      </div>
                      <div className="text-base text-cyan-200 mt-2 font-medium">{data.current.condition.text}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-white/20">
                    <div className="flex flex-col items-center gap-2 flex-1">
                      <Droplets className="w-5 h-5 text-cyan-300" />
                      <span className="text-sm text-white font-semibold">{data.current.humidity}%</span>
                      <span className="text-xs text-cyan-200">Humidity</span>
                    </div>
                    <div className="w-px h-12 bg-white/20"></div>
                    <div className="flex flex-col items-center gap-2 flex-1">
                      <Wind className="w-5 h-5 text-blue-300" />
                      <span className="text-sm text-white font-semibold">{data.current.wind_kph}</span>
                      <span className="text-xs text-cyan-200">km/h</span>
                    </div>
                    <div className="w-px h-12 bg-white/20"></div>
                    <div className="flex flex-col items-center gap-2 flex-1">
                      <Eye className="w-5 h-5 text-purple-300" />
                      <span className="text-sm text-white font-semibold">{data.current.vis_km}</span>
                      <span className="text-xs text-cyan-200">km</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed View Modal */}
        {state.selectedCity && weatherData[state.selectedCity] && (
          <div className="fixed inset-0 z-50 top-13 overflow-auto bg-black/70 backdrop-blur-md p-8" style={{ animation: 'fade-in 0.3s ease-out' }}>
            <div className="min-h-screen flex items-start justify-center pt-12 pb-12">
              <div className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-2xl rounded-3xl shadow-2xl w-full max-w-6xl border border-white/10" style={{ animation: 'scale-in 0.3s ease-out' }}>
                {/* Modal Header */}
                <div className="sticky top-0 bg-gradient-to-r from-slate-800 to-slate-900 border-b border-white/10 rounded-t-3xl px-10 py-8 flex justify-between items-center backdrop-blur-xl">
                  <div>
                    <h2 className="text-3xl font-bold text-white flex items-center gap-4">
                      <MapPin className="w-8 h-8 text-cyan-400" style={{ filter: 'drop-shadow(0 0 10px rgba(34, 211, 238, 0.8))' }} />
                      {state.selectedCity}
                    </h2>
                    <p className="text-sm text-cyan-200 mt-2 font-medium">Comprehensive Weather Analytics</p>
                  </div>
                  <button
                    onClick={() => dispatch({ type: 'SELECT_CITY', payload: null })}
                    className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all backdrop-blur-xl"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-10 space-y-10">
                  {/* Current Weather Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                      { icon: Gauge, label: 'Pressure', value: `${weatherData[state.selectedCity].current.pressure_mb}`, unit: 'mb', color: 'from-orange-500 to-red-500' },
                      { icon: Droplets, label: 'Humidity', value: `${weatherData[state.selectedCity].current.humidity}`, unit: '%', color: 'from-cyan-500 to-blue-500' },
                      { icon: Wind, label: 'Wind Speed', value: `${weatherData[state.selectedCity].current.wind_kph}`, unit: 'km/h', color: 'from-green-500 to-emerald-500' },
                      { icon: Navigation, label: 'Wind Dir', value: weatherData[state.selectedCity].current.wind_dir, unit: '', color: 'from-purple-500 to-pink-500' }
                    ].map((item, i) => (
                      <div key={i} className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:scale-105 transition-transform duration-300">
                        <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${item.color} mb-4 shadow-lg`}>
                          <item.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-xs text-cyan-200 font-semibold mb-2 uppercase tracking-wider">{item.label}</div>
                        <div className="flex items-baseline gap-1">
                          <div className="text-2xl font-bold text-white">{item.value}</div>
                          {item.unit && <div className="text-sm text-cyan-300">{item.unit}</div>}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 7-Day Forecast Chart */}
                  <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-8">
                    <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      7-Day Temperature Forecast
                    </h3>
                    
                    <ResponsiveContainer width="100%" height={320}>
                      <AreaChart data={forecastData[state.selectedCity]?.forecastday?.map(day => ({
                        date: new Date(day.date).toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' }),
                        maxTemp: state.unit === 'F' ? day.day.maxtemp_c * 9/5 + 32 : day.day.maxtemp_c,
                        minTemp: state.unit === 'F' ? day.day.mintemp_c * 9/5 + 32 : day.day.mintemp_c
                      })) || []}>
                        <defs>
                          <linearGradient id="colorMax" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                          </linearGradient>
                          <linearGradient id="colorMin" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: '13px', fontWeight: '500' }} />
                        <YAxis stroke="#94a3b8" style={{ fontSize: '13px', fontWeight: '500' }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(15, 23, 42, 0.95)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '12px',
                            fontSize: '13px',
                            color: '#fff',
                            backdropFilter: 'blur(12px)'
                          }}
                        />
                        <Legend wrapperStyle={{ fontSize: '13px', fontWeight: '600', color: '#fff' }} />
                        <Area type="monotone" dataKey="maxTemp" stroke="#ef4444" fill="url(#colorMax)" name="Max Temp" strokeWidth={3} />
                        <Area type="monotone" dataKey="minTemp" stroke="#3b82f6" fill="url(#colorMin)" name="Min Temp" strokeWidth={3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Hourly Forecast Chart */}
                  <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-8">
                    <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      24-Hour Temperature Trend
                    </h3>
                    
                    <ResponsiveContainer width="100%" height={320}>
                      <LineChart data={forecastData[state.selectedCity]?.forecastday?.[0]?.hour?.map(hour => ({
                        time: new Date(hour.time).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }),
                        temp: state.unit === 'F' ? hour.temp_c * 9/5 + 32 : hour.temp_c,
                        feelslike: state.unit === 'F' ? hour.feelslike_c * 9/5 + 32 : hour.feelslike_c
                      })) || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="time" stroke="#94a3b8" style={{ fontSize: '13px', fontWeight: '500' }} />
                        <YAxis stroke="#94a3b8" style={{ fontSize: '13px', fontWeight: '500' }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(15, 23, 42, 0.95)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '12px',
                            fontSize: '13px',
                            color: '#fff',
                            backdropFilter: 'blur(12px)'
                          }}
                        />
                        <Legend wrapperStyle={{ fontSize: '13px', fontWeight: '600', color: '#fff' }} />
                        <Line type="monotone" dataKey="temp" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4, fill: '#06b6d4' }} name="Temperature" />
                        <Line type="monotone" dataKey="feelslike" stroke="#a855f7" strokeWidth={3} strokeDasharray="5 5" dot={false} name="Feels Like" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default WeatherDashboard;