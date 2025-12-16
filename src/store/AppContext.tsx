import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

// Types
export interface DesignData {
  generatedImage: string | null;
  refinedImage: string | null;
  currentImage: string | null;
  lastPrompt: string;
  lastRefinementPrompt: string;
  canRefine: boolean;
  hasGenerated: boolean;
}

export interface CartItem {
  id: string;
  frontDesign: {
    imageUrl: string | null;
    design: string;
    alignment?: {
      x: number;
      y: number;
      width: number;
      height: number;
      rotation: number;
    };
    snapshotUrl?: string; // High-quality composite preview
  };
  backDesign: {
    imageUrl: string | null;
    design: string;
    alignment?: {
      x: number;
      y: number;
      width: number;
      height: number;
      rotation: number;
    };
    snapshotUrl?: string; // High-quality composite preview
  };
  tshirtColor: string;
  material: string;
  size: string;
  addedAt: string;
  price: number;
  // AR Try-On specific data
  arData?: {
    frontMockupUrl?: string;
    backMockupUrl?: string;
    frontSnapshotUrl?: string;
    backSnapshotUrl?: string;
    lastUsedForAR?: string;
  };
}

export interface DesignAlignment {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

export interface AppState {
  // Front & Back Design state (CRITICAL: Completely separate)
  frontDesign: DesignData;
  backDesign: DesignData;
  
  // Design alignment states (PERSISTENT)
  frontDesignAlignment: DesignAlignment;
  backDesignAlignment: DesignAlignment;
  
  // Current view state
  currentSide: 'front' | 'back';
  
  // UI state
  isGenerating: boolean;
  isRefining: boolean;
  
  // T-shirt state
  tshirtColor: string;
  
  // Cart state
  cartItems: CartItem[];
  
  // Error/Success state
  error: string | null;
  success: string | null;
  generationProgress: string;
}

// Actions
export type AppAction =
  | { type: 'SET_GENERATING'; payload: boolean }
  | { type: 'SET_REFINING'; payload: boolean }
  | { type: 'SET_GENERATED_IMAGE'; payload: { side: 'front' | 'back'; url: string } }
  | { type: 'SET_REFINED_IMAGE'; payload: { side: 'front' | 'back'; url: string } }
  | { type: 'SET_CURRENT_IMAGE'; payload: { side: 'front' | 'back'; url: string } }
  | { type: 'SET_LAST_PROMPT'; payload: { side: 'front' | 'back'; prompt: string } }
  | { type: 'SET_LAST_REFINEMENT_PROMPT'; payload: { side: 'front' | 'back'; prompt: string } }
  | { type: 'SET_CAN_REFINE'; payload: { side: 'front' | 'back'; canRefine: boolean } }
  | { type: 'SET_HAS_GENERATED'; payload: { side: 'front' | 'back'; hasGenerated: boolean } }
  | { type: 'UPDATE_DESIGN_ALIGNMENT'; payload: { side: 'front' | 'back'; alignment: DesignAlignment } }
  | { type: 'SWITCH_SIDE'; payload: 'front' | 'back' }
  | { type: 'SET_TSHIRT_COLOR'; payload: string }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SUCCESS'; payload: string | null }
  | { type: 'SET_GENERATION_PROGRESS'; payload: string }
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'LOAD_CART_ITEMS'; payload: CartItem[] }
  | { type: 'RESET_DESIGN_STATE'; payload?: 'front' | 'back' | 'both' }
  | { type: 'LOAD_PERSISTED_STATE'; payload: Partial<AppState> };

// Initial design data
const initialDesignData: DesignData = {
  generatedImage: null,
  refinedImage: null,
  currentImage: null,
  lastPrompt: '',
  lastRefinementPrompt: '',
  canRefine: false,
  hasGenerated: false,
};

// Initial alignment data
const initialAlignment: DesignAlignment = {
  x: 205, // Centered horizontally on T-shirt chest area
  y: 280, // Positioned in center of T-shirt chest (away from collar)
  width: 150,
  height: 150,
  rotation: 0,
};

