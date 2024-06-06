# Order Book Web app

This is an market order book example web app subscribing to `wss://mock.lo.tech:8443/ws/orderbook` and receiving data in the format:
```json
{
  "timestamp": "float",
  "exchange": "string",
  "coin": "string",
  "bids": [
    ["float", "float"],
    ["float", "float"],
    ["float", "float"],
    ["float", "float"],
    ["float", "float"]
], "asks": [
    ["float", "float"],
    ["float", "float"],
    ["float", "float"],
    ["float", "float"],
    ["float", "float"]
]
}
```

[Screenshot of web app in use](example-screenshot.png)

## Design decisions

### Design decisions
At the top level of the application, we subscribe to the market data. There we do the following:
* Save new coins and exchanges which have not been seen yet.
* Return a "marketSubscriber" function which is used to subscribe to market updates
* Listen for new updates and notify all subscribers of the updated data for the specific coin and exchange.
* We do not do anything else with the market update. The rest is being thrown away. This is to keep the app as light as possible. Extensions are possible.

Only the order book component, which is subscribing to market updates, should be re-rendered on market updates. The FE footprint on the data side and update side is kept as light as possible.

We can add as many order books as we want. These will be added horizontally in the app. Other UX is possible.

I've decided to have the bid and the ask next to each other as this was how it is displayed in the Investopedia article. Personally, I would have them stacked on top of each other.

There is no validation of the payload, but I would add this in a real world application.

If the data would tick too fast, I'd either have the websocket aggregate data (if I controlled it) or have some aggregation in the app and flush the updates every 100ms or so. (This is what Bloomberg's pub/sub system is doing internally for market data to optimise for smooth UI updates).

### Libraries used
* `antd` for convenient and mature components and icons
* `react-use-websocket` to help with websocket connections in a react hook fashion
* `prettier` for automatic formatting
* `tailwind` for modern code styling

Otherwise this is using **functional React components** and **strict typescript** checks.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.
