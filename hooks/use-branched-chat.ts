import { create } from 'zustand';

interface BranchedChat {
  chatId: string;
  isNewBranch: boolean;
  branchedFromMessageId: string | undefined;
}

interface BranchedChatState {
  branches: BranchedChat[];
  addBranch: (chatId: string, isNewBranch?: boolean, branchedFromMessageId?: string) => void;
  removeBranch: (chatId: string) => void;
  show: (chatId: string, isNewBranch?: boolean, branchedFromMessageId?: string) => void;
}

export const useBranchedChat = create<BranchedChatState>((set) => ({
  branches: [],
  addBranch: (chatId: string, isNewBranch = false, branchedFromMessageId?: string) =>
    set((state) => {
      // Don't add if branch already exists
      if (state.branches.some(branch => branch.chatId === chatId)) {
        return state;
      }
      return {
        branches: [...state.branches, { chatId, isNewBranch, branchedFromMessageId }],
      };
    }),
  removeBranch: (chatId: string) =>
    set((state) => ({
      branches: state.branches.filter(branch => branch.chatId !== chatId),
    })),
  show: (chatId: string, isNewBranch = false, branchedFromMessageId?: string) =>
    set((state) => {
      // Don't add if branch already exists
      if (state.branches.some(branch => branch.chatId === chatId)) {
        return state;
      }
      return {
        branches: [...state.branches, { chatId, isNewBranch, branchedFromMessageId }],
      };
    }),
})); 