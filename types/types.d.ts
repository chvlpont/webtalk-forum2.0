type ThreadCategory = "THREAD" | "QNA";

type User = {
  userName: string;
  password?: string;
};

type Thread = {
  id: number;
  title: string;
  category: ThreadCategory;
  creationDate: string;
  description: string;
  creator: User;
  commentCount: number;
  locked?: boolean;
  tags: ThreadTag[];
};

type QNAThread = Thread & {
  category: "QNA";
  isAnswered: boolean;
  commentAnswerId?: number;
};

interface ThreadComment {
  id: number;
  thread: number;
  content: string;
  creator: { userName: string };
  creationDate: string;
  isAnswer?: boolean;
  replies?: ThreadComment[];
  parentCommentId?: number;
}

type ThreadTag = {
  id: number;
  name: string;
};
