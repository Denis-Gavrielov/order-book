import { TupleType } from "typescript"

type BookDepth = [
    [number, number],
    [number, number],
    [number, number],
    [number, number],
    [number, number],
]

export type OrderBookMessage = {
    timestamp: string,
    exchange: string,
    coin: string,
    bids: BookDepth,
    asks: BookDepth,
}

export type OrderBookState = {
    [key: string]: { // "{coin}|{exchange}" compound key
        lastTimestamp: string,
        currentData: {
            bids: BookDepth,
            asks: BookDepth,
        }
    }, 
}

export type ExchangeCoin = {
    exchange: string,
    coin: string
}