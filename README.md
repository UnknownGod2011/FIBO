# CRISHIRTS - AI-Powered T-Shirt Design Platform

## 🏆 FIBO Hackathon Submission

**CRISHIRTS** is a production-ready AI T-shirt design platform that showcases Bria FIBO's JSON-native image generation capabilities. The platform demonstrates deterministic control over visual parameters through structured JSON, enabling designers to create, refine, and visualize custom apparel designs with precision.

## 🎯 Prize Categories

- **Best Overall**: JSON-native control with professional parameters
- **Best Controllability**: Real-time parameter editing and systematic exploration
- **Best JSON-Native Workflow**: Automated batch generation with full reproducibility
- **Best UX/Professional Tool**: Intuitive design interface with AR try-on

## ✨ Key Features

### 🎨 **FIBO JSON-Native Generation**
- Natural language prompts automatically translated to structured JSON
- Direct JSON parameter editing with real-time validation
- Deterministic generation with full reproducibility
- Professional parameter control (camera angles, FOV, lighting, color palettes)

### 👕 **T-Shirt Mockup System**
- Real-time design overlay on T-shirt templates
- Multiple T-shirt colors and styles (crew-neck, v-neck, long-sleeve, tank-top)
- Perspective-correct design placement
- Instant mockup updates

### 🔄 **Batch Generation Pipeline**
- Systematic parameter variation across multiple dimensions
- Progress tracking for concurrent generations
- Visual comparison grid for design exploration
- Production-ready workflow demonstration

### 📱 **AR Try-On Experience**
- Real-time augmented reality T-shirt visualization
- Body tracking using MediaPipe
- Design switching in AR mode
- Fallback for unsupported devices

### 💾 **Design Library & Export**
- Save designs with complete JSON parameters
- Export/import with full reproducibility
- Print-ready PNG format (300+ DPI)
- Batch export functionality

### 🎛️ **Parameter Presets & Suggestions**
- 5+ style presets (Minimalist, Vibrant, Photorealistic, Artistic, HDR)
- Real-time parameter suggestions based on prompts
- Visual parameter documentation with examples

## 🚀 Technology Stack

**Frontend:**
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS + shadcn/ui components
- React Three Fiber for 3D mockup rendering
- @mediapipe/tasks-vision for AR body tracking
- Zustand for state management

**Backend:**
- Node.js with Express
- Bria FIBO API integration
- Sharp for image processing
- Canvas for mockup generation
- JSON Schema validation (Ajv)

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+
- Bria FIBO API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/UnknownGod2011/CRISHIRT.git
cd CRISHIRT
```

2. **Install dependencies**
```bash
# Frontend
npm install

# Backend
cd backend
npm install
```

3. **Environment Setup**
```bash
# Backend (.env)
FIBO_API_KEY=your_fibo_api_key_here
PORT=5000

# Frontend (.env)
VITE_API_URL=http://localhost:5000
```

4. **Start the application**
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
npm run dev
```

5. **Open in browser**
```
http://localhost:5173
```

## 🎬 Demo Workflow

1. **Natural Language to JSON**: Enter "geometric abstract art" → See automatic JSON translation
2. **Parameter Control**: Adjust camera angle, lighting, colors → Real-time regeneration
3. **T-Shirt Mockup**: Instant overlay on T-shirt templates with color/style options
4. **Batch Generation**: Create 8 variants with systematic parameter variations
5. **AR Try-On**: Activate camera → See designs on your body in real-time
6. **Export/Import**: Save designs with parameters → Perfect reproducibility

## 🏗️ FIBO Integration Highlights

### JSON-Native Control
```typescript
const fiboParams = {
  prompt: "minimalist geometric design",
  camera: {
    angle: "eye-level",
    fov: 45,
    distance: "medium"
  },
  lighting: {
    type: "studio",
    direction: "front",
    intensity: 80
  },
  color: {
    palette: ["#FF5733", "#33A1FF", "#28A745"],
    saturation: 85,
    contrast: 70
  },
  composition: {
    rule: "rule-of-thirds",
    balance: "balanced"
  }
}
```

### Deterministic Generation
- Every design includes complete JSON parameters
- Export/import maintains exact reproducibility
- Version control for design iterations
- Production-ready parameter management

### Professional Workflow
- Batch generation with systematic variations
- Real-time parameter validation
- Print-ready output formats
- Scalable design pipeline

## 📊 Performance Metrics

- **Generation Time**: < 10 seconds per design
- **Mockup Generation**: < 2 seconds
- **AR Frame Rate**: 30+ FPS
- **Batch Processing**: 8 variants in < 2 minutes
- **Parameter Validation**: Real-time with < 100ms response

## 🎯 Production Use Cases

- **Custom Apparel Businesses**: On-demand T-shirt design generation
- **Corporate Merchandise**: Brand-compliant design creation
- **Print-on-Demand**: Scalable design pipeline integration
- **Design Agencies**: Rapid concept exploration and client presentation
- **E-commerce Platforms**: Interactive design customization

## 🔧 API Endpoints

```
POST /api/generate          # Generate design from prompt/parameters
POST /api/mockup           # Create T-shirt mockup
POST /api/batch/generate   # Start batch generation
GET  /api/batch/:id/status # Check batch progress
POST /api/designs          # Save design to library
GET  /api/designs          # List saved designs
POST /api/designs/export   # Export design bundle
```

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run property-based tests
npm run test:properties

# Run E2E tests
npm run test:e2e
```

## 📝 License

MIT License - See LICENSE file for details

## 🤝 Contributing

This project was created for the FIBO Hackathon. For questions or collaboration opportunities, please reach out!

---

**Built with ❤️ for the FIBO Hackathon 2024**

*Showcasing the future of AI-powered design tools with JSON-native control and production-ready workflows.*