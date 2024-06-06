import React, { useState, useCallback, useEffect, useMemo } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

const socketUrl = 'ws://localhost:8765';
export default function useOrderBookData() {
    const { lastMessage, readyState } = useWebSocket(socketUrl); // TODO: probably want to have reconnection logic.

    const connectionStatus = useMemo(() => ({
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState]), [readyState]);

    const orderBookData = useMemo(() => ({
        lastMessage: lastMessage ? lastMessage.data : null,
        connectionStatus
    }), [connectionStatus, lastMessage]);

    return orderBookData;
}