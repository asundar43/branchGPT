import { ChatRequestOptions, Message } from 'ai';
import { PreviewMessage, ThinkingMessage } from './message';
import { useScrollToBottom } from './use-scroll-to-bottom';
import { Overview } from './overview';
import { memo, useEffect, useState } from 'react';
import { Vote } from '@/lib/db/schema';
import equal from 'fast-deep-equal';
import { cn } from '@/lib/utils';
import { useBranchedChat } from '@/hooks/use-branched-chat';
import { toast } from 'sonner';
import { BranchIcon } from './icons';
import { Button } from './ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

interface MessagesProps {
  chatId: string;
  messages: Array<Message>;
  isLoading: boolean;
  votes: Array<Vote> | undefined;
  setMessages: (
    messages: Message[] | ((messages: Message[]) => Message[]),
  ) => void;
  reload: (
    chatRequestOptions?: ChatRequestOptions,
  ) => Promise<string | null | undefined>;
  isReadonly: boolean;
  isArtifactVisible: boolean;
  showRecommendations?: boolean;
  branchedFromMessageId?: string;
  nextBranchColor?: string;
  highlightInfo?: {
    messageId: string;
    selectedText: string;
    color: string;
  };
}

function PureMessages({
  chatId,
  messages,
  isLoading,
  votes,
  setMessages,
  reload,
  isReadonly,
  isArtifactVisible,
  showRecommendations = true,
  branchedFromMessageId,
  nextBranchColor,
  highlightInfo,
}: MessagesProps) {
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();
  const { addBranch } = useBranchedChat();
  const [selectionInfo, setSelectionInfo] = useState<{
    messageId: string;
    selectedText: string;
    position: { x: number; y: number };
    branchColor: string;
  } | null>(null);

  // Update selection color when nextBranchColor changes
  useEffect(() => {
    if (!nextBranchColor) return;

    // Create a style element for our custom selection color
    const style = document.createElement('style');
    style.textContent = `
      .messages-container ::selection {
        background-color: ${nextBranchColor}40 !important;
        color: inherit !important;
      }
      .messages-container ::-moz-selection {
        background-color: ${nextBranchColor}40 !important;
        color: inherit !important;
      }
      .selection-outline {
        position: fixed;
        pointer-events: none;
        border: 2px solid ${nextBranchColor};
        border-radius: 4px;
        z-index: 40;
        box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
      }
      .highlight-branch-${nextBranchColor.substring(1)} {
        position: relative;
        background-color: ${nextBranchColor}40;
        border: 2px solid ${nextBranchColor};
        border-radius: 4px;
      }
      .highlight-branch-${nextBranchColor.substring(1)}::before {
        content: '';
        position: absolute;
        inset: -4px;
        background-color: ${nextBranchColor};
        opacity: 0.15;
        border-radius: 6px;
        filter: blur(8px);
        z-index: -1;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
      // Clean up any existing outlines
      document.querySelectorAll('.selection-outline').forEach(el => el.remove());
    };
  }, [nextBranchColor]);

  useEffect(() => {
    const handleSelection = () => {
      // Clean up any existing outlines
      document.querySelectorAll('.selection-outline').forEach(el => el.remove());

      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || !nextBranchColor) {
        setSelectionInfo(null);
        return;
      }

      const range = selection.getRangeAt(0);
      const messageElement = (range.commonAncestorContainer.nodeType === Node.TEXT_NODE 
        ? range.commonAncestorContainer.parentElement 
        : range.commonAncestorContainer as Element
      )?.closest('[data-message-id]');

      if (!messageElement) {
        setSelectionInfo(null);
        return;
      }

      const messageId = messageElement.getAttribute('data-message-id');
      if (!messageId) {
        setSelectionInfo(null);
        return;
      }

      const selectedText = selection.toString().trim();
      if (!selectedText) {
        setSelectionInfo(null);
        return;
      }

      // Create outline elements for each selection rect
      const rects = range.getClientRects();
      Array.from(rects).forEach(rect => {
        const outline = document.createElement('div');
        outline.className = 'selection-outline';
        outline.style.left = `${rect.left - 2}px`;
        outline.style.top = `${rect.top - 2}px`;
        outline.style.width = `${rect.width + 4}px`;
        outline.style.height = `${rect.height + 4}px`;
        document.body.appendChild(outline);
      });

      // Position the button above the topmost selection
      const topRect = Array.from(rects).reduce((min, rect) => 
        rect.top < min.top ? rect : min
      , Array.from(rects)[0]);

      setSelectionInfo({
        messageId,
        selectedText,
        position: {
          x: topRect.left + (topRect.width / 2),
          y: topRect.top - 40,
        },
        branchColor: nextBranchColor
      });
    };

    // Update outline position on scroll
    const handleScroll = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) return;

      const range = selection.getRangeAt(0);
      document.querySelectorAll('.selection-outline').forEach(el => el.remove());
      
      // Recreate outlines at new positions
      const rects = range.getClientRects();
      Array.from(rects).forEach(rect => {
        const outline = document.createElement('div');
        outline.className = 'selection-outline';
        outline.style.left = `${rect.left - 2}px`;
        outline.style.top = `${rect.top - 2}px`;
        outline.style.width = `${rect.width + 4}px`;
        outline.style.height = `${rect.height + 4}px`;
        document.body.appendChild(outline);
      });

      // Update button position
      if (selectionInfo) {
        const topRect = Array.from(rects).reduce((min, rect) => 
          rect.top < min.top ? rect : min
        , Array.from(rects)[0]);

        setSelectionInfo({
          ...selectionInfo,
          position: {
            x: topRect.left + (topRect.width / 2),
            y: topRect.top - 40,
          },
        });
      }
    };

    document.addEventListener('mouseup', handleSelection);
    document.addEventListener('selectionchange', handleSelection);
    document.addEventListener('scroll', handleScroll, true);

    return () => {
      document.removeEventListener('mouseup', handleSelection);
      document.removeEventListener('selectionchange', handleSelection);
      document.removeEventListener('scroll', handleScroll, true);
      // Clean up any remaining outlines
      document.querySelectorAll('.selection-outline').forEach(el => el.remove());
    };
  }, [selectionInfo, nextBranchColor]);

  const handleCreateBranch = async () => {
    if (!selectionInfo) return;

    try {
      // First try to find the message in the current messages
      let originalMessage = messages.find(m => m.id === selectionInfo.messageId);

      if (!originalMessage) {
        // If not found, fetch the message from the API
        const response = await fetch(`/api/message?id=${selectionInfo.messageId}`);
        if (!response.ok) {
          throw new Error('Failed to find original message');
        }
        originalMessage = await response.json();
      }

      if (!originalMessage) {
        throw new Error('Original message not found');
      }

      const response = await fetch('/api/branch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [originalMessage], // Only send the original message
          messageId: selectionInfo.messageId,
          chatId,
          selectedText: selectionInfo.selectedText,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to branch chat');
      }

      const { chatId: branchedChatId } = await response.json();
      
      // Only add the branch to UI if the API call was successful
      addBranch(branchedChatId, true, selectionInfo.messageId, 'highlight', selectionInfo.selectedText);
      toast.success('Created branch from selected text');

      // Function to create a highlight span with the color from when selection was made
      const createHighlightSpan = () => {
        const span = document.createElement('span');
        span.className = `highlight-branch-${selectionInfo.branchColor.substring(1)}`;
        return span;
      };

      // Safely highlight the current selection in the main chat
      const selection = window.getSelection();
      if (selection && !selection.isCollapsed) {
        try {
          // Get the selected text nodes
          const range = selection.getRangeAt(0);
          const fragment = range.cloneContents();
          const tempDiv = document.createElement('div');
          tempDiv.appendChild(fragment);

          // Create a new range for each text node
          const textNodes = Array.from(tempDiv.childNodes);
          textNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
              const newRange = document.createRange();
              const originalNode = findCorrespondingNode(node, range.commonAncestorContainer);
              if (originalNode && originalNode.nodeType === Node.TEXT_NODE) {
                const text = node.textContent || '';
                const start = originalNode.textContent!.indexOf(text);
                if (start !== -1) {
                  newRange.setStart(originalNode, start);
                  newRange.setEnd(originalNode, start + text.length);
                  const span = createHighlightSpan();
                  try {
                    newRange.surroundContents(span);
                  } catch (e) {
                    console.warn('Could not highlight text node:', e);
                  }
                }
              }
            }
          });
        } catch (e) {
          console.warn('Could not highlight selection:', e);
        }
      }

      // Clear selection but keep outlines
      setSelectionInfo(null);
    } catch (error) {
      console.error('Failed to branch chat:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to branch chat');
    }
  };

  // Helper function to find corresponding node in the original DOM
  const findCorrespondingNode = (node: Node, ancestor: Node): Node | null => {
    const nodeText = node.textContent;
    const walker = document.createTreeWalker(
      ancestor,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (n) => {
          return n.textContent?.includes(nodeText || '') 
            ? NodeFilter.FILTER_ACCEPT 
            : NodeFilter.FILTER_SKIP;
        }
      }
    );

    let currentNode;
    while (currentNode = walker.nextNode()) {
      if (currentNode.textContent?.includes(nodeText || '')) {
        return currentNode;
      }
    }
    return null;
  };

  // Apply highlight from branch connection
  useEffect(() => {
    if (!highlightInfo) return;

    // Function to highlight text in a message
    const highlightTextInMessage = (messageId: string, text: string, color: string) => {
      const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
      if (!messageElement) return;

      // Check if this text is already highlighted
      const existingHighlight = Array.from(messageElement.querySelectorAll('span')).find(
        span => span.textContent === text && span.className.includes('highlight-branch-')
      );
      if (existingHighlight) return;

      // Create style for this color if it doesn't exist
      const styleId = `highlight-style-${color.substring(1)}`;
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
          .highlight-branch-${color.substring(1)} {
            position: relative;
            background-color: ${color}40;
            border: 2px solid ${color};
            border-radius: 4px;
          }
          .highlight-branch-${color.substring(1)}::before {
            content: '';
            position: absolute;
            inset: -4px;
            background-color: ${color};
            opacity: 0.15;
            border-radius: 6px;
            filter: blur(8px);
            z-index: -1;
          }
        `;
        document.head.appendChild(style);
      }

      // Find the text node containing the selected text
      const findTextNodeWithContent = (node: Node, searchText: string): Node | null => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent?.includes(searchText)) {
          return node;
        }
        for (const child of Array.from(node.childNodes)) {
          const result = findTextNodeWithContent(child, searchText);
          if (result) return result;
        }
        return null;
      };

      const textNode = findTextNodeWithContent(messageElement, text);
      if (!textNode) return;

      // Create a range for the selected text
      const range = document.createRange();
      const start = textNode.textContent!.indexOf(text);
      range.setStart(textNode, start);
      range.setEnd(textNode, start + text.length);

      // Create and insert the highlight span
      const span = document.createElement('span');
      span.className = `highlight-branch-${color.substring(1)}`;
      
      try {
        range.surroundContents(span);
      } catch (e) {
        console.error('Failed to highlight text:', e);
      }
    };

    // Find the message in the current chat that contains the highlighted text
    const findMessageWithText = (text: string) => {
      return messages.find(message => {
        const content = message.content as string | { content: string };
        return typeof content === 'string' 
          ? content.includes(text)
          : content.content?.includes(text);
      });
    };

    // Highlight in the branched message
    highlightTextInMessage(highlightInfo.messageId, highlightInfo.selectedText, highlightInfo.color);

    // Highlight in the main chat if this is a branched chat
    const messageWithText = findMessageWithText(highlightInfo.selectedText);
    if (messageWithText) {
      highlightTextInMessage(messageWithText.id, highlightInfo.selectedText, highlightInfo.color);
    }

    // Cleanup function to remove the style when component unmounts
    return () => {
      const styleId = `highlight-style-${highlightInfo.color.substring(1)}`;
      const style = document.getElementById(styleId);
      if (style) {
        document.head.removeChild(style);
      }
    };
  }, [highlightInfo, messages]);

  // Clean up highlights when component unmounts
  useEffect(() => {
    return () => {
      // Remove all highlight styles
      document.querySelectorAll('style[id^="highlight-style-"]').forEach(style => {
        document.head.removeChild(style);
      });
    };
  }, []);

  return (
    <>
      <div
        ref={messagesContainerRef}
        className="messages-container flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4 relative"
      >
        {messages.length === 0 && <Overview />}

        {branchedFromMessageId && (
          <div className="absolute left-[28px] top-0 bottom-0 w-px bg-gradient-to-b from-border to-transparent pointer-events-none" />
        )}

        {messages.map((message, index) => (
          <PreviewMessage
            chatId={chatId}
            key={message.id}
            message={message}
            messages={messages}
            isLoading={isLoading && index === messages.length - 1}
            index={index}
            vote={
              votes
                ? votes.find((vote) => vote.messageId === message.id)
                : undefined
            }
            setMessages={setMessages}
            reload={reload}
            isReadonly={isReadonly}
            showRecommendations={showRecommendations}
            isBranchedFrom={message.id === branchedFromMessageId}
          />
        ))}

        {isLoading &&
          messages.length > 0 &&
          messages[messages.length - 1].role === 'user' && <ThinkingMessage />}

        <div
          ref={messagesEndRef}
          className="shrink-0 min-w-[24px] min-h-[24px]"
        />
      </div>

      {selectionInfo && (
        <div
          className="fixed z-[100]"
          style={{
            left: selectionInfo.position.x,
            top: selectionInfo.position.y,
            transform: 'translateX(-50%)',
          }}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleCreateBranch}
                  style={{
                    backgroundColor: selectionInfo.branchColor,
                    color: 'white',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                  }}
                  className="flex items-center gap-2"
                >
                  <BranchIcon size={14} />
                  Create Branch
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create a new branch from this selection</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </>
  );
}

const areEqual = (prevProps: MessagesProps, nextProps: MessagesProps) => {
  return (
    equal(prevProps.messages, nextProps.messages) &&
    prevProps.isLoading === nextProps.isLoading &&
    equal(prevProps.votes, nextProps.votes) &&
    prevProps.isReadonly === nextProps.isReadonly &&
    prevProps.isArtifactVisible === nextProps.isArtifactVisible &&
    prevProps.showRecommendations === nextProps.showRecommendations &&
    prevProps.branchedFromMessageId === nextProps.branchedFromMessageId &&
    prevProps.nextBranchColor === nextProps.nextBranchColor &&
    equal(prevProps.highlightInfo, nextProps.highlightInfo)
  );
};

export const Messages = memo(PureMessages, areEqual);