// Initial state
const initialState: AppState = {
  frontDesign: { ...initialDesignData },
  backDesign: { ...initialDesignData },
  frontDesignAlignment: { ...initialAlignment },
  backDesignAlignment: { ...initialAlignment },
  currentSide: 'front',
  isGenerating: false,
  isRefining: false,
  tshirtColor: '#000000',
  cartItems: [],
  error: null,
  success: null,
  generationProgress: '',
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_GENERATING':
      return { ...state, isGenerating: action.payload };
    
    case 'SET_REFINING':
      return { ...state, isRefining: action.payload };
    
    case 'SET_GENERATED_IMAGE':
      const sideForGenerated = action.payload.side;
      return { 
        ...state, 
        [sideForGenerated + 'Design']: {
          ...state[sideForGenerated + 'Design' as keyof AppState] as DesignData,
          generatedImage: action.payload.url,
          currentImage: action.payload.url,
          hasGenerated: true,
          canRefine: true
        }
      };
    
    case 'SET_REFINED_IMAGE':
      const sideForRefined = action.payload.side;
      return { 
        ...state, 
        [sideForRefined + 'Design']: {
          ...state[sideForRefined + 'Design' as keyof AppState] as DesignData,
          refinedImage: action.payload.url,
          currentImage: action.payload.url
        }
      };
    
    case 'SET_CURRENT_IMAGE':
      const sideForCurrent = action.payload.side;
      return { 
        ...state, 
        [sideForCurrent + 'Design']: {
          ...state[sideForCurrent + 'Design' as keyof AppState] as DesignData,
          currentImage: action.payload.url
        }
      };
    
    case 'SET_LAST_PROMPT':
      const sideForPrompt = action.payload.side;
      return { 
        ...state, 
        [sideForPrompt + 'Design']: {
          ...state[sideForPrompt + 'Design' as keyof AppState] as DesignData,
          lastPrompt: action.payload.prompt
        }
      };
    
    case 'SET_LAST_REFINEMENT_PROMPT':
      const sideForRefinement = action.payload.side;
      return { 
        ...state, 
        [sideForRefinement + 'Design']: {
          ...state[sideForRefinement + 'Design' as keyof AppState] as DesignData,
          lastRefinementPrompt: action.payload.prompt
        }
      };
    
    case 'SET_CAN_REFINE':
      const sideForRefine = action.payload.side;
      return { 
        ...state, 
        [sideForRefine + 'Design']: {
          ...state[sideForRefine + 'Design' as keyof AppState] as DesignData,
          canRefine: action.payload.canRefine
        }
      };
    
    case 'SET_HAS_GENERATED':
      const sideForGenerate = action.payload.side;
      return { 
        ...state, 
        [sideForGenerate + 'Design']: {
          ...state[sideForGenerate + 'Design' as keyof AppState] as DesignData,
          hasGenerated: action.payload.hasGenerated
        }
      };
    
    case 'UPDATE_DESIGN_ALIGNMENT':
      const alignmentSide = action.payload.side;
      return {
        ...state,
        [alignmentSide + 'DesignAlignment']: action.payload.alignment
      };
    
    case 'SWITCH_SIDE':
      return { ...state, currentSide: action.payload };
    
    case 'SET_TSHIRT_COLOR':
      return { ...state, tshirtColor: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_SUCCESS':
      return { ...state, success: action.payload };
    
    case 'SET_GENERATION_PROGRESS':
      return { ...state, generationProgress: action.payload };
    
    case 'ADD_TO_CART':
      const newCartItems = [...state.cartItems, action.payload];
      // Cart items are NOT persisted (clear on refresh)
      return { ...state, cartItems: newCartItems };
    
    case 'REMOVE_FROM_CART':
      const filteredItems = state.cartItems.filter(item => item.id !== action.payload);
      // Cart items are NOT persisted (clear on refresh)
      return { ...state, cartItems: filteredItems };
    
    case 'LOAD_CART_ITEMS':
      return { ...state, cartItems: action.payload };
    
    case 'RESET_DESIGN_STATE':
      const resetSide = action.payload || 'both';
      if (resetSide === 'both') {
        return {
          ...state,
          frontDesign: { ...initialDesignData },
          backDesign: { ...initialDesignData },
          isGenerating: false,
          isRefining: false,
          error: null,
          success: null,
          generationProgress: '',
        };
      } else {
        return {
          ...state,
          [resetSide + 'Design']: { ...initialDesignData },
          isGenerating: false,
          isRefining: false,
          error: null,
          success: null,
          generationProgress: '',
        };
      }
    
    case 'LOAD_PERSISTED_STATE':
      return { ...state, ...action.payload };
    
    default:
      return state;
  }
}

// Context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Provider component
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load persisted state on mount (but clear on actual page refresh)
  useEffect(() => {
    try {
      // Check if this is a fresh page load (not just React navigation)
      const isPageRefresh = !sessionStorage.getItem('appInitialized');
      
      if (isPageRefresh) {
        // Fresh page load - clear everything
        localStorage.removeItem('designState');
        localStorage.removeItem('tshirtColor');
        localStorage.removeItem('cartItems');
        sessionStorage.setItem('appInitialized', 'true');
        console.log('🧹 Fresh page load - cleared all state');
      } else {
        // Internal navigation - restore state
        console.log('🔄 Internal navigation - restoring state');
        
        // Load design state
        const savedDesignState = localStorage.getItem('designState');
        if (savedDesignState) {
          const designState = JSON.parse(savedDesignState);
          dispatch({ type: 'LOAD_PERSISTED_STATE', payload: designState });
        }

        // Load T-shirt color
        const savedTshirtColor = localStorage.getItem('tshirtColor');
        if (savedTshirtColor) {
          dispatch({ type: 'SET_TSHIRT_COLOR', payload: savedTshirtColor });
        }

        // Load cart items
        const savedCartItems = localStorage.getItem('cartItems');
        if (savedCartItems) {
          const cartItems = JSON.parse(savedCartItems);
          dispatch({ type: 'LOAD_CART_ITEMS', payload: cartItems });
        }
      }
    } catch (error) {
      console.error('Error managing persisted state:', error);
    }
  }, []);

  // Persist design state whenever it changes (for internal navigation)
  useEffect(() => {
    const designState = {
      frontDesign: state.frontDesign,
      backDesign: state.backDesign,
      frontDesignAlignment: state.frontDesignAlignment,
      backDesignAlignment: state.backDesignAlignment,
      currentSide: state.currentSide,
    };
    
    localStorage.setItem('designState', JSON.stringify(designState));
  }, [
    state.frontDesign,
    state.backDesign,
    state.frontDesignAlignment,
    state.backDesignAlignment,
    state.currentSide,
  ]);

  // Persist T-shirt color
  useEffect(() => {
    localStorage.setItem('tshirtColor', state.tshirtColor);
  }, [state.tshirtColor]);

  // Persist cart items
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
  }, [state.cartItems]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Hook to use the context
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

