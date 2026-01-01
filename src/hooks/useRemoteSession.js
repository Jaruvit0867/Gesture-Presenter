import { useState, useEffect, useCallback, useRef } from 'react';
import * as Ably from 'ably';

// TODO: Implement Token Authentication for production
// Currently using API key directly for development
// See: https://ably.com/docs/auth/token

const generateSessionId = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const useRemoteSession = ({ onCommand, currentPage, totalPages }) => {
  const [sessionId, setSessionId] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [remoteConnected, setRemoteConnected] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  const ablyRef = useRef(null);
  const channelRef = useRef(null);

  // Use refs to avoid stale closures in callbacks
  const onCommandRef = useRef(onCommand);
  const currentPageRef = useRef(currentPage);
  const totalPagesRef = useRef(totalPages);

  // Keep refs updated
  useEffect(() => {
    onCommandRef.current = onCommand;
  }, [onCommand]);

  useEffect(() => {
    currentPageRef.current = currentPage;
    totalPagesRef.current = totalPages;
  }, [currentPage, totalPages]);

  const initializeAbly = useCallback(async () => {
    const apiKey = import.meta.env.VITE_ABLY_API_KEY;
    if (!apiKey) {
      console.error('VITE_ABLY_API_KEY is not set');
      return null;
    }

    try {
      const ably = new Ably.Realtime({
        key: apiKey,
        clientId: `presenter-${Date.now()}`,
      });

      return new Promise((resolve, reject) => {
        ably.connection.on('connected', () => {
          setIsConnected(true);
          resolve(ably);
        });
        ably.connection.on('failed', (err) => {
          console.error('Ably connection failed:', err);
          setIsConnected(false);
          reject(err);
        });
        ably.connection.on('disconnected', () => setIsConnected(false));
      });
    } catch (error) {
      console.error('Failed to initialize Ably:', error);
      return null;
    }
  }, []);

  const startSession = useCallback(async () => {
    if (ablyRef.current) {
      const newSessionId = generateSessionId();
      setSessionId(newSessionId);
      return newSessionId;
    }

    try {
      const ably = await initializeAbly();
      if (!ably) return null;

      ablyRef.current = ably;
      const newSessionId = generateSessionId();
      setSessionId(newSessionId);
      setIsEnabled(true);
      return newSessionId;
    } catch (error) {
      console.error('Failed to start session:', error);
      return null;
    }
  }, [initializeAbly]);

  const stopSession = useCallback(() => {
    if (channelRef.current) {
      channelRef.current.presence.leave();
      channelRef.current.unsubscribe();
      channelRef.current = null;
    }
    if (ablyRef.current) {
      ablyRef.current.close();
      ablyRef.current = null;
    }
    setSessionId(null);
    setIsConnected(false);
    setRemoteConnected(false);
    setIsEnabled(false);
  }, []);

  const toggleRemoteMode = useCallback(async () => {
    if (isEnabled) {
      stopSession();
    } else {
      await startSession();
    }
  }, [isEnabled, startSession, stopSession]);

  useEffect(() => {
    if (!sessionId || !ablyRef.current) return;

    const channelName = `presenter-${sessionId}`;
    console.log('[Presenter] Setting up channel:', channelName);
    const channel = ablyRef.current.channels.get(channelName);
    channelRef.current = channel;

    // Use ref to always get latest callback
    channel.subscribe('command', (message) => {
      console.log('[Presenter] Received command:', message.data);
      const { action } = message.data;
      if (onCommandRef.current) onCommandRef.current(action);
    });

    // Subscribe to presence events first
    channel.presence.subscribe('enter', (member) => {
      console.log('[Presenter] Member entered:', member.clientId, member.data);
      if (member.data?.role === 'remote') {
        console.log('[Presenter] Remote connected! Sending sync...');
        setRemoteConnected(true);
        // Use refs to get latest values
        channel.publish('sync', {
          currentPage: currentPageRef.current,
          totalPages: totalPagesRef.current
        });
      }
    });

    channel.presence.subscribe('leave', (member) => {
      console.log('[Presenter] Member left:', member.clientId, member.data);
      if (member.data?.role === 'remote') setRemoteConnected(false);
    });

    // Then enter presence and check existing members
    channel.presence.enter({ role: 'presenter' }, (err) => {
      if (err) {
        console.error('[Presenter] Failed to enter presence:', err);
      } else {
        console.log('[Presenter] Entered presence as presenter');
        // Check existing members AFTER we've entered
        channel.presence.get((err, members) => {
          console.log('[Presenter] Current presence members:', err, members);
          if (!err && members) {
            const hasRemote = members.some(m => m.data?.role === 'remote');
            console.log('[Presenter] Has remote:', hasRemote);
            if (hasRemote) {
              setRemoteConnected(true);
              // Send sync to any existing remotes
              channel.publish('sync', {
                currentPage: currentPageRef.current,
                totalPages: totalPagesRef.current
              });
            }
          }
        });
      }
    });

    return () => {
      console.log('[Presenter] Cleaning up channel');
      channel.unsubscribe();
      channel.presence.leave();
    };
  }, [sessionId]); // Remove onCommand from dependencies - use ref instead

  useEffect(() => {
    if (!channelRef.current || !remoteConnected) return;
    channelRef.current.publish('sync', { currentPage, totalPages });
  }, [currentPage, totalPages, remoteConnected]);

  useEffect(() => {
    return () => {
      if (ablyRef.current) ablyRef.current.close();
    };
  }, []);

  return {
    sessionId,
    isConnected,
    remoteConnected,
    isEnabled,
    startSession,
    stopSession,
    toggleRemoteMode,
  };
};

