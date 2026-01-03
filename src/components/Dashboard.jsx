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
    if (code === 1000) return <Sun className="w-10 h-10 text-amber-400" />;
    if ([1003, 1006, 1009].includes(code)) return <Cloud className="w-10 h-10 text-slate-400" />;
    if ([1063, 1180, 1183, 1186, 1189, 1192, 1195].includes(code)) return <CloudRain className="w-10 h-10 text-blue-400" />;
    return <Sun className="w-10 h-10 text-amber-400" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-neutral-900 to-zinc-950 relative">
      {/* Subtle grain texture overlay */}
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>

      {/* Ambient glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl"></div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-black/30 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-emerald-500 rounded-xl blur-lg opacity-60"></div>
                <div className="relative bg-gradient-to-br from-violet-600 to-emerald-600 p-2.5 rounded-xl">
                  <Cloud className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white tracking-tight">WeatherPro</h1>
                <p className="text-xs text-slate-400">Global forecasting</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search location..."
                  value={state.searchQuery}
                  onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
                  onKeyPress={(e) => e.key === 'Enter' && searchCity(state.searchQuery)}
                  className="w-80 px-4 py-2.5 pl-11 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all"
                />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
              
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group"
              >
                <Settings className="w-5 h-5 text-slate-300 group-hover:rotate-90 transition-transform duration-500" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 rounded-2xl shadow-2xl w-full max-w-md p-6 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-slate-300" />
              </button>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">Temperature Unit</label>
              <div className="flex gap-3">
                <button
                  onClick={() => dispatch({ type: 'SET_UNIT', payload: 'C' })}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                    state.unit === 'C'
                      ? 'bg-gradient-to-r from-violet-600 to-emerald-600 text-white shadow-lg'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  Celsius (°C)
                </button>
                <button
                  onClick={() => dispatch({ type: 'SET_UNIT', payload: 'F' })}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                    state.unit === 'F'
                      ? 'bg-gradient-to-r from-violet-600 to-emerald-600 text-white shadow-lg'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  Fahrenheit (°F)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        {/* City Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Object.entries(weatherData).slice(0, 16).map(([city, data]) => {
            if (!data?.current) return null;
            
            return (
              <div
                key={city}
                onClick={() => dispatch({ type: 'SELECT_CITY', payload: city })}
                className="group relative bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:border-violet-500/50 hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600/0 to-emerald-600/0 group-hover:from-violet-600/5 group-hover:to-emerald-600/5 transition-all duration-300"></div>
                
                <div className="relative p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="w-4 h-4 text-violet-400" />
                        <h3 className="text-lg font-semibold text-white">{data.location.name}</h3>
                      </div>
                      <p className="text-xs text-slate-400">{data.location.country}</p>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(city);
                      }}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
                    >
                      <Star
                        className={`w-4 h-4 transition-all ${
                          state.favorites.includes(city) 
                            ? 'fill-amber-400 text-amber-400' 
                            : 'text-slate-400'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      {getWeatherIcon(data.current.condition.code)}
                      <div>
                        <div className="text-4xl font-bold text-white">
                          {convertTemp(data.current.temp_c)}°
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">{data.current.condition.text}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-around pt-4 border-t border-white/10">
                    <div className="flex flex-col items-center gap-1">
                      <Droplets className="w-4 h-4 text-blue-400" />
                      <span className="text-xs text-white font-medium">{data.current.humidity}%</span>
                    </div>
                    <div className="w-px h-8 bg-white/10"></div>
                    <div className="flex flex-col items-center gap-1">
                      <Wind className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs text-white font-medium">{data.current.wind_kph} km/h</span>
                    </div>
                    <div className="w-px h-8 bg-white/10"></div>
                    <div className="flex flex-col items-center gap-1">
                      <Eye className="w-4 h-4 text-violet-400" />
                      <span className="text-xs text-white font-medium">{data.current.vis_km} km</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed View Modal */}
        {state.selectedCity && weatherData[state.selectedCity] && (
          <div className="fixed inset-0 z-50 overflow-auto bg-black/80 backdrop-blur-md p-4">
            <div className="min-h-screen flex items-start justify-center py-12">
              <div className="bg-gradient-to-br from-neutral-900/95 to-neutral-950/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-5xl border border-white/10">
                {/* Modal Header */}
                <div className="sticky top-0 bg-gradient-to-r from-neutral-900 to-neutral-950 border-b border-white/10 rounded-t-3xl px-8 py-6 flex justify-between items-center backdrop-blur-xl z-10">
                  <div>
                    <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
                      <MapPin className="w-6 h-6 text-violet-400" />
                      {state.selectedCity}
                    </h2>
                    <p className="text-sm text-slate-400 mt-1">Detailed forecast & analytics</p>
                  </div>
                  <button
                    onClick={() => dispatch({ type: 'SELECT_CITY', payload: null })}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
                  >
                    <X className="w-5 h-5 text-slate-300" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-8 space-y-6">
                  {/* Current Weather Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { icon: Gauge, label: 'Pressure', value: `${weatherData[state.selectedCity].current.pressure_mb}`, unit: 'mb', color: 'from-orange-500 to-red-500' },
                      { icon: Droplets, label: 'Humidity', value: `${weatherData[state.selectedCity].current.humidity}`, unit: '%', color: 'from-blue-500 to-cyan-500' },
                      { icon: Wind, label: 'Wind Speed', value: `${weatherData[state.selectedCity].current.wind_kph}`, unit: 'km/h', color: 'from-emerald-500 to-green-500' },
                      { icon: Navigation, label: 'Wind Dir', value: weatherData[state.selectedCity].current.wind_dir, unit: '', color: 'from-violet-500 to-purple-500' }
                    ].map((item, i) => (
                      <div key={i} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all">
                        <div className={`inline-flex p-2.5 rounded-lg bg-gradient-to-br ${item.color} mb-3`}>
                          <item.icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-xs text-slate-400 font-medium mb-1 uppercase tracking-wide">{item.label}</div>
                        <div className="flex items-baseline gap-1">
                          <div className="text-xl font-semibold text-white">{item.value}</div>
                          {item.unit && <div className="text-xs text-slate-400">{item.unit}</div>}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 7-Day Forecast Chart */}
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500 to-emerald-500">
                        <Calendar className="w-4 h-4 text-white" />
                      </div>
                      7-Day Temperature Forecast
                    </h3>
                    
                    <ResponsiveContainer width="100%" height={280}>
                      <AreaChart data={forecastData[state.selectedCity]?.forecastday?.map(day => ({
                        date: new Date(day.date).toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' }),
                        maxTemp: state.unit === 'F' ? day.day.maxtemp_c * 9/5 + 32 : day.day.maxtemp_c,
                        minTemp: state.unit === 'F' ? day.day.mintemp_c * 9/5 + 32 : day.day.mintemp_c
                      })) || []}>
                        <defs>
                          <linearGradient id="colorMax" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#f97316" stopOpacity={0.05}/>
                          </linearGradient>
                          <linearGradient id="colorMin" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="date" stroke="#64748b" style={{ fontSize: '12px' }} />
                        <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(23, 23, 23, 0.95)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            fontSize: '12px',
                            color: '#fff'
                          }}
                        />
                        <Legend wrapperStyle={{ fontSize: '12px', color: '#fff' }} />
                        <Area type="monotone" dataKey="maxTemp" stroke="#f97316" fill="url(#colorMax)" name="Max Temp" strokeWidth={2} />
                        <Area type="monotone" dataKey="minTemp" stroke="#3b82f6" fill="url(#colorMin)" name="Min Temp" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Hourly Forecast Chart */}
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-violet-500">
                        <Clock className="w-4 h-4 text-white" />
                      </div>
                      24-Hour Temperature Trend
                    </h3>
                    
                    <ResponsiveContainer width="100%" height={280}>
                      <LineChart data={forecastData[state.selectedCity]?.forecastday?.[0]?.hour?.map(hour => ({
                        time: new Date(hour.time).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }),
                        temp: state.unit === 'F' ? hour.temp_c * 9/5 + 32 : hour.temp_c,
                        feelslike: state.unit === 'F' ? hour.feelslike_c * 9/5 + 32 : hour.feelslike_c
                      })) || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="time" stroke="#64748b" style={{ fontSize: '12px' }} />
                        <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(23, 23, 23, 0.95)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            fontSize: '12px',
                            color: '#fff'
                          }}
                        />
                        <Legend wrapperStyle={{ fontSize: '12px', color: '#fff' }} />
                        <Line type="monotone" dataKey="temp" stroke="#10b981" strokeWidth={2} dot={{ r: 3, fill: '#10b981' }} name="Temperature" />
                        <Line type="monotone" dataKey="feelslike" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="4 4" dot={false} name="Feels Like" />
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