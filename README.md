# Organigram React

Organigram React is a React component library that provides a set of components for rendering organizational diagrams based on the [Organigram Protocol](https://github.com/organigram/protocol). It allows developers to easily integrate and visualize incorruptible organizations in their React applications.

## Installation

```bash
# npm:
npm install @organigram/react
# yarn:
yarn add @organigram/react
# pnpm: 
pnpm add @organigram/react
```

## Usage

Import the `Diagram` component and use it in your React application:

```jsx
import { Diagram } from '@organigram/react'
import { Organigram } from '@organigram/js'

function App() {
  return (
    <div>
      <h1>Organigram Diagram</h1>
      <Diagram organigram={new Organigram()}/>
    </div>
  )
}

export default App
```

Make sure to provide the [necessary configuration](https://github.com/organigram/js?tab=readme-ov-file#usage) for the `Organigram` instance, such as the Viem client configuration, to connect to the blockchain and fetch the required data for rendering the diagram.

The `Diagram` component will automatically fetch the necessary data from the blockchain and render the organizational structure based on the provided `Organigram` instance. You can customize the appearance and behavior of the diagram using additional props and styling as needed.


In addition to the `Diagram` component, the `@organigram/react` package also exports `useOrganigramClient`, which should be the main entrypoint for interacting with the Organigram Protocol in a React application.

```javascript
import { useOrganigramClient } from '@organigram/react'

function MyComponent() {
  const viemPublicClient = ... // Initialize your Viem public client
  const viemWalletClient = ... // Initialize your Viem wallet client
  const organigramClient = useOrganigramClient(viemPublicClient, viemWalletClient)

  // Use organigramClient to interact with the Organigram Protocol
  // For example, you can fetch organizational data, submit transactions, etc.

  return (
    <div>
      <button onClick={() => organigramClient.deploy(new Organigram('forProfit'))}>Deploy for-profit organization</button>
    </div>
  )
}
```


Refer to the [documentation](https://organigram.ai/en/docs/reference/react) for more advanced usage and customization options, and a complete list of available components and hooks.

## Contributing

We are looking for React developers and testers to keep this project secure and up-to-date. Please create issues in our Github page, fork and create Pull-Requests.
