import Handyman from '@mui/icons-material/Handyman';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools';
import React from 'react';
import { Provider } from 'react-redux';

import { handleRoot } from 'src/utilities/rootManager';

import './dev-tools.css';
import { EnvironmentToggleTool } from './EnvironmentToggleTool';
import { FeatureFlagTool } from './FeatureFlagTool';
import { ServiceWorkerTool } from './ServiceWorkerTool';
import { isMSWEnabled } from './utils';

import type { QueryClient } from '@tanstack/react-query';
import type { ApplicationStore } from 'src/store';

export type DevToolsView = 'mocks' | 'react-query';

const reactQueryDevtoolsStyle = {
  border: '1px solid rgba(255, 255, 255, 0.25)',
  height: '100%',
  width: '100%',
};

function install(store: ApplicationStore, queryClient: QueryClient) {
  function DevTools() {
    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    const [view, setView] = React.useState<DevToolsView>('mocks');

    const handleOpenReactQuery = () => {
      setView('react-query');
    };

    const handleOpenMocks = () => {
      setView('mocks');
    };

    const handleGoToPreferences = () => {
      window.location.assign('/profile/settings?preferenceEditor=true');
    };

    return (
      <div
        className={`dev-tools ${isMSWEnabled && 'dev-tools--msw'} ${
          isOpen && 'dev-tools--open'
        }`}
      >
        <div className="dev-tools__toggle">
          <button onClick={() => setIsOpen(!isOpen)}>
            <Handyman />
          </button>
        </div>
        <div className="dev-tools__body">
          <div className="dev-tools__content">
            <div className="dev-tools__status-bar">
              <div>
                <EnvironmentToggleTool />
              </div>
              <div className="dev-tools__segmented-button">
                <button
                  className={`toggle-button ${
                    view === 'mocks' && 'toggle-button--on'
                  }`}
                  onClick={handleOpenMocks}
                >
                  Mocks
                </button>
                <button
                  className={`toggle-button ${
                    view === 'react-query' && 'toggle-button--on'
                  }`}
                  onClick={handleOpenReactQuery}
                >
                  React Query
                </button>
              </div>
              <div>
                <button onClick={handleGoToPreferences}>
                  Go to Preferences
                </button>
              </div>
            </div>
            <div className="dev-tools__main">
              {view === 'mocks' && (
                <>
                  <div className="dev-tools__main__column">
                    <FeatureFlagTool />
                  </div>
                  <div className="dev-tools__main__column">
                    <ServiceWorkerTool />
                  </div>
                </>
              )}
              {view === 'react-query' && (
                <QueryClientProvider client={queryClient}>
                  <ReactQueryDevtoolsPanel
                    onDragStart={() => {}}
                    setIsOpen={() => {}}
                    style={reactQueryDevtoolsStyle}
                  />
                </QueryClientProvider>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const devToolsRoot =
    document.getElementById('dev-tools-root') ||
    (() => {
      const newRoot = document.createElement('div');
      newRoot.id = 'dev-tools-root';
      document.body.appendChild(newRoot);
      return newRoot;
    })();

  const root = handleRoot(devToolsRoot);
  root.render(
    <Provider store={store}>
      <DevTools />
    </Provider>
  );
}

export { install };
