import useWebSocket from 'react-use-websocket';

const socketUrl = 'wss://mock.lo.tech:8443/ws/orderbook';

/**
 * A small abstraction in case we need to manage reconnections, ready state monitoring and other.
 *
 * @param onMessage Hook to subscribe to data updates
 * @returns Nothing - We could return the readyState to ensure that we alert about the health of
 *  the market data
 */
export default function useOrderBookWebSocket(
  onMessage: (event: MessageEvent<any>) => void
) {
  useWebSocket(socketUrl, { onMessage });
}
