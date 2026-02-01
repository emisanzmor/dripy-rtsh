"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export type Rank = "bronce" | "plata" | "oro" | "diamante"

export interface SurveyData {
  residents: number
  homeType: string
  hasGarden: boolean
  hasPool: boolean
}

export interface Action {
  id: string
  title: string
  points: number
  completed: boolean
}

export interface User {
  name: string
  points: number
  level: number
  streak: number
  rank: Rank
  waterSaved: number
  isPro: boolean
  uploadedBills: string[]
}

export interface CommunityMember {
  id: number
  name: string
  points: number
  rank: Rank
  avatar: string
}

export interface Event {
  id: string
  title: string
  distance: number
  image: string
  isPaidPromotion: boolean
}

export interface ConsumptionData {
  month: string
  water: number
  electricity: number
}

export interface Reward {
  id: string
  brand: string
  title: string
  description: string
  pointsCost: number
  category: "descuento" | "suscripcion" | "completa"
  logo: string
  color: string
}

interface DripyContextType {
  isLoggedIn: boolean
  surveyCompleted: boolean
  user: User
  surveyData: SurveyData | null
  actions: Action[]
  leaderboard: CommunityMember[]
  events: Event[]
  consumptionHistory: ConsumptionData[]
  rewards: Reward[]
  login: () => void
  completeSurvey: (data: SurveyData) => void
  completeAction: (id: string) => void
  addPoints: (points: number) => void
  simulateLevelUp: () => void
  upgradeToPro: () => void
  uploadBill: (billUrl: string) => void
  attendEvent: (eventId: string) => void
  redeemReward: (rewardId: string) => void
}

const defaultActions: Action[] = [
  { id: "1", title: "Ducha rapida (5 min)", points: 50, completed: false },
  { id: "2", title: "Cerrar llave al cepillarse", points: 30, completed: false },
  { id: "3", title: "Reutilizar agua para plantas", points: 70, completed: false },
  { id: "4", title: "Lavadora con carga completa", points: 60, completed: false },
  { id: "5", title: "Revisar fugas en casa", points: 100, completed: false },
  { id: "6", title: "Recolectar agua de lluvia", points: 80, completed: false },
]