export const useRemoteController = (sessionId) => {
  const [isConnected, setIsConnected] = useState(false);
  const [presenterConnected, setPresenterConnected] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [connectionError, setConnectionError] = useState(null);

  const ablyRef = useRef(null);
  const channelRef = useRef(null);
  const presenterConnectedRef = useRef(presenterConnected);

  // Keep ref updated
  useEffect(() => {
    presenterConnectedRef.current = presenterConnected;
  }, [presenterConnected]);

  const sendCommand = useCallback((action) => {
    console.log('sendCommand called:', action, 'channel:', !!channelRef.current, 'presenter:', presenterConnectedRef.current);
    if (!channelRef.current) {
      console.log('No channel');
      return;
    }
    // Send command regardless of presenter status - let the channel handle it
    channelRef.current.publish('command', { action });
  }, []);

  useEffect(() => {
    if (!sessionId) return;

    const apiKey = import.meta.env.VITE_ABLY_API_KEY;
    if (!apiKey) {
      setConnectionError('API key not configured');
      return;
    }

    const ably = new Ably.Realtime({
      key: apiKey,
      clientId: `remote-${Date.now()}`,
    });
    ablyRef.current = ably;

    ably.connection.on('connected', () => {
      console.log('[Remote] Ably connected successfully');
      setIsConnected(true);
      setConnectionError(null);

      const channelName = `presenter-${sessionId}`;
      console.log('[Remote] Joining channel:', channelName);
      const channel = ably.channels.get(channelName);
      channelRef.current = channel;

      // Wrap subscription in try-catch
      try {
        channel.subscribe('sync', (message) => {
          console.log('[Remote] Received sync:', message.data);
          setCurrentPage(message.data.currentPage);
          setTotalPages(message.data.totalPages);
          // If we receive sync, presenter is definitely connected
          setPresenterConnected(true);
        });

        // Subscribe to presence events
        channel.presence.subscribe('enter', (member) => {
          console.log('[Remote] Member entered:', member.clientId, member.data);
          if (member.data?.role === 'presenter') {
            console.log('[Remote] Presenter detected via presence enter!');
            setPresenterConnected(true);
          }
        });

        channel.presence.subscribe('leave', (member) => {
          console.log('[Remote] Member left:', member.clientId, member.data);
          if (member.data?.role === 'presenter') {
            console.log('[Remote] Presenter left');
            setPresenterConnected(false);
          }
        });

        // Enter presence
        channel.presence.enter({ role: 'remote' }, (err) => {
          if (err) {
            console.warn('[Remote] Failed to enter presence (non-critical):', err);
          } else {
            console.log('[Remote] Entered presence as remote');
            // Check for existing presenter
            channel.presence.get((err, members) => {
              if (members) {
                const hasPresenter = members.some(m => m.data?.role === 'presenter');
                console.log('[Remote] Initial presence check. Has presenter:', hasPresenter);
                if (hasPresenter) setPresenterConnected(true);
              }
            });
          }
        });

      } catch (subError) {
        console.error('[Remote] Subscription error:', subError);
      }
    });

    ably.connection.on('failed', (err) => {
      console.error('[Remote] Connection failed:', err);
      setIsConnected(false);
      setConnectionError('Connection to server failed. Please try again.');
    });

    ably.connection.on('disconnected', () => {
      console.warn('[Remote] Disconnected');
      setIsConnected(false);
    });

    return () => {
      if (channelRef.current) {
        // Safe cleanup
        try {
          channelRef.current.presence.leave();
          channelRef.current.unsubscribe();
        } catch (e) {
          console.warn('[Remote] Cleanup error:', e);
        }
      }
      if (ablyRef.current) ablyRef.current.close();
    };
  }, [sessionId]);

  return {
    isConnected,
    presenterConnected,
    currentPage,
    totalPages,
    sendCommand,
    connectionError,
  };
};

export default useRemoteSession;
