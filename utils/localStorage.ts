const THREADS_KEY = "forum_threads";
const COMMENTS_KEY = "forum_comments";

export const getThreadsFromLocalStorage = (): Thread[] => {
  if (typeof window !== "undefined") {
    const threads = localStorage.getItem(THREADS_KEY);
    const parsedThreads: Thread[] = threads ? JSON.parse(threads) : [];

    const comments = localStorage.getItem(COMMENTS_KEY);
    const allComments: ThreadComment[] = comments ? JSON.parse(comments) : [];

    return parsedThreads.map((thread) => {
      const commentCount = allComments.filter(
        (comment) => comment.thread === thread.id
      ).length;

      return { ...thread, commentCount, locked: thread.locked || false };
    });
  }
  return [];
};

export const saveThreadsToLocalStorage = (threads: Thread[]): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(THREADS_KEY, JSON.stringify(threads));
  }
};

export const getCommentsFromLocalStorage = (): ThreadComment[] => {
  if (typeof window !== "undefined") {
    const comments = localStorage.getItem(COMMENTS_KEY);
    return comments ? JSON.parse(comments) : [];
  }
  return [];
};

export const saveCommentsToLocalStorage = (comments: ThreadComment[]): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
  }
};

export const saveCommentToLocalStorage = (
  updatedComment: ThreadComment
): { success: boolean; error?: string } => {
  if (typeof window !== "undefined") {
    const comments = getCommentsFromLocalStorage();
    const updatedComments = updateCommentList(comments, updatedComment);
    saveCommentsToLocalStorage(updatedComments);
    return { success: true };
  }
  return { success: false, error: "Unable to save comment. Please try again." };
};

const updateCommentList = (
  comments: ThreadComment[],
  updatedComment: ThreadComment
): ThreadComment[] => {
  const updateReplies = (comments: ThreadComment[]): ThreadComment[] => {
    return comments.map((comment) => {
      if (comment.id === updatedComment.id) {
        return updatedComment;
      }
      if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: updateReplies(comment.replies),
        };
      }
      return comment;
    });
  };

  return updateReplies(comments);
};

export const lockThread = (threadId: number): void => {
  if (typeof window !== "undefined") {
    const threads = getThreadsFromLocalStorage();
    const updatedThreads = threads.map((thread) =>
      thread.id === threadId ? { ...thread, locked: true } : thread
    );
    saveThreadsToLocalStorage(updatedThreads);
  }
};

export const unlockThread = (threadId: number): void => {
  if (typeof window !== "undefined") {
    const threads = getThreadsFromLocalStorage();
    const updatedThreads = threads.map((thread) =>
      thread.id === threadId ? { ...thread, locked: false } : thread
    );
    saveThreadsToLocalStorage(updatedThreads);
  }
};

export const setCommentAsAnswer = (
  threadId: number,
  commentId: number
): void => {
  if (typeof window !== "undefined") {
    const threads = getThreadsFromLocalStorage();
    const comments = getCommentsFromLocalStorage();

    const updatedThreads = threads.map((thread) =>
      thread.id === threadId
        ? { ...thread, commentAnswerId: commentId, isAnswered: true }
        : thread
    );

    const updatedComments = comments.map((comment) =>
      comment.id === commentId
        ? { ...comment, isAnswer: true }
        : { ...comment, isAnswer: false }
    );

    saveThreadsToLocalStorage(updatedThreads);
    saveCommentsToLocalStorage(updatedComments);
  }
};

export const deleteThread = (threadId: number): void => {
  if (typeof window !== "undefined") {
    const threads = getThreadsFromLocalStorage();
    const updatedThreads = threads.filter((thread) => thread.id !== threadId);
    saveThreadsToLocalStorage(updatedThreads);

    const comments = getCommentsFromLocalStorage();
    const updatedComments = comments.filter(
      (comment) => comment.thread !== threadId
    );
    saveCommentsToLocalStorage(updatedComments);
  }
};
