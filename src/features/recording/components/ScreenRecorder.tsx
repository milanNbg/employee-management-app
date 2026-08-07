import { useEffect, useRef } from 'react'
import { useScreenRecorder } from '../hooks/useScreenRecorder'

function getRecordingStatus(
  isSharing: boolean,
  isRecording: boolean,
): 'Ready' | 'Sharing' | 'Recording' {
  if (isRecording) {
    return 'Recording'
  }

  if (isSharing) {
    return 'Sharing'
  }

  return 'Ready'
}

export function ScreenRecorder() {
  const livePreviewRef = useRef<HTMLVideoElement>(null)
  const {
    stream,
    recordingUrl,
    recordingFileName,
    isSharing,
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
  } = useScreenRecorder()
  const recordingStatus = getRecordingStatus(isSharing, isRecording)

  useEffect(() => {
    const livePreviewElement = livePreviewRef.current

    if (livePreviewElement) {
      livePreviewElement.srcObject = stream
    }

    return () => {
      if (livePreviewElement) {
        livePreviewElement.srcObject = null
      }
    }
  }, [stream])

  if (!isScreenSharingSupported || !isRecordingSupported) {
    return (
      <section className="recording-card" aria-labelledby="unsupported-title">
        <p className="recording-eyebrow">Browser support</p>
        <h2 id="unsupported-title">Screen recording is not supported</h2>
        <p>
          This browser does not provide the screen sharing and recording APIs
          required for local recordings.
        </p>
      </section>
    )
  }

  return (
    <div className="recording-layout">
      <section className="recording-card" aria-labelledby="sharing-title">
        <div className="recording-card-header">
          <div>
            <p className="recording-eyebrow">Screen sharing</p>
            <h2 id="sharing-title">Share your screen</h2>
          </div>
          <p
            className={`recording-status recording-status-${recordingStatus.toLowerCase()}`}
            role="status"
            aria-live="polite"
          >
            {isRecording && (
              <span className="recording-status-dot" aria-hidden="true" />
            )}
            {recordingStatus}
          </p>
        </div>

        {error && (
          <p
            className={`app-state ${
              errorSeverity === 'warning'
                ? 'app-state-warning'
                : 'app-state-error'
            }`}
            role={errorSeverity === 'warning' ? 'status' : 'alert'}
            aria-live="polite"
          >
            {error}
          </p>
        )}

        <div className="recording-actions">
          <button
            className="app-primary-button"
            type="button"
            disabled={isSharing}
            onClick={() => {
              void startSharing()
            }}
          >
            Start screen sharing
          </button>
          <button
            className="app-secondary-button"
            type="button"
            disabled={!isSharing || isRecording}
            onClick={stopSharing}
          >
            Stop sharing
          </button>
        </div>

        <div className="recording-preview">
          {isSharing ? (
            <video
              ref={livePreviewRef}
              autoPlay
              muted
              playsInline
              aria-label="Live shared screen preview"
            />
          ) : (
            <p>No active screen share.</p>
          )}
        </div>
      </section>

      <section className="recording-card" aria-labelledby="recording-title">
        <div className="recording-card-header">
          <div>
            <p className="recording-eyebrow">Recording</p>
            <h2 id="recording-title">Capture a walkthrough</h2>
          </div>
        </div>

        <div className="recording-actions">
          <button
            className="app-primary-button"
            type="button"
            disabled={!isSharing || isRecording}
            onClick={startRecording}
          >
            Start recording
          </button>
          <button
            className="app-secondary-button"
            type="button"
            disabled={!isRecording}
            onClick={stopRecording}
          >
            Stop recording
          </button>
        </div>

        {recordingUrl ? (
          <div className="recording-result">
            <video
              src={recordingUrl}
              controls
              aria-label="Recorded screen walkthrough preview"
            />
            <div className="recording-actions">
              <a
                className="app-primary-button app-download-link"
                href={recordingUrl}
                download={recordingFileName ?? 'screen-recording.webm'}
              >
                Download recording
              </a>
              <button
                className="app-secondary-button"
                type="button"
                onClick={clearRecording}
              >
                Clear recording
              </button>
            </div>
          </div>
        ) : (
          <p className="recording-empty">
            Recorded videos will appear here after you stop recording.
          </p>
        )}
      </section>
    </div>
  )
}
