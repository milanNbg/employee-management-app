import { useCallback, useEffect, useRef, useState } from 'react'

interface UseScreenRecorderResult {
  stream: MediaStream | null
  recordingUrl: string | null
  recordingFileName: string | null
  isSharing: boolean
  isRecording: boolean
  error: string | null
  errorSeverity: 'error' | 'warning' | null
  isScreenSharingSupported: boolean
  isRecordingSupported: boolean
  startSharing: () => Promise<void>
  stopSharing: () => void
  startRecording: () => void
  stopRecording: () => void
  clearRecording: () => void
}

const preferredMimeTypes = [
  'video/webm;codecs=vp9,opus',
  'video/webm;codecs=vp8,opus',
  'video/webm',
]

function getSupportedMimeType(): string | undefined {
  if (typeof MediaRecorder === 'undefined' || !MediaRecorder.isTypeSupported) {
    return undefined
  }

  return preferredMimeTypes.find((mimeType) =>
    MediaRecorder.isTypeSupported(mimeType),
  )
}

function createRecordingFileName(): string {
  const timestamp = new Date()
    .toISOString()
    .slice(0, 16)
    .replace('T', '-')
    .replace(':', '-')

  return `screen-recording-${timestamp}.webm`
}

interface RecorderMessage {
  message: string
  severity: 'error' | 'warning'
}

function getSharingError(error: unknown): RecorderMessage {
  if (
    error instanceof DOMException &&
    (error.name === 'NotAllowedError' || error.name === 'AbortError')
  ) {
    return {
      message:
        "Screen sharing wasn't started. You can try again when you're ready.",
      severity: 'warning',
    }
  }

  return {
    message: 'Unable to start screen sharing. Please try again.',
    severity: 'error',
  }
}

function stopStreamTracks(stream: MediaStream | null) {
  stream?.getTracks().forEach((track) => {
    track.stop()
  })
}

function hasLiveVideoTrack(stream: MediaStream | null): boolean {
  return stream
    ? stream.getVideoTracks().some((track) => track.readyState === 'live')
    : false
}

export function useScreenRecorder(): UseScreenRecorderResult {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null)
  const [recordingFileName, setRecordingFileName] = useState<string | null>(
    null,
  )
  const [isRecording, setIsRecording] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errorSeverity, setErrorSeverity] = useState<
    'error' | 'warning' | null
  >(null)

  const streamRef = useRef<MediaStream | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordingChunksRef = useRef<Blob[]>([])
  const recordingUrlRef = useRef<string | null>(null)
  const isMountedRef = useRef(true)

  const isScreenSharingSupported = Boolean(
    navigator.mediaDevices?.getDisplayMedia,
  )
  const isRecordingSupported = typeof MediaRecorder !== 'undefined'

  const revokeRecordingUrl = useCallback(() => {
    if (recordingUrlRef.current) {
      URL.revokeObjectURL(recordingUrlRef.current)
      recordingUrlRef.current = null
    }
  }, [])

  const clearRecording = useCallback(() => {
    revokeRecordingUrl()
    setRecordingUrl(null)
    setRecordingFileName(null)
  }, [revokeRecordingUrl])

  const stopRecording = useCallback(() => {
    const mediaRecorder = mediaRecorderRef.current

    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop()
    }
  }, [])

  const stopSharing = useCallback(() => {
    stopRecording()
    stopStreamTracks(streamRef.current)
    streamRef.current = null

    if (isMountedRef.current) {
      setStream(null)
      setIsRecording(false)
    }
  }, [stopRecording])

  const startSharing = useCallback(async () => {
    if (!isScreenSharingSupported) {
      setError('Screen sharing is not supported in this browser.')
      setErrorSeverity('error')
      return
    }

    stopSharing()
    setError(null)
    setErrorSeverity(null)

    try {
      const displayStream =
        await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        })

      const handleTrackEnded = () => {
        stopSharing()
      }

      displayStream.getVideoTracks().forEach((track) => {
        track.addEventListener('ended', handleTrackEnded, {
          once: true,
        })
      })

      streamRef.current = displayStream

      if (isMountedRef.current) {
        setStream(displayStream)
      }
    } catch (sharingError) {
      if (isMountedRef.current) {
        const nextError = getSharingError(sharingError)
        setError(nextError.message)
        setErrorSeverity(nextError.severity)
      }
    }
  }, [isScreenSharingSupported, stopSharing])

  const startRecording = useCallback(() => {
    if (!isRecordingSupported) {
      setError('Screen recording is not supported in this browser.')
      setErrorSeverity('error')
      return
    }

    if (!streamRef.current) {
      setError('Start screen sharing before recording.')
      setErrorSeverity('warning')
      return
    }

    const currentRecorder = mediaRecorderRef.current

    if (currentRecorder && currentRecorder.state !== 'inactive') {
      return
    }

    clearRecording()
    recordingChunksRef.current = []
    setError(null)
    setErrorSeverity(null)

    try {
      const mimeType = getSupportedMimeType()
      const mediaRecorder = mimeType
        ? new MediaRecorder(streamRef.current, { mimeType })
        : new MediaRecorder(streamRef.current)

      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordingChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onerror = () => {
        if (isMountedRef.current) {
          setError('Recording failed. Please try again.')
          setErrorSeverity('error')
          setIsRecording(false)
        }
      }

      mediaRecorder.onstop = () => {
        if (!isMountedRef.current) {
          recordingChunksRef.current = []
          return
        }

        setIsRecording(false)

        if (recordingChunksRef.current.length === 0) {
          return
        }

        const blob = new Blob(recordingChunksRef.current, {
          type: mediaRecorder.mimeType || 'video/webm',
        })
        recordingChunksRef.current = []

        revokeRecordingUrl()

        const nextRecordingUrl = URL.createObjectURL(blob)
        const nextFileName = createRecordingFileName()

        recordingUrlRef.current = nextRecordingUrl
        setRecordingUrl(nextRecordingUrl)
        setRecordingFileName(nextFileName)
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch {
      if (isMountedRef.current) {
        setError('Unable to start recording. Please try again.')
        setErrorSeverity('error')
        setIsRecording(false)
      }
    }
  }, [clearRecording, isRecordingSupported, revokeRecordingUrl])

  useEffect(() => {
    isMountedRef.current = true

    return () => {
      isMountedRef.current = false
      const mediaRecorder = mediaRecorderRef.current

      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop()
      }

      stopStreamTracks(streamRef.current)
      revokeRecordingUrl()
    }
  }, [revokeRecordingUrl])

  return {
    stream,
    recordingUrl,
    recordingFileName,
    isSharing: hasLiveVideoTrack(stream),
    isRecording,
    error,
    errorSeverity,
    isScreenSharingSupported,
    isRecordingSupported,
    startSharing,
    stopSharing,
    startRecording,
    stopRecording,
    clearRecording,
  }
}
