import { create } from 'zustand';

interface BranchedChat {
  chatId: string;
  isNewBranch: boolean;
  branchedFromMessageId: string | undefined;
  type: 'message' | 'highlight';
  selectedText?: string;
}

interface BranchedChatState {
  branches: BranchedChat[];
  addBranch: (chatId: string, isNewBranch?: boolean, branchedFromMessageId?: string, type?: 'message' | 'highlight', selectedText?: string) => void;
  removeBranch: (chatId: string) => void;
  show: (chatId: string, isNewBranch?: boolean, branchedFromMessageId?: string, type?: 'message' | 'highlight', selectedText?: string) => void;
}

export const useBranchedChat = create<BranchedChatState>((set) => ({
  branches: [],
  addBranch: (chatId, isNewBranch = false, branchedFromMessageId?: string, type: 'message' | 'highlight' = 'message', selectedText?: string) =>
    set((state) => {
      // Don't add if branch already exists
      if (state.branches.some(branch => branch.chatId === chatId)) {
        return state;
      }
      return {
        branches: [...state.branches, { chatId, isNewBranch, branchedFromMessageId, type, selectedText }],
      };
    }),
  removeBranch: (chatId) =>
    set((state) => ({
      branches: state.branches.filter(branch => branch.chatId !== chatId),
    })),
  show: (chatId, isNewBranch = false, branchedFromMessageId?: string, type: 'message' | 'highlight' = 'message', selectedText?: string) =>
    set((state) => {
      // Don't add if branch already exists
      if (state.branches.some(branch => branch.chatId === chatId)) {
        return state;
      }
      return {
        branches: [...state.branches, { chatId, isNewBranch, branchedFromMessageId, type, selectedText }],
      };
    }),
})); 