const defaultEvents: Event[] = [
  { id: "1", title: "Maraton por el Agua", distance: 2.3, image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400&h=300&fit=crop", isPaidPromotion: false },
  { id: "2", title: "Plantemos Arboles", distance: 4.1, image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=300&fit=crop", isPaidPromotion: true },
  { id: "3", title: "Limpieza del Rio", distance: 5.8, image: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=400&h=300&fit=crop", isPaidPromotion: false },
  { id: "4", title: "Taller Captacion Pluvial", distance: 1.2, image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=400&h=300&fit=crop", isPaidPromotion: true },
  { id: "5", title: "Feria Eco-Sustentable", distance: 0.8, image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&h=300&fit=crop", isPaidPromotion: false },
]

const defaultRewards: Reward[] = [
  // Descuentos (Bronce level - 400-600 pts)
  { id: "1", brand: "Nike", title: "20% descuento", description: "Valido en toda la tienda online", pointsCost: 500, category: "descuento", logo: "N", color: "bg-black" },
  { id: "2", brand: "Adidas", title: "15% descuento", description: "En ropa y calzado deportivo", pointsCost: 400, category: "descuento", logo: "A", color: "bg-black" },
  { id: "9", brand: "Under Armour", title: "25% descuento", description: "En toda la tienda", pointsCost: 600, category: "descuento", logo: "U", color: "bg-gray-800" },
  { id: "10", brand: "Puma", title: "30% descuento", description: "Solo articulos seleccionados", pointsCost: 450, category: "descuento", logo: "P", color: "bg-black" },
  
  // Suscripciones 1 mes (Plata level - 800-1200 pts)
  { id: "3", brand: "Spotify", title: "1 mes gratis", description: "Suscripcion Premium individual", pointsCost: 800, category: "suscripcion", logo: "S", color: "bg-green-500" },
  { id: "4", brand: "Netflix", title: "1 mes gratis", description: "Plan Estandar con anuncios", pointsCost: 900, category: "suscripcion", logo: "N", color: "bg-red-600" },
  { id: "5", brand: "Disney+", title: "1 mes gratis", description: "Acceso completo al catalogo", pointsCost: 850, category: "suscripcion", logo: "D", color: "bg-blue-600" },
  { id: "11", brand: "TotalPass", title: "1 mes gratis", description: "Acceso a gimnasios y bienestar", pointsCost: 1000, category: "suscripcion", logo: "T", color: "bg-purple-600" },
  { id: "12", brand: "Strava", title: "1 mes Premium", description: "Analisis avanzado de actividad", pointsCost: 700, category: "suscripcion", logo: "S", color: "bg-orange-500" },
  { id: "13", brand: "Headspace", title: "1 mes gratis", description: "Meditacion y mindfulness", pointsCost: 750, category: "suscripcion", logo: "H", color: "bg-orange-400" },
  { id: "14", brand: "Calm", title: "1 mes gratis", description: "Sueno y relajacion", pointsCost: 800, category: "suscripcion", logo: "C", color: "bg-blue-400" },
  
  // Premium 3 meses (Oro/Diamante level - 2000+ pts)
  { id: "6", brand: "Spotify", title: "3 meses gratis", description: "Suscripcion Premium completa", pointsCost: 2000, category: "completa", logo: "S", color: "bg-green-500" },
  { id: "7", brand: "Netflix", title: "3 meses gratis", description: "Plan Premium 4K", pointsCost: 2500, category: "completa", logo: "N", color: "bg-red-600" },
  { id: "8", brand: "Disney+", title: "3 meses gratis", description: "Incluye Star+ y ESPN", pointsCost: 2200, category: "completa", logo: "D", color: "bg-blue-600" },
  { id: "15", brand: "TotalPass", title: "3 meses gratis", description: "Gimnasios ilimitados + clases", pointsCost: 2800, category: "completa", logo: "T", color: "bg-purple-600" },
  { id: "16", brand: "Strava", title: "1 ano Premium", description: "Todas las funciones avanzadas", pointsCost: 3500, category: "completa", logo: "S", color: "bg-orange-500" },
  { id: "17", brand: "Apple Fitness+", title: "3 meses gratis", description: "Entrenamientos guiados Apple", pointsCost: 2400, category: "completa", logo: "A", color: "bg-pink-500" },
  { id: "18", brand: "Peloton", title: "2 meses gratis", description: "Clases en vivo y on-demand", pointsCost: 3000, category: "completa", logo: "P", color: "bg-red-500" },
]

const consumptionHistory: ConsumptionData[] = [
  { month: "Sep", water: 18500, electricity: 320 },
  { month: "Oct", water: 17200, electricity: 295 },
  { month: "Nov", water: 15800, electricity: 280 },
  { month: "Dic", water: 14200, electricity: 265 },
  { month: "Ene", water: 12800, electricity: 245 },
  { month: "Feb", water: 11500, electricity: 230 },
]

const generateLeaderboardByRank = (): Record<Rank, CommunityMember[]> => {
  return {
    bronce: [
      { id: 1, name: "Emma W.", points: 680, rank: "bronce", avatar: "E" },
      { id: 2, name: "Luis T.", points: 620, rank: "bronce", avatar: "L" },
      { id: 3, name: "Olivia R.", points: 580, rank: "bronce", avatar: "O" },
      { id: 4, name: "Carlos K.", points: 520, rank: "bronce", avatar: "C" },
      { id: 5, name: "Ana M.", points: 450, rank: "bronce", avatar: "A" },
      { id: 6, name: "Jorge P.", points: 380, rank: "bronce", avatar: "J" },
      { id: 7, name: "Sofia B.", points: 320, rank: "bronce", avatar: "S" },
      { id: 8, name: "Lucas H.", points: 250, rank: "bronce", avatar: "L" },
    ],
    plata: [
      { id: 1, name: "Maria G.", points: 1420, rank: "plata", avatar: "M" },
      { id: 2, name: "Pedro F.", points: 1350, rank: "plata", avatar: "P" },
      { id: 3, name: "Tu", points: 1150, rank: "plata", avatar: "T" },
      { id: 4, name: "Carmen D.", points: 1080, rank: "plata", avatar: "C" },
      { id: 5, name: "Adrian C.", points: 980, rank: "plata", avatar: "A" },
      { id: 6, name: "Amelia S.", points: 890, rank: "plata", avatar: "A" },
      { id: 7, name: "Miguel V.", points: 820, rank: "plata", avatar: "M" },
      { id: 8, name: "Helena L.", points: 760, rank: "plata", avatar: "H" },
    ],
    oro: [
      { id: 1, name: "Elena J.", points: 2380, rank: "oro", avatar: "E" },
      { id: 2, name: "Guillermo N.", points: 2210, rank: "oro", avatar: "G" },
      { id: 3, name: "Andrea Q.", points: 2050, rank: "oro", avatar: "A" },
      { id: 4, name: "Benjamin Z.", points: 1920, rank: "oro", avatar: "B" },
      { id: 5, name: "Scarlett Y.", points: 1780, rank: "oro", avatar: "S" },
      { id: 6, name: "Enrique X.", points: 1650, rank: "oro", avatar: "E" },
      { id: 7, name: "Luna W.", points: 1580, rank: "oro", avatar: "L" },
      { id: 8, name: "Javier V.", points: 1520, rank: "oro", avatar: "J" },
    ],
    diamante: [
      { id: 1, name: "Claudia A.", points: 4250, rank: "diamante", avatar: "C" },
      { id: 2, name: "Alejandro B.", points: 3890, rank: "diamante", avatar: "A" },
      { id: 3, name: "Gracia C.", points: 3540, rank: "diamante", avatar: "G" },
      { id: 4, name: "Daniel D.", points: 3210, rank: "diamante", avatar: "D" },
      { id: 5, name: "Zoe E.", points: 2980, rank: "diamante", avatar: "Z" },
      { id: 6, name: "Mateo F.", points: 2750, rank: "diamante", avatar: "M" },
      { id: 7, name: "Lily G.", points: 2620, rank: "diamante", avatar: "L" },
      { id: 8, name: "Sebastian H.", points: 2550, rank: "diamante", avatar: "S" },
    ],
  }
}

const leaderboardByRank = generateLeaderboardByRank()

const DripyContext = createContext<DripyContextType | undefined>(undefined)

export function DripyProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [surveyCompleted, setSurveyCompleted] = useState(false)
  const [surveyData, setSurveyData] = useState<SurveyData | null>(null)
  const [events] = useState<Event[]>(defaultEvents)
  const [rewards] = useState<Reward[]>(defaultRewards)
  const [user, setUser] = useState<User>({
    name: "Usuario",
    points: 1150,
    level: 5,
    streak: 7,
    rank: "plata",
    waterSaved: 2340,
    isPro: false,
    uploadedBills: [],
  })
  const [actions, setActions] = useState<Action[]>(defaultActions)

  const getRank = (points: number): Rank => {
    if (points >= 2500) return "diamante"
    if (points >= 1500) return "oro"
    if (points >= 750) return "plata"
    return "bronce"
  }

  const login = () => setIsLoggedIn(true)

  const completeSurvey = (data: SurveyData) => {
    setSurveyData(data)
    setSurveyCompleted(true)
  }

  const completeAction = (id: string) => {
    setActions((prev) =>
      prev.map((action) => {
        if (action.id === id && !action.completed) {
          const pointsToAdd = user.isPro ? action.points * 2 : action.points
          addPoints(pointsToAdd)
          return { ...action, completed: true }
        }
        return action
      })
    )
  }

  const addPoints = (points: number) => {
    setUser((prev) => {
      const newPoints = prev.points + points
      const newLevel = Math.floor(newPoints / 500) + 1
      return {
        ...prev,
        points: newPoints,
        level: newLevel,
        rank: getRank(newPoints),
        waterSaved: prev.waterSaved + points * 2,
      }
    })
  }

  const simulateLevelUp = () => {
    const points = user.isPro ? 1000 : 500
    addPoints(points)
  }

  const upgradeToPro = () => {
    setUser((prev) => ({ ...prev, isPro: true }))
  }

  const uploadBill = (billUrl: string) => {
    setUser((prev) => ({
      ...prev,
      uploadedBills: [...prev.uploadedBills, billUrl],
    }))
    addPoints(150)
  }

  const attendEvent = () => {
    addPoints(50)
  }

  const redeemReward = (rewardId: string) => {
    const reward = rewards.find(r => r.id === rewardId)
    if (reward && user.points >= reward.pointsCost) {
      setUser((prev) => ({
        ...prev,
        points: prev.points - reward.pointsCost,
      }))
    }
  }

  const getCurrentRankLeaderboard = (): CommunityMember[] => {
    const rankBoard = [...leaderboardByRank[user.rank]]
    const youIndex = rankBoard.findIndex((m) => m.name === "Tu")
    if (youIndex !== -1) {
      rankBoard[youIndex] = { ...rankBoard[youIndex], points: user.points }
    } else {
      rankBoard.push({ id: 99, name: "Tu", points: user.points, rank: user.rank, avatar: "T" })
    }
    return rankBoard.sort((a, b) => b.points - a.points)
  }

  return (
    <DripyContext.Provider
      value={{
        isLoggedIn,
        surveyCompleted,
        user,
        surveyData,
        actions,
        leaderboard: getCurrentRankLeaderboard(),
        events,
        consumptionHistory,
        rewards,
        login,
        completeSurvey,
        completeAction,
        addPoints,
        simulateLevelUp,
        upgradeToPro,
        uploadBill,
        attendEvent,
        redeemReward,
      }}
    >
      {children}
    </DripyContext.Provider>
  )
}

export function useDripy() {
  const context = useContext(DripyContext)
  if (context === undefined) {
    throw new Error("useDripy must be used within a DripyProvider")
  }
  return context
}
