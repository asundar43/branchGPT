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
}: MessagesProps) {
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();
  const { addBranch } = useBranchedChat();
  const [selectionInfo, setSelectionInfo] = useState<{
    messageId: string;
    selectedText: string;
    position: { x: number; y: number };
  } | null>(null);

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
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

      const rect = selection.getRangeAt(0).getBoundingClientRect();
      setSelectionInfo({
        messageId,
        selectedText,
        position: {
          x: rect.left + (rect.width / 2),
          y: rect.top - 40, // Position above the selection
        },
      });
    };

    document.addEventListener('mouseup', handleSelection);
    return () => {
      document.removeEventListener('mouseup', handleSelection);
    };
  }, []);

  const handleCreateBranch = async () => {
    if (!selectionInfo) return;

    try {
      const response = await fetch('/api/branch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages,
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
      setSelectionInfo(null);
    } catch (error) {
      console.error('Failed to branch chat:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to branch chat');
    }
  };

  return (
    <>
      <div
        ref={messagesContainerRef}
        className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4 relative"
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
          className="fixed z-50"
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
                  className="flex items-center gap-2"
                  onClick={handleCreateBranch}
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
    prevProps.branchedFromMessageId === nextProps.branchedFromMessageId
  );
};

export const Messages = memo(PureMessages, areEqual);
