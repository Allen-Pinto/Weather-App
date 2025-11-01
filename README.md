# Weather Dashboard

A modern, responsive weather dashboard application that displays real-time weather information for multiple cities. Built with React, TypeScript, and Tailwind CSS.

![Weather Dashboard](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.2.0-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-3178c6.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.0-38b2ac.svg)

## ✨ Features

- **Multi-City Display**: View weather data for up to 16 cities simultaneously
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Real-time Data**: Current temperature, weather conditions, and more
- **Modern UI**: Clean, professional interface with smooth animations
- **TypeScript**: Fully typed for better development experience
- **Performance Optimized**: Efficient rendering with React best practices

## 🚀 Live Demo

[View Live Demo](https://your-weather-dashboard.vercel.app)

## 📸 Screenshots

![Dashboard Screenshot](./screenshots/dashboard.png)

## 🛠️ Installation

### Prerequisites

- Node.js 16.0 or higher
- npm or yarn package manager

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/weather-dashboard.git
   cd weather-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and add your API keys:
   ```env
   VITE_WEATHER_API_KEY=your_weather_api_key_here
   VITE_API_BASE_URL=your_api_base_url_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── WeatherCard/    # Individual city weather cards
│   └── Layout/         # Layout components
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── services/           # API services
└── styles/             # Global styles
```

## 🎯 Usage

### Basic Usage

1. The dashboard automatically loads weather data for predefined cities
2. Each card displays:
   - City name
   - Current temperature
   - Weather condition
   - Additional weather metrics

### Responsive Behavior

- **Mobile**: 1 column layout
- **Tablet**: 2 column layout
- **Desktop**: 3-4 column layout based on screen size

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_WEATHER_API_KEY` | API key for weather service | Yes |
| `VITE_API_BASE_URL` | Base URL for API endpoints | Yes |

### Customizing Cities

Edit the cities list in `src/config/cities.ts`:

```typescript
export const CITIES = [
  'New York',
  'London',
  'Tokyo',
  'Paris',
  // Add more cities...
];
```

## 📦 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run e2e tests
npm run test:e2e
```

## 🛡️ Error Handling

- Graceful handling of API failures
- Loading states for better UX
- Error boundaries for React components
- Fallback UI for missing data

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on git push

### Other Platforms

```bash
# Build the project
npm run build

# The build output will be in the 'dist' folder
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
- Icons from [Heroicons](https://heroicons.com/)
- Built with [Vite](https://vitejs.dev/)

## 📞 Support

If you have any questions or issues, please:

1. Check the [documentation](docs/)
2. Search existing [issues](https://github.com/your-username/weather-dashboard/issues)
3. Create a new issue with detailed information

## 🏆 Version History

- **1.0.0** (2024-01-15)
  - Initial release
  - Multi-city weather display
  - Responsive grid layout

---

<div align="center">

**Made with ❤️ and React**

</div>
```
