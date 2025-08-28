"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Activity, 
  AlertCircle, 
  CheckCircle, 
  Info, 
  RefreshCw, 
  Trash2,
  Filter,
  Download,
  Clock
} from 'lucide-react'

interface LogEntry {
  id: string
  businessId: string
  waId?: string
  level: 'INFO' | 'WARN' | 'ERROR'
  message: string
  meta?: Record<string, any>
  timestamp: string
}

interface LogStats {
  total: number
  info: number
  warn: number
  error: number
}

export default function BotLogs({ businessId }: { businessId: string }) {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [stats, setStats] = useState<LogStats>({ total: 0, info: 0, warn: 0, error: 0 })
  const [isLoading, setIsLoading] = useState(false)
  const [selectedLevel, setSelectedLevel] = useState<string>('all')
  const [limit, setLimit] = useState(50)
  const [autoRefresh, setAutoRefresh] = useState(true)

  useEffect(() => {
    if (businessId) {
      fetchLogs()
    }
  }, [businessId, selectedLevel, limit])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (autoRefresh) {
      interval = setInterval(fetchLogs, 5000) // Refresh every 5 seconds
    }
    return () => clearInterval(interval)
  }, [autoRefresh, businessId])

  const fetchLogs = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        businessId,
        limit: limit.toString()
      })
      
      if (selectedLevel !== 'all') {
        params.append('level', selectedLevel)
      }

      const response = await fetch(`/api/logs?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setLogs(data.logs)
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching logs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const clearLogs = async () => {
    if (!confirm('¿Estás seguro de que quieres borrar todos los logs?')) return
    
    try {
      const response = await fetch('/api/logs', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessId })
      })
      
      const data = await response.json()
      if (data.success) {
        setLogs([])
        setStats({ total: 0, info: 0, warn: 0, error: 0 })
      }
    } catch (error) {
      console.error('Error clearing logs:', error)
    }
  }

  const downloadLogs = () => {
    const csvContent = [
      ['Timestamp', 'Level', 'Message', 'WA ID', 'Metadata'],
      ...logs.map(log => [
        log.timestamp,
        log.level,
        log.message,
        log.waId || '',
        log.meta ? JSON.stringify(log.meta) : ''
      ])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bot-logs-${businessId}-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'INFO':
        return <Info className="w-4 h-4 text-blue-500" />
      case 'WARN':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      case 'ERROR':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <Info className="w-4 h-4 text-gray-500" />
    }
  }

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'INFO':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">INFO</Badge>
      case 'WARN':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">WARN</Badge>
      case 'ERROR':
        return <Badge variant="destructive">ERROR</Badge>
      default:
        return <Badge variant="outline">{level}</Badge>
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString('es-AR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Logs del Chatbot
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Monitorea la actividad de tu chatbot en tiempo real
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={autoRefresh ? 'bg-green-50 border-green-200 text-green-700' : ''}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
            {autoRefresh ? 'Auto' : 'Manual'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={fetchLogs}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">Total</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">Info</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{stats.info}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <span className="text-sm font-medium text-gray-600">Warnings</span>
            </div>
            <p className="text-2xl font-bold text-yellow-600">{stats.warn}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-sm font-medium text-gray-600">Errors</span>
            </div>
            <p className="text-2xl font-bold text-red-600">{stats.error}</p>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filtrar por nivel:</span>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="INFO">Info</SelectItem>
                  <SelectItem value="WARN">Warnings</SelectItem>
                  <SelectItem value="ERROR">Errors</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Mostrar:</span>
              <Select value={limit.toString()} onValueChange={(value) => setLimit(parseInt(value))}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                  <SelectItem value="200">200</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1" />
            
            <Button
              variant="outline"
              size="sm"
              onClick={downloadLogs}
              disabled={logs.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar CSV
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={clearLogs}
              disabled={logs.length === 0}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Limpiar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
          <CardDescription>
            Últimos {logs.length} logs del chatbot
          </CardDescription>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No hay logs disponibles</p>
              <p className="text-sm">Los logs aparecerán aquí cuando el chatbot esté activo</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-shrink-0 mt-1">
                    {getLevelIcon(log.level)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getLevelBadge(log.level)}
                      {log.waId && (
                        <Badge variant="outline" className="text-xs">
                          {log.waId}
                        </Badge>
                      )}
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTimestamp(log.timestamp)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-900 mb-2">{log.message}</p>
                    
                    {log.meta && Object.keys(log.meta).length > 0 && (
                      <details className="text-xs">
                        <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                          Ver detalles
                        </summary>
                        <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                          {JSON.stringify(log.meta, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Help Information */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">Información sobre los Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-blue-700 space-y-2 text-sm">
            <p><strong>INFO:</strong> Mensajes informativos sobre el funcionamiento normal del chatbot</p>
            <p><strong>WARN:</strong> Advertencias que no impiden el funcionamiento pero requieren atención</p>
            <p><strong>ERROR:</strong> Errores que impiden el funcionamiento correcto del chatbot</p>
            <p className="mt-3">
              Los logs se actualizan automáticamente cada 5 segundos cuando el auto-refresh está activado.
              Puedes exportar los logs en formato CSV para análisis externos.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}





