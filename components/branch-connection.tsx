import { useEffect, useState } from 'react';

interface BranchConnectionProps {
  messageId: string;
  targetBranchId: string;
  color: string;
}

export function BranchConnection({ messageId, targetBranchId, color }: BranchConnectionProps) {
  const [path, setPath] = useState<string>('');

  useEffect(() => {
    const updatePath = () => {
      // Find the source message and its AI icon
      const sourceMessage = document.querySelector(`[data-message-id="${messageId}"]`);
      const sourceIcon = sourceMessage?.querySelector('.size-8'); // The AI icon container
      
      // Get the source message content - look inside the Markdown component
      const sourceContent = sourceMessage?.querySelector('.flex.flex-col.gap-4 > div')?.textContent?.trim();
      console.log('Source content:', sourceContent);

      // Find the specific branch window and find the message with matching content
      const branchWindow = document.querySelector(`[data-branch-window="${targetBranchId}"]`);
      const branchMessages = Array.from(branchWindow?.querySelectorAll('[data-message-id]') || []);
      console.log('Found branch messages:', branchMessages.length);

      let matchingMessage;
      if (sourceContent && branchMessages.length > 0) {
        // Find the message in the branch that matches the source content
        for (const msg of branchMessages) {
          const msgContent = msg.querySelector('.flex.flex-col.gap-4 > div')?.textContent?.trim();
          console.log('Comparing:', msgContent);
          if (msgContent === sourceContent) {
            console.log('Found matching message!');
            matchingMessage = msg;
            break;
          }
        }
      }

      // If no matching message found, fall back to the first message
      const branchMessage = matchingMessage || branchWindow?.querySelector('[data-message-id]');
      const branchIcon = branchMessage?.querySelector('.size-8');

      if (!sourceIcon || !branchIcon) {
        console.log('Missing icons:', { sourceIcon: !!sourceIcon, branchIcon: !!branchIcon });
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
        ? (sourceMessageRect.bottom - startY) + 8 // Reduced padding below message from 20 to 8
        : 40; // Reduced default drop from 60 to 40

      const cornerRadius = 6; // Reduced corner radius from 12 to 6 for tighter corners
      
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
    const interval = setInterval(updatePath, 16); // ~60fps

    // Also update on scroll events for both main chat and branch chat
    const scrollHandler = () => {
      requestAnimationFrame(updatePath);
    };
    document.querySelectorAll('.overflow-y-scroll').forEach(element => {
      element.addEventListener('scroll', scrollHandler, { passive: true });
    });

    // Create a mutation observer to watch for new messages
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
          requestAnimationFrame(updatePath);
        }
      }
    });

    // Start observing the specific branch chat container for new messages
    const branchContainer = document.querySelector(`[data-branch-window="${targetBranchId}"] .overflow-y-scroll`);
    if (branchContainer) {
      observer.observe(branchContainer, {
        childList: true,
        subtree: true
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
  }, [messageId, targetBranchId]);

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