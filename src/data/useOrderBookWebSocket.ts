import React, { useState, useCallback, useEffect, useMemo } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { OrderBookMessage } from './types';

// const socketUrl = 'ws://localhost:8765';
const socketUrl = 'wss://mock.lo.tech:8443/ws/orderbook';
export default function useOrderBookWebSocket(onMessage: (event: MessageEvent<any>) => void) { // maybe useOrderBookUpdates
    const { readyState } = useWebSocket(
        socketUrl, {onMessage}
); // TODO: probably want to have reconnection logic.
    // so on close basically try to reconnect with some backoff and jitter.

    // const connectionStatus = useMemo(() => ({
    //     [ReadyState.CONNECTING]: 'Connecting',
    //     [ReadyState.OPEN]: 'Open',
    //     [ReadyState.CLOSING]: 'Closing',
    //     [ReadyState.CLOSED]: 'Closed',
    //     [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    // }[readyState]), [readyState]);

    // const orderBookData = useMemo((): {lastMessage: OrderBookMessage | null, readyState: ReadyState} => ({
    //     lastMessage: lastMessage ? lastMessage.data : null,
    //     readyState
    // }), [readyState, lastMessage]);

    return readyState;
}