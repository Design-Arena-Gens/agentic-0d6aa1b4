'use client'

import { useState, useRef, useEffect } from 'react'
import styles from './page.module.css'

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'system',
      content: 'JARVIS AI Assistant initialized. How may I assist you today?',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInput(transcript)
        setIsListening(false)
      }

      recognitionRef.current.onerror = () => {
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }
  }, [])

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition not supported in this browser')
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const simulateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return 'Good day, sir. JARVIS at your service. How may I be of assistance?'
    } else if (lowerMessage.includes('weather')) {
      return 'Accessing weather data... Current conditions: 72°F, partly cloudy. Perfect conditions for productivity, sir.'
    } else if (lowerMessage.includes('time')) {
      return `Current time is ${new Date().toLocaleTimeString()}. Your schedule appears to be clear for the next hour.`
    } else if (lowerMessage.includes('status') || lowerMessage.includes('system')) {
      return 'All systems operational. Power levels at 100%. Network connectivity stable. No anomalies detected.'
    } else if (lowerMessage.includes('who are you')) {
      return 'I am JARVIS, your Just A Rather Very Intelligent System. I am here to assist you with information, tasks, and general support.'
    } else if (lowerMessage.includes('calculate') || lowerMessage.includes('math')) {
      return 'Certainly. Please provide the mathematical operation you would like me to perform.'
    } else if (lowerMessage.includes('thank')) {
      return 'You are most welcome, sir. Always a pleasure to be of service.'
    } else if (lowerMessage.includes('help')) {
      return 'I can assist you with: checking time, weather information, system status, calculations, reminders, and general information. Simply ask me anything.'
    } else {
      return `Processing your request: "${userMessage}". As a demonstration system, I provide simulated responses. In a production environment, I would integrate with real AI services, APIs, and databases to provide accurate, real-time information and execute complex tasks.`
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isProcessing) return

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsProcessing(true)

    setTimeout(() => {
      const response = simulateAIResponse(userMessage.content)
      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])
      setIsProcessing(false)
    }, 1000 + Math.random() * 1000)
  }

  return (
    <div className={styles.container}>
      <div className={styles.background}>
        <div className={styles.circuitPattern}></div>
      </div>

      <header className={styles.header}>
        <div className={styles.logo}>
          <div className={styles.arcReactor}></div>
          <h1>JARVIS</h1>
        </div>
        <div className={styles.statusBar}>
          <div className={styles.statusIndicator}>
            <span className={styles.statusDot}></span>
            <span>ONLINE</span>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.chatContainer}>
          <div className={styles.messagesWrapper}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`${styles.message} ${styles[message.role]}`}
              >
                <div className={styles.messageHeader}>
                  <span className={styles.messageRole}>
                    {message.role === 'user' ? 'YOU' : message.role === 'assistant' ? 'JARVIS' : 'SYSTEM'}
                  </span>
                  <span className={styles.messageTime}>
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <div className={styles.messageContent}>
                  {message.content}
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className={`${styles.message} ${styles.assistant}`}>
                <div className={styles.messageHeader}>
                  <span className={styles.messageRole}>JARVIS</span>
                </div>
                <div className={styles.messageContent}>
                  <div className={styles.thinking}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.inputContainer}>
          <button
            type="button"
            className={`${styles.voiceButton} ${isListening ? styles.listening : ''}`}
            onClick={toggleListening}
            title="Voice input"
          >
            🎤
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask JARVIS anything..."
            className={styles.input}
            disabled={isProcessing}
          />
          <button
            type="submit"
            className={styles.sendButton}
            disabled={!input.trim() || isProcessing}
          >
            ⚡
          </button>
        </form>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <span>JARVIS AI Assistant v1.0</span>
          <span>•</span>
          <span>Neural Network Active</span>
          <span>•</span>
          <span>Quantum Processing Enabled</span>
        </div>
      </footer>
    </div>
  )
}
