// SCORM Bridge utility for handling cross-origin communication
export const createScormBridge = () => {
  // Create a script element to inject into the iframe
  const bridgeScript = `
    (function() {
      'use strict';
      
      // SCORM Bridge for cross-origin communication
      window.scormBridge = {
        // Send message to parent window
        sendMessage: function(type, data) {
          try {
            window.parent.postMessage({
              type: type,
              data: data,
              source: 'scorm-content'
            }, '*');
          } catch (error) {
            console.warn('Failed to send message to parent:', error);
          }
        },
        
        // Get content height and send to parent
        sendHeight: function() {
          try {
            const height = Math.max(
              document.body.scrollHeight,
              document.body.offsetHeight,
              document.documentElement.clientHeight,
              document.documentElement.scrollHeight,
              document.documentElement.offsetHeight
            );
            this.sendMessage('resize', { height: height });
          } catch (error) {
            console.warn('Failed to send height:', error);
          }
        },
        
        // Handle SCORM API calls
        handleScormCall: function(functionName, parameters) {
          try {
            this.sendMessage('scorm-call', {
              function: functionName,
              parameters: parameters
            });
          } catch (error) {
            console.warn('Failed to handle SCORM call:', error);
          }
        },
        
        // Initialize the bridge
        init: function() {
          // Send initial height
          setTimeout(() => this.sendHeight(), 100);
          
          // Listen for messages from parent
          window.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'getHeight') {
              this.sendHeight();
            }
          });
          
          // Monitor for height changes
          const resizeObserver = new ResizeObserver(() => {
            this.sendHeight();
          });
          
          if (document.body) {
            resizeObserver.observe(document.body);
          }
          
          // Override SCORM API calls if needed
          if (window.API) {
            const originalCommitData = window.API.CommitData;
            if (originalCommitData) {
              window.API.CommitData = function() {
                try {
                  // Call original function
                  const result = originalCommitData.apply(this, arguments);
                  // Send message to parent
                  window.scormBridge.handleScormCall('CommitData', arguments);
                  return result;
                } catch (error) {
                  console.warn('Error in CommitData override:', error);
                  return originalCommitData.apply(this, arguments);
                }
              };
            }
          }
          
          console.log('SCORM Bridge initialized');
        }
      };
      
      // Initialize when DOM is ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          window.scormBridge.init();
        });
      } else {
        window.scormBridge.init();
      }
    })();
  `;
  
  return bridgeScript;
};

// Function to inject the bridge script into an iframe
export const injectScormBridge = (iframe) => {
  if (!iframe || !iframe.contentDocument) {
    return;
  }
  
  try {
    const script = iframe.contentDocument.createElement('script');
    script.textContent = createScormBridge();
    iframe.contentDocument.head.appendChild(script);
  } catch (error) {
    console.warn('Could not inject SCORM bridge:', error);
  }
}; 