// Helper hooks for specific functionality
export function useDesignState() {
  const { state, dispatch } = useAppContext();
  const currentDesign = state.currentSide === 'front' ? state.frontDesign : state.backDesign;
  const currentAlignment = state.currentSide === 'front' ? state.frontDesignAlignment : state.backDesignAlignment;
  
  return {
    // Current side design data
    generatedImage: currentDesign.generatedImage,
    refinedImage: currentDesign.refinedImage,
    currentImage: currentDesign.currentImage,
    lastPrompt: currentDesign.lastPrompt,
    lastRefinementPrompt: currentDesign.lastRefinementPrompt,
    canRefine: currentDesign.canRefine,
    hasGenerated: currentDesign.hasGenerated,
    
    // Current side alignment data
    currentAlignment: currentAlignment,
    frontAlignment: state.frontDesignAlignment,
    backAlignment: state.backDesignAlignment,
    
    // Global UI state
    isGenerating: state.isGenerating,
    isRefining: state.isRefining,
    error: state.error,
    success: state.success,
    generationProgress: state.generationProgress,
    
    // Current side info
    currentSide: state.currentSide,
    
    // All design data (for cart, etc.)
    frontDesign: state.frontDesign,
    backDesign: state.backDesign,
    
    // Actions (automatically target current side)
    setGenerating: (value: boolean) => dispatch({ type: 'SET_GENERATING', payload: value }),
    setRefining: (value: boolean) => dispatch({ type: 'SET_REFINING', payload: value }),
    setGeneratedImage: (url: string) => dispatch({ type: 'SET_GENERATED_IMAGE', payload: { side: state.currentSide, url } }),
    setRefinedImage: (url: string) => dispatch({ type: 'SET_REFINED_IMAGE', payload: { side: state.currentSide, url } }),
    setCurrentImage: (url: string) => dispatch({ type: 'SET_CURRENT_IMAGE', payload: { side: state.currentSide, url } }),
    setLastPrompt: (prompt: string) => dispatch({ type: 'SET_LAST_PROMPT', payload: { side: state.currentSide, prompt } }),
    setLastRefinementPrompt: (prompt: string) => dispatch({ type: 'SET_LAST_REFINEMENT_PROMPT', payload: { side: state.currentSide, prompt } }),
    updateAlignment: (alignment: DesignAlignment) => dispatch({ type: 'UPDATE_DESIGN_ALIGNMENT', payload: { side: state.currentSide, alignment } }),
    setError: (error: string | null) => dispatch({ type: 'SET_ERROR', payload: error }),
    setSuccess: (success: string | null) => dispatch({ type: 'SET_SUCCESS', payload: success }),
    setGenerationProgress: (progress: string) => dispatch({ type: 'SET_GENERATION_PROGRESS', payload: progress }),
    switchSide: (side: 'front' | 'back') => dispatch({ type: 'SWITCH_SIDE', payload: side }),
    resetDesignState: (side?: 'front' | 'back' | 'both') => dispatch({ type: 'RESET_DESIGN_STATE', payload: side }),
  };
}

export function useCartState() {
  const { state, dispatch } = useAppContext();
  
  return {
    cartItems: state.cartItems,
    addToCart: (item: CartItem) => dispatch({ type: 'ADD_TO_CART', payload: item }),
    removeFromCart: (id: string) => dispatch({ type: 'REMOVE_FROM_CART', payload: id }),
    // Export cart data for AR try-on
    exportForAR: (itemId: string) => {
      const item = state.cartItems.find(i => i.id === itemId);
      if (!item) return null;
      
      return {
        id: item.id,
        frontDesign: item.frontDesign,
        backDesign: item.backDesign,
        tshirtColor: item.tshirtColor,
        material: item.material,
        size: item.size,
        arData: item.arData
      };
    },
    // Get latest cart item for AR
    getLatestForAR: () => {
      if (state.cartItems.length === 0) return null;
      return state.cartItems[state.cartItems.length - 1];
    }
  };
}

export function useTshirtState() {
  const { state, dispatch } = useAppContext();
  
  return {
    tshirtColor: state.tshirtColor,
    setTshirtColor: (color: string) => dispatch({ type: 'SET_TSHIRT_COLOR', payload: color }),
  };
}