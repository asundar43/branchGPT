import { useEffect, useState } from 'react';

interface BranchConnectionProps {
  messageId: string;
  targetBranchId: string;
  color: string;
  type?: 'message' | 'highlight';
  selectedText?: string;
}

export function BranchConnection({ 
  messageId, 
  targetBranchId, 
  color,
  type = 'message',
  selectedText
}: BranchConnectionProps) {
  const [path, setPath] = useState<string>('');

  useEffect(() => {
    const updatePath = () => {
      // Find the source message and its AI icon
      const sourceMessage = document.querySelector(`[data-message-id="${messageId}"]`);
      const sourceIcon = sourceMessage?.querySelector('.size-8'); // The AI icon container
      
      // Get the source message content - look inside the Markdown component
      const sourceContent = sourceMessage?.querySelector('.flex.flex-col.gap-4 > div')?.textContent?.trim();

      // Find the specific branch window and find the message with matching content
      const branchWindow = document.querySelector(`[data-branch-window="${targetBranchId}"]`);
      const branchMessages = Array.from(branchWindow?.querySelectorAll('[data-message-id]') || []);

      let matchingMessage;
      if (type === 'highlight' && selectedText) {
        // For highlight branches, find the message containing the selected text
        for (const msg of branchMessages) {
          const msgContent = msg.querySelector('.flex.flex-col.gap-4 > div')?.textContent;
          if (msgContent?.includes(selectedText)) {
            matchingMessage = msg;
            break;
          }
        }
      } else if (sourceContent && branchMessages.length > 0) {
        // For message branches, find the message that matches the source content
        for (const msg of branchMessages) {
          const msgContent = msg.querySelector('.flex.flex-col.gap-4 > div')?.textContent?.trim();
          if (msgContent === sourceContent) {
            matchingMessage = msg;
            break;
          }
        }
      }

      // If no matching message found, fall back to the first message
      const branchMessage = matchingMessage || branchWindow?.querySelector('[data-message-id]');
      const branchIcon = branchMessage?.querySelector('.size-8');

      if (!sourceIcon || !branchIcon) {
        return;
      }

      const sourceRect = sourceIcon.getBoundingClientRect();
      const branchRect = branchIcon.getBoundingClientRect();

      // Get the computed transform matrix of the branch window
      if (!branchWindow) return;
      
      const transform = window.getComputedStyle(branchWindow).transform;
      let adjustedX = branchRect.left;
      
      // If there's a transform, adjust the x position
      if (transform && transform !== 'none') {
        // Parse the matrix values
        const matrix = transform.match(/matrix.*\((.*)\)/)?.[1].split(', ').map(Number);
        if (matrix) {
          // The 4th value (index 3) in a 2D transform matrix is the X translation
          adjustedX = branchRect.left - (matrix[4] || 0);
        }
      }

      // Start from the center of the source AI icon
      const startX = sourceRect.left + sourceRect.width / 2;
      const startY = sourceRect.top + sourceRect.height / 2;

      // End at the center of the branch AI icon
      const endX = adjustedX + branchRect.width / 2;
      const endY = branchRect.top + branchRect.height / 2;

      // Find the message container for height calculation
      const sourceMessageRect = sourceMessage?.getBoundingClientRect();
      
      // Calculate drop amount to clear all content
      const textClearance = sourceMessageRect 
        ? (sourceMessageRect.bottom - startY) + 8
        : 40;

      const cornerRadius = 6;
      
      // Simple down-right-up path with rounded corners
      const path = `
        M ${startX} ${startY}
        L ${startX} ${startY + textClearance - cornerRadius}
        Q ${startX} ${startY + textClearance} ${startX + cornerRadius} ${startY + textClearance}
        L ${endX - cornerRadius} ${startY + textClearance}
        Q ${endX} ${startY + textClearance} ${endX} ${startY + textClearance - cornerRadius}
        L ${endX} ${endY}
      `;

      setPath(path);
    };

    // Update path initially and on window resize
    updatePath();
    window.addEventListener('resize', updatePath);
    
    // Update path more frequently during animations
    const interval = setInterval(updatePath, 16);

    // Update on scroll events for both main chat and branch chat
    const scrollHandler = () => {
      requestAnimationFrame(updatePath);
    };
    document.querySelectorAll('.overflow-y-scroll').forEach(element => {
      element.addEventListener('scroll', scrollHandler, { passive: true });
    });

    // Create a mutation observer to watch for new messages and highlights
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0 || 
            mutation.type === 'attributes' || 
            mutation.type === 'characterData') {
          requestAnimationFrame(updatePath);
        }
      }
    });

    // Start observing both main chat and branch chat containers
    const mainContainer = document.querySelector('.messages-container');
    const branchContainer = document.querySelector(`[data-branch-window="${targetBranchId}"] .overflow-y-scroll`);
    
    if (mainContainer) {
      observer.observe(mainContainer, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true
      });
    }
    
    if (branchContainer) {
      observer.observe(branchContainer, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true
      });
    }

    return () => {
      window.removeEventListener('resize', updatePath);
      document.querySelectorAll('.overflow-y-scroll').forEach(element => {
        element.removeEventListener('scroll', scrollHandler);
      });
      clearInterval(interval);
      observer.disconnect();
    };
  }, [messageId, targetBranchId, type, selectedText]);

  if (!path) return null;

  return (
    <svg
      className="fixed inset-0 pointer-events-none"
      style={{ 
        position: 'fixed', 
        width: '100vw', 
        height: '100vh',
        zIndex: 1 // Put it on same layer as messages
      }}
    >
      {/* Blurred background path */}
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="12"
        strokeOpacity="0.15"
        filter="blur(8px)"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Main line path */}
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeOpacity="0.8"
        strokeDasharray="4 4"
        filter="drop-shadow(0 2px 3px rgb(0 0 0 / 0.1))"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
} 