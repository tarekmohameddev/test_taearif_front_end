import type { Preview } from '@storybook/nextjs'
import React from 'react'
import { AuthProvider } from '../context/AuthContext'
import '../app/globals.css'

const preview: Preview = {
  decorators: [
    (Story) =>
      React.createElement(
        AuthProvider,
        null,
        React.createElement(Story, null)
      ),
  ],
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/",
        query: {},
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;